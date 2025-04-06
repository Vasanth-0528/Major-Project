import { spawn } from "child_process";

let pythonProcess = null;

export const startLiveMonitoring = (req, res) => {
    if (!pythonProcess) {
        pythonProcess = spawn("python", ["yolo_server.py"]);
        console.log("YOLO server started.");
    }
    res.json({ message: "Live monitoring started", videoUrl: "/video_feed" });
};

export const stopLiveMonitoring = (req, res) => {
    if (pythonProcess) {
        pythonProcess.kill();
        pythonProcess = null;
        console.log("YOLO server stopped.");
    }
    res.json({ message: "Live monitoring stopped" });
};
