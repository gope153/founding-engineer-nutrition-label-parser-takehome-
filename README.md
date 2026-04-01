# Nutrition Label Parser

A Node.js pipeline that extracts, normalises, and structures nutritional data from product label images using Claude's vision capabilities.

## Quick Start

```bash
npm install
echo "ANTHROPIC_API_KEY=your_key" > source_code/.env
npm start
```

Output lands in `output/nutrition_data.csv`. Optionally pass custom paths:

```bash
npm start -- ./my_images ./my_output/data.csv
```

## What I Built

**Three modules, one pipeline:**

| Module | Responsibility |
|---|---|
| `extract.js` | Sends each image to Claude Sonnet's vision API with a structured extraction prompt. Returns raw JSON per image. |
| `nutrient-map.js` | Deterministic normalisation layer. Maps raw nutrient names → canonical identifiers and standardises units. |
| `csv-writer.js` | Writes the final structured dataset. |
| `pipeline.js` | Orchestrates: discover images → extract concurrently (5 parallel) → normalise → write CSV. |

**Why Claude Vision instead of OCR + NLP?**

Traditional OCR (Tesseract, etc.) struggles with the visual diversity in these labels — rotated text, curved packaging, low contrast, varying fonts. A multimodal LLM handles layout interpretation, text extraction, and basic semantic understanding in a single pass. This collapses what would be a 3–4 step pipeline (OCR → layout detection → text segmentation → entity extraction) into one reliable step.

**Why a separate normalisation layer instead of letting the LLM normalise?**

Determinism. LLMs are probabilistic — the same label might yield `vitamin_b12` one run and `b12` the next. The nutrient map provides a consistent, auditable, version-controlled mapping. The LLM extracts what it sees; the code normalises it. This separation makes both layers independently testable and debuggable.

## What I Decided Not to Build

- **% Daily Value extraction** — present on many labels but not in the requested schema. Easy to add as an optional column, but I stuck to the spec.
- **Serving size normalisation** — labels express serving sizes in wildly different ways ("1 scoop (6.54g)", "2 Kapseln", "1.5ml"). Normalising these requires unit-aware parsing that's a project in itself. I extract them as-is.
- **Duplicate detection across images** — product_10/product_01 and product_11/product_12 are the same products photographed differently. A production system would deduplicate, but that requires product identity resolution which is outside scope.
- **Confidence scores** — would be valuable in production (flag low-confidence extractions for human review), but Claude's API doesn't expose token-level probabilities for vision tasks.
- **Retry logic / rate limiting** — the pipeline runs 5 concurrent requests. For 13 images this is fine. At scale you'd want exponential backoff and a proper queue.

## The Hardest Part

**AI-generated and stylised images** (product_10, product_12).

Product_10 is an AI-generated image of the MindGuard box. It *looks* like a real nutrition label at first glance, but the text is nonsensical — the LLM hallucinates plausible-sounding nutrients ("Tocotrienol", "Ethanol 2000 IU") from visual noise. This is the most dangerous failure mode: confidently structured garbage. Product_12 is a stylised infographic version of a nutrition panel — same data as product_11 but in a radial design layout.

The ambiguity: should the system try to detect and reject unreadable/AI-generated labels? I chose not to add image authenticity detection — that's a separate problem. But in production this is critical. The right approach would be:
1. **Validation layer** — cross-reference extracted values against a known nutrient database. "Ethanol 2000 IU" doesn't exist and should be flagged.
2. **Confidence thresholding** — if extracted nutrients don't match any known compounds above a certain ratio, flag the image for human review.
3. **Cross-image deduplication** — product_01 and product_10 are the same product. If one extraction is clean and the other is garbage, prefer the clean one.

**German labels** (product_13) were surprisingly clean — Claude handles multilingual extraction well. The nutrient map includes German terms (`Fischöl-Konzentrat`, `davon EPA`) to ensure correct normalisation.

## What I'd Do Next

1. **Validation layer** — cross-reference extracted values against known nutrient ranges (e.g. Vitamin D > 1000µg per serving is almost certainly a misread)
2. **Schema extension** — add `serving_size`, `servings_per_container`, and `daily_value_percent` as proper columns
3. **Image pre-processing** — auto-rotation, contrast enhancement, and crop-to-label detection to improve extraction accuracy on difficult images
4. **Test suite** — snapshot tests comparing extraction output against manually verified ground truth for each sample image
5. **Streaming / batching** — for large image sets, stream results to CSV incrementally instead of holding everything in memory

## Output Schema

| Column | Description |
|---|---|
| `product_image` | Source filename |
| `nutrient_name_raw` | Exactly as printed on the label |
| `nutrient_name_standard` | Canonical snake_case identifier |
| `amount` | Numeric value |
| `unit` | Standardised unit (mg, g, µg, IU, kcal, kJ) |

## Architecture

```
Sample_images/
    │
    ▼
┌──────────┐     ┌────────────────┐     ┌────────────┐
│ pipeline │────▶│  extract.js    │────▶│ Claude API │
│   .js    │     │  (per image)   │     │  (Vision)  │
└──────────┘     └────────────────┘     └────────────┘
    │                    │
    │              raw JSON[]
    │                    │
    │            ┌───────▼────────┐
    │            │ nutrient-map   │
    │            │ (normalise)    │
    │            └───────┬────────┘
    │                    │
    │            normalised rows
    │                    │
    │            ┌───────▼────────┐
    └───────────▶│  csv-writer    │──▶ output/nutrition_data.csv
                 └────────────────┘
```
