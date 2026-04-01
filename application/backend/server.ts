import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

import { config } from "./config/environment";
import { connect } from "./config/db";
import productRoutes from "./modules/products/product.routes";
import unitRoutes from "./modules/units/unit.routes";
import nutrientRoutes from "./modules/nutrients/nutrient.routes";
import adminRoutes from "./modules/admin/admin.routes";
import { seedFromDirectory, seedStatus } from "./seed";

const app = express();

// Ensure uploads directory exists
if (!fs.existsSync(config.uploadsDir)) fs.mkdirSync(config.uploadsDir, { recursive: true });

// Middleware
app.use(express.json({ limit: "10mb" }));

// Static frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// API
app.use("/api/products", productRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/nutrients", nutrientRoutes);
app.use("/api/admin", adminRoutes);

// Seed status endpoint
app.get("/api/admin/status", (_req, res) => {
	res.json(seedStatus);
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	console.error("[ERROR]", err.message);
	res.status(500).json({ error: "Internal server error" });
});

// Start
async function start(): Promise<void> {
	await connect();

	// Start server immediately so frontend can connect
	app.listen(config.port, () => {
		console.log(`\nServer running on http://localhost:${config.port}`);
	});

	// Seed in background after server is up
	await seedFromDirectory(config.sampleImagesDir);
}

start().catch((err) => {
	console.error("Server failed to start:", err);
	process.exit(1);
});
