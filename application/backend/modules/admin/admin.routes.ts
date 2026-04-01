import { Router } from "express";
import * as controller from "./admin.controller";

const router = Router();

router.post("/reset", controller.resetDatabase);
router.post("/seed", controller.reseed);
router.post("/reset-and-seed", controller.resetAndReseed);

export default router;
