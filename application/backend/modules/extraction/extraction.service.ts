import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic();

const EXTRACTION_PROMPT = `You are a nutrition label parser. Analyze this product label image and extract ALL nutritional information visible.

Return a JSON object with this structure:

{
	"product_name": "product name as printed on the label, or null if not visible",
	"manufacturer": "brand / manufacturer name as printed, or null if not visible",
	"image_quality": {
		"is_ai_generated": true/false — does the image look AI-generated, rendered, or mockup-like? Check for: distorted/nonsensical text, unnatural lighting, warped edges, too-perfect gradients, inconsistent fonts, text that looks generated rather than printed,
		"is_low_quality": true/false — is the image blurry, low-resolution, or hard to read?,
		"is_unreadable": true/false — is the nutrition label completely unreadable or missing?,
		"quality_notes": "brief explanation of any issues detected, or 'clean' if no issues"
	},
	"serving_size": {
		"raw": "exactly as printed on the label, e.g. '1 scoop (6.54g)', '2 Kapseln', '50ml'",
		"amount": numeric value (e.g. 1, 2, 50),
		"unit": "unit as printed (ml, g, capsule, scoop, tablet, etc.)"
	} or null if not found. Do NOT combine with servings_per_container,
	"servings_per_container": number ONLY (e.g. 33, 60, 90). null if not found,
	"nutrients": [
		{
			"nutrient_name_raw": "exactly as printed on the label",
			"amount": numeric value (number, not string) or null if not readable,
			"unit": "unit as printed (mg, g, mcg, IU, kcal, kJ, etc.)",
			"nrv_percent": numeric value of %NRV / %Daily Value / %RI as printed, or null if not on label
		}
	]
}

Rules:
- Extract EVERY nutrient, vitamin, mineral, or supplement ingredient with a numeric amount
- Extract %NRV / %Daily Value / %RI as nrv_percent (just the number, e.g. 45 for "45%"). Set null if not listed for that nutrient
- Do NOT include serving size as a nutrient entry — put it in the top-level serving_size field
- IMPORTANT: For multilingual labels (e.g. DE/EN/NL/FR side by side), use ONLY the English name. If no English name exists, use the first language. Examples:
	- "Kollagenhydrolysat / Collagen Hydrolysate / ..." → "Collagen Hydrolysate"
	- "L-Leucin / L-Leucine / ..." → "L-Leucine"
	- "Creatin aus Creatin Monohydrat / Creatine from Creatine Monohydrate / ..." → "Creatine Monohydrate"
	- "davon / of which TENDOFORTE®" → "TENDOFORTE"
- Strip brand markers (® ™) from nutrient names
- For "of which" / "davon" sub-entries, use only the ingredient name (e.g. "TENDOFORTE" not "of which TENDOFORTE")
- Do NOT include carrier/container ingredients (e.g. "fish oil concentrate", "gelatin capsule") — only actual nutrients
- If a label has "per serving" and "per 100g" columns, use the "per serving" column
- If amount is a range or "<0.1", use the numeric part (e.g. 0.1)
- If NO nutritional information is visible (e.g. front-of-pack only), return with empty nutrients array and is_unreadable: true
- Return ONLY valid JSON, no markdown fences, no explanation`;

interface RawNutrient {
    nutrient_name_raw: string;
    amount: number | null;
    unit: string;
    nrv_percent: number | null;
}

export interface ImageQuality {
    is_ai_generated: boolean;
    is_low_quality: boolean;
    is_unreadable: boolean;
    quality_notes: string;
}

export interface RawServingSize {
    raw: string;
    amount: number | null;
    unit: string;
}

export interface RawExtraction {
    product_name: string | null;
    manufacturer: string | null;
    image_quality: ImageQuality;
    serving_size: RawServingSize | null;
    servings_per_container: number | null;
    nutrients: RawNutrient[];
}

const DEFAULT_QUALITY: ImageQuality = {
    is_ai_generated: false,
    is_low_quality: false,
    is_unreadable: false,
    quality_notes: "",
};

/**
* Extract raw nutrient data from a single product image via Claude Vision.
*/
export async function extractFromImage(imagePath: string): Promise<RawExtraction> {
    const ext = path.extname(imagePath).toLowerCase();
    const mediaType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
    const imageData = fs.readFileSync(imagePath).toString("base64");

    const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "image",
                        source: { type: "base64", media_type: mediaType, data: imageData },
                    },
                    { type: "text", text: EXTRACTION_PROMPT },
                ],
            },
        ],
    });

    const block = response.content[0];
    if (block.type !== "text") {
        return { product_name: null, manufacturer: null, image_quality: DEFAULT_QUALITY, serving_size: null, servings_per_container: null, nutrients: [] };
    }
    const text = block.text.trim();

    try {
        const jsonStr = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
        const parsed = JSON.parse(jsonStr);

        // Handle both old format (array) and new format (object with nutrients)
        if (Array.isArray(parsed)) {
            return { product_name: null, manufacturer: null, image_quality: DEFAULT_QUALITY, serving_size: null, servings_per_container: null, nutrients: parsed };
        }

        const quality = parsed.image_quality || DEFAULT_QUALITY;

        let servingSize: RawServingSize | null = null;
        if (parsed.serving_size) {
            if (typeof parsed.serving_size === "string") {
                servingSize = { raw: parsed.serving_size, amount: null, unit: "" };
            } else {
                servingSize = {
                    raw: parsed.serving_size.raw || "",
                    amount: parsed.serving_size.amount ?? null,
                    unit: parsed.serving_size.unit || "",
                };
            }
        }

        return {
            product_name: parsed.product_name || null,
            manufacturer: parsed.manufacturer || null,
            image_quality: {
                is_ai_generated: quality.is_ai_generated ?? false,
                is_low_quality: quality.is_low_quality ?? false,
                is_unreadable: quality.is_unreadable ?? false,
                quality_notes: quality.quality_notes || "",
            },
            serving_size: servingSize,
            servings_per_container: parsed.servings_per_container ?? null,
            nutrients: parsed.nutrients || [],
        };
    } catch {
        console.error(`  Failed to parse response for ${path.basename(imagePath)}`);
        return { product_name: null, manufacturer: null, image_quality: DEFAULT_QUALITY, serving_size: null, servings_per_container: null, nutrients: [] };
    }
}
