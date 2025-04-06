import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  filename: String,
  outputFile: String,
  detectedObjects: Array,
  uploadDate: { type: Date, default: Date.now },
});

const Image = mongoose.model("Image", ImageSchema);

export default Image;
