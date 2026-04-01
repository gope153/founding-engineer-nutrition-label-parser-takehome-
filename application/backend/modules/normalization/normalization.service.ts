import { NUTRIENT_MAP, UNIT_MAP } from "./nutrient-map";
import type { INutrient, IServingSize } from "../../models/product";
import type { RawServingSize } from "../extraction/extraction.service";

interface RawNutrient {
    nutrient_name_raw: string;
    amount: number | null;
    unit: string;
    nrv_percent?: number | null;
}

interface NormalizeResult {
    standard: string;
    matched: boolean;
}

const METADATA_TERMS = ["serving size", "servings per container", "amount per"];

const sortedKeys = Object.keys(NUTRIENT_MAP).sort((a, b) => b.length - a.length);

/**
* Resolve a raw nutrient name to its canonical identifier.
*/
export function normalizeNutrientName(raw: string, unit?: string): NormalizeResult {
    const lower = raw.toLowerCase().trim();

    if (NUTRIENT_MAP[lower]) return { standard: NUTRIENT_MAP[lower], matched: true };

    for (const key of sortedKeys) {
        if (lower.includes(key)) return { standard: NUTRIENT_MAP[key], matched: true };
    }

    const slugified = lower.replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    return { standard: slugified, matched: false };
}

/**
* Normalise a unit string to its canonical abbreviation.
*/
export function normalizeUnit(raw: string | undefined): string {
    if (!raw) return "";
    const lower = raw.toLowerCase().trim();
    return UNIT_MAP[lower] || raw.trim();
}

/**
* Take raw extraction results and return only recognised, normalised nutrients.
*/
export function normalizeExtracted(rawNutrients: RawNutrient[]): INutrient[] {
    const rows: INutrient[] = [];

    for (const entry of rawNutrients) {
        const lower = entry.nutrient_name_raw.toLowerCase();
        if (METADATA_TERMS.some((term) => lower.includes(term))) continue;

        const { standard, matched } = normalizeNutrientName(entry.nutrient_name_raw, entry.unit);

        rows.push({
            nutrient_name_raw: entry.nutrient_name_raw,
            nutrient_name_standard: standard,
            amount: entry.amount,
            unit: normalizeUnit(entry.unit),
            nrv_percent: entry.nrv_percent ?? null,
            matched,
        });
    }

    return rows;
}

/**
* Normalise a raw serving size — normalise the unit via UNIT_MAP.
*/
export function normalizeServingSize(raw: RawServingSize | null): IServingSize | null {
    if (!raw) return null;
    return {
        raw: raw.raw,
        amount: raw.amount,
        unit: normalizeUnit(raw.unit),
    };
}
