import { Request, Response } from "express";
import * as nutrientService from "./nutrient.service";
import { TRANSLATIONS } from "../normalization/translations";

export async function list(_req: Request, res: Response): Promise<void> {
		const nutrients = await nutrientService.getAllNutrients();
		res.json(nutrients);
}

export function translations(_req: Request, res: Response): void {
	res.json(TRANSLATIONS);
}

export async function unmatched(_req: Request, res: Response): Promise<void> {
		const results = await nutrientService.getUnmatchedNutrients();
		res.json(results);
}

export async function add(req: Request, res: Response): Promise<void> {
		const { standard_name, category, aliases, default_unit } = req.body;

		if (!standard_name || !category || !default_unit) {
				res.status(400).json({ error: "standard_name, category, and default_unit are required" });
				return;
		}

		try {
				const def = await nutrientService.addNutrientDefinition(
						standard_name,
						category,
						aliases || [standard_name],
						default_unit
				);
				res.status(201).json(def);
		} catch (err) {
				console.error("Failed to add nutrient:", (err as Error).message);
				res.status(500).json({ error: "Failed to add nutrient definition" });
		}
}
