import fs from 'fs';
import path from 'path';
import { PythonShell } from 'python-shell';
import ffmpeg from 'fluent-ffmpeg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { io } from '../index.js';

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputDirectory = path.join(__dirname, '../output');
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

// Function to start live monitoring (recording video)
const startLiveMonitoring = (duration = 60) => {
  const videoFilename = `live_monitoring_${Date.now()}.mp4`;
  const videoPath = path.join(outputDirectory, videoFilename);

  // Corrected FFmpeg command with the right webcam name
  let videoStream = ffmpeg()
    .input('video=Integrated Webcam')  // ✅ Use the correct webcam name
    .inputFormat('dshow')              // ✅ Required for Windows devices
    .output(videoPath)
    .videoCodec('libx264')
    .outputOptions('-preset', 'fast')
    .duration(duration)
    .on('end', () => {
      console.log(`Video saved at ${videoPath}`);
      runObjectDetection(videoPath);
    })
    .on('error', (err) => {
      console.error('FFmpeg error:', err);
    });

  videoStream.run();

  return videoPath;
};

// Function to run YOLO object detection on the recorded video
const runObjectDetection = (videoPath) => {
  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    args: [videoPath],
  };

  PythonShell.run('detect.py', options, (err, results) => {
    if (err) {
      console.error("Error running Python script", err);
    } else {
      console.log('Detection Results:', results);
      const detectedObjects = results.filter(result => 
        result.includes('knife') || result.includes('gun') || 
        result.includes('chainsaw') || result.includes('truck')
      );

      // Notify frontend via socket if relevant objects are detected
      if (detectedObjects.length > 0) {
        io.emit('object-detection-alert', { message: 'Relevant objects detected', objects: detectedObjects });
        console.log('Relevant objects detected:', detectedObjects);
      }
    }
  });
};

export { startLiveMonitoring, runObjectDetection };
