import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

export const config = {
	port: Number(process.env.PORT) || 3000,
	mongoUri: process.env.MONGO_URI || "mongodb+srv://markusegonkuhn_db_user:npAMjPDn732bbV6I@label-parser-cluster-0.ian69qo.mongodb.net/nutrition-parser?appName=label-parser-cluster-0",
	uploadsDir: path.join(__dirname, "..", "uploads"),
	sampleImagesDir: path.join(__dirname, "..", "..", "..", "Sample_images"),
} as const;
