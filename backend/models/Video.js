import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  outputFile: { type: String, required: true },
  detectedObjects: { type: Array, default: [] }, // Array of detected objects
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Video", videoSchema);
