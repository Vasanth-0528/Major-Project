import Image from "../models/Imageschema.js";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const alertObjects = ["truck", "gun", "chainsaw", "knife"];

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const inputFile = path.join(__dirname, "../uploads/images", req.file.filename);
    const outputFile = path.join(__dirname, "../output", req.file.filename);

    // Execute Python script
    exec(`python "${path.join(__dirname, "../detect.py")}" "${inputFile}" "${outputFile}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`🔴 Python Errors: \n${stderr}`);
        return res.status(500).json({ message: "Detection failed", error: stderr });
      }


      console.log(`🔵 Python Script Output: \n${stdout}`);

      // ✅ Extract only the JSON part
      const jsonStart = stdout.indexOf("{");
      if (jsonStart === -1) {
        return res.status(500).json({ message: "Invalid detection output", rawOutput: stdout });
      }
      const jsonString = stdout.slice(jsonStart); // Remove logs before JSON

      let detectedObjects;
      try {
        detectedObjects = JSON.parse(jsonString).detections; // ✅ Now parsing only valid JSON
      } catch (err) {
        console.error("❌ Error parsing JSON:", err);
        return res.status(500).json({ message: "Invalid detection output", rawOutput: stdout });
      }

      // 🔔 Check for alert objects
      const detectedNames = detectedObjects.map(obj => obj.className); // Ensure your Python script outputs class names
      const detectedAlerts = detectedNames.filter(name => alertObjects.includes(name));

      let notificationMessage = "✅ Image processed successfully!";
      if (detectedAlerts.length > 0) {
        notificationMessage = `⚠️ Warning: Detected ${detectedAlerts.join(", ")}`;
      }

      // Save to MongoDB
      const newImage = new Image({
        filename: req.file.filename,
        outputFile,
        detectedObjects,
      });

      await newImage.save();

      res.json({ message: notificationMessage, outputFile, detectedObjects });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};


export const getDetections = async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching detections", error });
  }
};
