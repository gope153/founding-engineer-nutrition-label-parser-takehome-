import mongoose, { Document, Schema } from "mongoose";

export interface INutrientDefinition extends Document {
	standard_name: string;
	category: string;
	aliases: string[];
	default_unit: string;
	createdAt: Date;
	updatedAt: Date;
}

const nutrientDefinitionSchema = new Schema<INutrientDefinition>(
	{
		standard_name: { type: String, required: true, unique: true },
		category: { type: String, required: true },
		aliases: [{ type: String }],
		default_unit: { type: String, default: "" },
	},
	{ timestamps: true }
);

export const NutrientDefinition = mongoose.model<INutrientDefinition>(
	"NutrientDefinition",
	nutrientDefinitionSchema
);
