import fs from "fs";
import path from "path";
import { processWithConcurrency } from "./helper/concurrency";
import { extractFromImage } from "./modules/extraction/extraction.service";
import { normalizeExtracted, normalizeServingSize } from "./modules/normalization/normalization.service";
import { getProcessedFilenames, createProduct } from "./modules/products/product.service";
import { NutrientDefinition } from "./models/nutrient";
import { NUTRIENT_DEFINITIONS } from "./modules/normalization/nutrient-definitions";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const CONCURRENCY = 5;

// Shared seed status — exposed to the status endpoint
export const seedStatus = {
	seeding: false,
	phase: "idle" as "idle" | "definitions" | "images" | "done",
	total: 0,
	processed: 0,
	currentFile: "",
};

function discoverImages(dir: string): string[] {
	return fs
		.readdirSync(dir)
		.filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
		.sort()
		.map((f) => path.join(dir, f));
}

async function seedDefinitions(): Promise<void> {
	seedStatus.phase = "definitions";
	for (const def of NUTRIENT_DEFINITIONS) {
		await NutrientDefinition.findOneAndUpdate(
			{ standard_name: def.standard_name },
			{
				standard_name: def.standard_name,
				category: def.category,
				aliases: def.aliases,
				default_unit: def.default_unit,
			},
			{ upsert: true }
		);
	}
	console.log(`[SEED] Seeded ${NUTRIENT_DEFINITIONS.length} nutrient definitions`);
}

async function seedFromImages(dir: string): Promise<void> {
	console.log(`[SEED] Looking for images in: ${dir}`);
	if (!fs.existsSync(dir)) {
		console.log(`[SEED] Directory not found, skipping image seed`);
		return;
	}

	const images = discoverImages(dir);
	const processed = await getProcessedFilenames();
	const unprocessed = images.filter((img) => !processed.has(path.basename(img)));

	if (unprocessed.length === 0) {
		console.log("[SEED] All sample images already processed");
		return;
	}

	seedStatus.phase = "images";
	seedStatus.total = unprocessed.length;
	seedStatus.processed = 0;

	console.log(`[SEED] Initial seed: extracting ${unprocessed.length} images...\n`);

	await processWithConcurrency(
		unprocessed,
		async (imagePath: string) => {
			const filename = path.basename(imagePath);
			seedStatus.currentFile = filename;
			console.log(`  [SEED] Extracting: ${filename}`);

			const raw = await extractFromImage(imagePath);
			const nutrients = normalizeExtracted(raw.nutrients);

			const flags = [];
			if (raw.image_quality.is_ai_generated) flags.push("AI-GENERATED");
			if (raw.image_quality.is_low_quality) flags.push("LOW-QUALITY");
			if (raw.image_quality.is_unreadable) flags.push("UNREADABLE");

			const servingSize = normalizeServingSize(raw.serving_size);

			await createProduct({
				filename,
				image_path: imagePath,
				product_name: raw.product_name,
				manufacturer: raw.manufacturer,
				serving_size: servingSize,
				servings_per_container: raw.servings_per_container,
				image_quality: raw.image_quality,
				nutrients,
			});

			seedStatus.processed++;
			const flagStr = flags.length > 0 ? ` [${flags.join(", ")}]` : "";
			const servingStr = servingSize ? `${servingSize.amount} ${servingSize.unit}` : "n/a";
			console.log(`  [SEED] -> ${nutrients.length} nutrients stored for ${filename} (serving: ${servingStr})${flagStr} [${seedStatus.processed}/${seedStatus.total}]`);
		},
		CONCURRENCY
	);

	console.log("\n[SEED] Image seeding complete");
}

export async function seedFromDirectory(dir: string): Promise<void> {
	seedStatus.seeding = true;
	try {
		await seedDefinitions();
		await seedFromImages(dir);
	} finally {
		seedStatus.seeding = false;
		seedStatus.phase = "done";
		seedStatus.currentFile = "";
	}
}
