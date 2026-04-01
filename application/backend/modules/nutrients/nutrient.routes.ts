import { Router } from "express";
import * as controller from "./nutrient.controller";

const router = Router();

router.get("/", controller.list);
router.get("/translations", controller.translations);
router.get("/unmatched", controller.unmatched);
router.post("/", controller.add);

export default router;
