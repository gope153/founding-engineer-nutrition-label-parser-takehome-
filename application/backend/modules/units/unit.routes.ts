import { Router } from "express";
import * as controller from "./unit.controller";

const router = Router();

router.get("/", controller.list);

export default router;
