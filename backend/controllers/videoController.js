import Video from "../models/Video.js";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Alert objects to detect
const alertObjects = ["truck", "gun", "chainsaw", "knife"];

export const uploadVideo = async (req, res) => {
  console.log("📥 Request Body:", req.body);
  console.log("📂 Uploaded File:", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "No video uploaded" });
  }

  try {
    const inputFile = path.join(__dirname, "../uploads/videos", req.file.filename);
    const outputFilePath = path.join(__dirname, "../output", req.file.filename);
    const outputFile = `output/${req.file.filename}`; // ✅ Store relative path

    console.log(`🟢 Input File Path: ${inputFile}`);
    console.log(`🟢 Output File Path (for saving): ${outputFilePath}`);

    // Execute Python script for video detection
    exec(
      `python "${path.join(__dirname, "../detect_video.py")}" "${inputFile}" "${outputFilePath}"`,
      async (error, stdout, stderr) => {
        if (error) {
          console.error(`🔴 Python Errors: \n${stderr}`);
          return res.status(500).json({ message: "Detection failed", error: stderr });
        }

        console.log(`🔵 Python Script Output: \n${stdout}`);

        let jsonData;
        try {
          const jsonStart = stdout.indexOf("{");
          if (jsonStart === -1) throw new Error("Invalid JSON format in output");

          jsonData = JSON.parse(stdout.slice(jsonStart).trim());

          if (!jsonData.detections) throw new Error("Missing 'detections' field");
        } catch (err) {
          console.error("❌ JSON Parsing Error:", err.message);
          return res.status(500).json({ message: "Invalid detection output", rawOutput: stdout });
        }

        const uniqueDetectedNames = [...new Set(jsonData.detections.map(obj => obj.className))];

        const detectedAlerts = uniqueDetectedNames.filter(name => alertObjects.includes(name));

        let notificationMessage = "✅ Video processed successfully!";
        if (detectedAlerts.length > 0) {
          notificationMessage = `⚠️ Warning: Detected ${detectedAlerts.join(", ")}`;
        }

        console.log(`✅ Saving Output File Path: ${outputFile}`);

        // ✅ Save to MongoDB
        const newVideo = new Video({
          filename: req.file.filename,
          outputFile,
          detectedObjects: uniqueDetectedNames,
        });

        await newVideo.save();

        res.json({ message: notificationMessage, outputFile, detectedObjects: uniqueDetectedNames });
      }
    );
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};

// ✅ API to Fetch Processed Videos & Detections
export const getVideoDetections = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.error("❌ Error fetching detections:", error);
    res.status(500).json({ message: "❌ Error fetching detections", error });
  }
};
