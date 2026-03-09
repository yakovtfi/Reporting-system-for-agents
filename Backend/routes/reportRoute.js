import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as reportController from '../controllers/reportController.js';
import { requireAuth } from '../middleware/auth.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const upload = multer({
    dest: uploadDir,
  limits: {fileSize: 5 * 1024 * 1024}
});

export const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});


const router = express.Router();

router.post("/",requireAuth, upload.single("image"),reportController.createReportHandler);
router.post("/csv", requireAuth, memoryUpload.single("csvFile"),reportController.importCsvHandler);
router.get("/",requireAuth,reportController.listReportsHandler);
router.get("/:id", requireAuth, reportController.getReportHandler);

export default router;