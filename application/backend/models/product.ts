import mongoose, { Document, Schema } from "mongoose";

export interface INutrient {
	nutrient_name_raw: string;
	nutrient_name_standard: string;
	amount: number | null;
	unit: string;
	nrv_percent: number | null;
	matched: boolean;
}

export interface IServingSize {
	raw: string;
	amount: number | null;
	unit: string;
}

export interface IImageQuality {
	is_ai_generated: boolean;
	is_low_quality: boolean;
	is_unreadable: boolean;
	quality_notes: string;
}

export type ReviewStatus = "pending" | "approved" | "flagged" | "denied";

export interface IProduct extends Document {
	filename: string;
	image_path: string;
	product_name: string | null;
	manufacturer: string | null;
	serving_size: IServingSize | null;
	servings_per_container: number | null;
	image_quality: IImageQuality;
	review_status: ReviewStatus;
	nutrients: INutrient[];
	createdAt: Date;
	updatedAt: Date;
}

const nutrientSchema = new Schema<INutrient>(
	{
		nutrient_name_raw: { type: String, required: true },
		nutrient_name_standard: { type: String, required: true },
		amount: { type: Number, default: null },
		unit: { type: String, default: "" },
		nrv_percent: { type: Number, default: null },
		matched: { type: Boolean, default: true },
	},
	{ _id: false }
);

const servingSizeSchema = new Schema<IServingSize>(
	{
		raw: { type: String, default: "" },
		amount: { type: Number, default: null },
		unit: { type: String, default: "" },
	},
	{ _id: false }
);

const imageQualitySchema = new Schema<IImageQuality>(
	{
		is_ai_generated: { type: Boolean, default: false },
		is_low_quality: { type: Boolean, default: false },
		is_unreadable: { type: Boolean, default: false },
		quality_notes: { type: String, default: "" },
	},
	{ _id: false }
);

const productSchema = new Schema<IProduct>(
	{
		filename: { type: String, required: true, unique: true },
		image_path: { type: String, required: true },
		product_name: { type: String, default: null },
		manufacturer: { type: String, default: null },
		serving_size: { type: servingSizeSchema, default: null },
		servings_per_container: { type: Number, default: null },
		image_quality: { type: imageQualitySchema, default: () => ({}) },
		review_status: { type: String, enum: ["pending", "approved", "flagged", "denied"], default: "pending" },
		nutrients: [nutrientSchema],
	},
	{ timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
