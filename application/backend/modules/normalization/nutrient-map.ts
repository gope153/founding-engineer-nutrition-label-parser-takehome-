/**
* Generated lookup maps from nutrient-definitions.ts.
* These are used at runtime for fast normalization.
*/

import { NUTRIENT_DEFINITIONS, UNIT_DEFINITIONS } from "./nutrient-definitions";

// Build NUTRIENT_MAP: alias (lowercase) -> standard_name
export const NUTRIENT_MAP: Record<string, string> = {};
for (const def of NUTRIENT_DEFINITIONS) {
    for (const alias of def.aliases) {
        NUTRIENT_MAP[alias.toLowerCase()] = def.standard_name;
    }
}

// Build UNIT_MAP: alias (lowercase) -> canonical unit name
export const UNIT_MAP: Record<string, string> = {};
for (const def of UNIT_DEFINITIONS) {
    // Map the canonical name to itself
    UNIT_MAP[def.name.toLowerCase()] = def.name;
    for (const alias of def.aliases) {
        UNIT_MAP[alias.toLowerCase()] = def.name;
    }
}
