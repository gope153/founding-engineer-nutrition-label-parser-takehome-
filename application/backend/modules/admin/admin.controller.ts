import { Request, Response } from "express";
import mongoose from "mongoose";
import { config } from "../../config/environment";
import { seedFromDirectory } from "../../seed";

export async function resetDatabase(_req: Request, res: Response): Promise<void> {
	try {
		console.log("\n[ADMIN] Reset requested...");
		const collections = await mongoose.connection.db!.collections();
		for (const collection of collections) {
			console.log(`[ADMIN]   Dropping collection: ${collection.collectionName}`);
			await collection.drop();
		}
		console.log("[ADMIN] Reset complete — all collections dropped\n");
		res.json({ message: "Database reset successfully" });
	} catch (err) {
		console.error("[ADMIN] Reset failed:", (err as Error).message);
		res.status(500).json({ error: "Failed to reset database" });
	}
}

export async function reseed(_req: Request, res: Response): Promise<void> {
	try {
		console.log("\n[ADMIN] Re-seed requested...");
		res.json({ message: "Seeding started" });
		const start = Date.now();
		await seedFromDirectory(config.sampleImagesDir);
		const duration = ((Date.now() - start) / 1000).toFixed(1);
		console.log(`[ADMIN] Re-seed complete (${duration}s)\n`);
	} catch (err) {
		console.error("[ADMIN] Re-seed failed:", (err as Error).message);
	}
}

export async function resetAndReseed(_req: Request, res: Response): Promise<void> {
	try {
		console.log("\n[ADMIN] Reset & re-seed requested...");
		const start = Date.now();

		const collections = await mongoose.connection.db!.collections();
		for (const collection of collections) {
			console.log(`[ADMIN]   Dropping collection: ${collection.collectionName}`);
			await collection.drop();
		}
		console.log("[ADMIN] Reset complete — starting re-seed...");

		res.json({ message: "Database reset, seeding started..." });
		await seedFromDirectory(config.sampleImagesDir);

		const duration = ((Date.now() - start) / 1000).toFixed(1);
		console.log(`[ADMIN] Reset & re-seed complete (${duration}s)\n`);
	} catch (err) {
		console.error("[ADMIN] Reset & reseed failed:", (err as Error).message);
	}
}
