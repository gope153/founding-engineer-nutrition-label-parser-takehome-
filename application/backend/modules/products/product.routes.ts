import { Router } from "express";
import multer from "multer";
import path from "path";
import { config } from "../../config/environment";
import * as controller from "./product.controller";

const router = Router();

const storage = multer.diskStorage({
    destination: config.uploadsDir,
    filename: (_req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e4);
        cb(null, unique + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        cb(null, /\.(png|jpg|jpeg|webp)$/i.test(path.extname(file.originalname)));
    },
});

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.get("/:id/image", controller.getImage);
router.post("/upload", upload.single("image"), controller.upload);
router.patch("/:id/review", controller.updateReview);
router.patch("/:id/nutrient", controller.updateNutrient);

export default router;
