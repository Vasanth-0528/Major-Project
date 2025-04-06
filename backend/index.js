import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import path from "path";

// Import your routes
import routes from "./routes/videoRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import liveMonitoringRoutes from "./routes/liveMonitoringRoutes.js";
import monitoringRoutes from "./routes/monitoringRoutes.js";

// Import HTTP and Socket.io
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.io properly
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Attach Socket.io to the app for global use
app.io = io;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Enable CORS for API requests
app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"] }));

app.use(express.json());
app.use(express.static("uploads"));

// Create the uploads folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Use routes
app.use("/", routes);
app.use("/", monitoringRoutes);
app.use("/uploads", express.static(path.join("uploads"))); // Serve static files from uploads directory
app.use("/", liveMonitoringRoutes); // Live monitoring routes
app.use("/", imageRoutes); // Image processing routes

// MongoDB Connection
mongoose
  .connect("mongodb+srv://vlaravind1234:1234@cluster0.vph5mzo.mongodb.net/ ")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Serve processed images/videos
app.use("/output", express.static("output"));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Export io
export { io };
