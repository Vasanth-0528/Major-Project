import express from "express";
import multer from "multer";
import { uploadVideo, getVideoDetections } from "../controllers/videoController.js";

const router = express.Router();

// Multer configuration for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
router.post("/upload/video", upload.single("video"), uploadVideo);
router.get("/detections", getVideoDetections);


export default router;
