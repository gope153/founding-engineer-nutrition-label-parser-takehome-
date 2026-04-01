import { NutrientDefinition, INutrientDefinition } from "../../models/nutrient";
import { Product } from "../../models/product";

export async function getAllNutrients(): Promise<INutrientDefinition[]> {
    return NutrientDefinition.find().sort({ category: 1, standard_name: 1 }).lean();
}

export async function getNutrientByStandardName(
    standardName: string
): Promise<INutrientDefinition | null> {
    return NutrientDefinition.findOne({ standard_name: standardName }).lean();
}

export interface UnmatchedNutrient {
    nutrient_name_raw: string;
    nutrient_name_standard: string;
    occurrences: number;
    example_amount: number | null;
    example_unit: string;
}

export async function getUnmatchedNutrients(): Promise<UnmatchedNutrient[]> {
    const results = await Product.aggregate([
        { $unwind: "$nutrients" },
        { $match: { "nutrients.matched": false } },
        {
            $group: {
                _id: "$nutrients.nutrient_name_standard",
                nutrient_name_raw: { $first: "$nutrients.nutrient_name_raw" },
                occurrences: { $sum: 1 },
                example_amount: { $first: "$nutrients.amount" },
                example_unit: { $first: "$nutrients.unit" },
            },
        },
        { $sort: { occurrences: -1 } },
    ]);

    return results.map((r) => ({
        nutrient_name_raw: r.nutrient_name_raw,
        nutrient_name_standard: r._id,
        occurrences: r.occurrences,
        example_amount: r.example_amount,
        example_unit: r.example_unit,
    }));
}

export async function addNutrientDefinition(
    standardName: string,
    category: string,
    aliases: string[],
    defaultUnit: string
): Promise<INutrientDefinition> {
    const def = await NutrientDefinition.create({
        standard_name: standardName,
        category,
        aliases,
        default_unit: defaultUnit,
    });

    // Re-match all products that have this nutrient as unmatched
    await Product.updateMany(
        { "nutrients.nutrient_name_standard": standardName, "nutrients.matched": false },
        { $set: { "nutrients.$[elem].matched": true } },
        { arrayFilters: [{ "elem.nutrient_name_standard": standardName }] }
    );

    return def;
}
