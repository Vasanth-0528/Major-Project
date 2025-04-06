import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url"; // ✅ Fix path issue
import fs from "fs";
import { uploadImage, getDetections } from "../controllers/imageController.js";

const router = express.Router();

// Fix path issues
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const ensureUploadFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};
ensureUploadFolder(path.join(__dirname, "../uploads/images"));
ensureUploadFolder(path.join(__dirname, "../output"));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/images")); // ✅ Ensure folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ✅ Unique filename
  },
});

const upload = multer({ storage });

// Routes
router.post("/upload/image", upload.single("image"), uploadImage);
router.get("/detections/image", getDetections);

export default router;
