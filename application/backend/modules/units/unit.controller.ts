import { Request, Response } from "express";
import { getAllUnits } from "./unit.service";

export function list(_req: Request, res: Response): void {
	res.json(getAllUnits());
}
