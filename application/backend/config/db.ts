import mongoose from "mongoose";
import { config } from "./environment";

export async function connect(): Promise<void> {
	await mongoose.connect(config.mongoUri);
	console.log("Connected to MongoDB");
}

export async function dropDatabase(): Promise<void> {
	await mongoose.connection.db!.dropDatabase();
}
