import { Request, Response } from "express";
import fs from "fs";
import mongoose from "mongoose";
import * as productService from "./product.service";
import { extractFromImage } from "../extraction/extraction.service";
import { normalizeExtracted, normalizeServingSize } from "../normalization/normalization.service";
import { ReviewStatus } from "../../models/product";

function isValidObjectId(id: string): boolean {
	return mongoose.Types.ObjectId.isValid(id);
}

export async function list(_req: Request, res: Response): Promise<void> {
	const products = await productService.getAllProducts();
	res.json(products);
}

export async function getById(req: Request, res: Response): Promise<void> {
	const id = req.params.id as string;
	if (!isValidObjectId(id)) {
		res.status(400).json({ error: "Invalid product ID" });
		return;
	}
	const product = await productService.getProductById(id);
	if (!product) {
		res.status(404).json({ error: "Product not found" });
		return;
	}
	res.json(product);
}

export async function getImage(req: Request, res: Response): Promise<void> {
	const id = req.params.id as string;
	if (!isValidObjectId(id)) {
		res.status(400).json({ error: "Invalid product ID" });
		return;
	}
	const product = await productService.getProductById(id);
	if (!product) {
		res.status(404).json({ error: "Product not found" });
		return;
	}
	if (!fs.existsSync(product.image_path)) {
		res.status(404).json({ error: "Image not found" });
		return;
	}
	res.sendFile(product.image_path);
}

export async function upload(req: Request, res: Response): Promise<void> {
	if (!req.file) {
		res.status(400).json({ error: "No image uploaded" });
		return;
	}

	try {
		const raw = await extractFromImage(req.file.path);
		const nutrients = normalizeExtracted(raw.nutrients);
		const product = await productService.createProduct({
			filename: req.file.originalname,
			image_path: req.file.path,
			product_name: raw.product_name,
			manufacturer: raw.manufacturer,
			serving_size: normalizeServingSize(raw.serving_size),
			servings_per_container: raw.servings_per_container,
			image_quality: raw.image_quality,
			nutrients,
		});
		res.status(201).json(product);
	} catch (err) {
		try { fs.unlinkSync(req.file.path); } catch { /* file already gone */ }
		console.error("Upload processing failed:", (err as Error).message);
		res.status(500).json({ error: "Failed to process image" });
	}
}

const VALID_STATUSES: ReviewStatus[] = ["pending", "approved", "flagged", "denied"];

export async function updateReview(req: Request, res: Response): Promise<void> {
	const id = req.params.id as string;
	if (!isValidObjectId(id)) {
		res.status(400).json({ error: "Invalid product ID" });
		return;
	}
	const { status } = req.body;
	if (!VALID_STATUSES.includes(status)) {
		res.status(400).json({ error: `Invalid status. Use: ${VALID_STATUSES.join(", ")}` });
		return;
	}

	const product = await productService.updateReviewStatus(id, status as ReviewStatus);
	if (!product) {
		res.status(404).json({ error: "Product not found" });
		return;
	}
	res.json(product);
}

export async function updateNutrient(req: Request, res: Response): Promise<void> {
	const id = req.params.id as string;
	if (!isValidObjectId(id)) {
		res.status(400).json({ error: "Invalid product ID" });
		return;
	}
	const { index, standard_name } = req.body;
	if (index == null || typeof index !== "number" || !standard_name || typeof standard_name !== "string") {
		res.status(400).json({ error: "index (number) and standard_name (string) are required" });
		return;
	}

	const product = await productService.updateNutrientStandardName(id, index, standard_name);
	if (!product) {
		res.status(404).json({ error: "Product or nutrient not found" });
		return;
	}
	res.json(product);
}
