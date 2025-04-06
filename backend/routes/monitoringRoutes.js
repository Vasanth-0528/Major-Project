import express from "express";
import { startLiveMonitoring, stopLiveMonitoring } from "../controllers/monitoringController.js";

const router = express.Router();

router.post("/start-live-monitoring", startLiveMonitoring);
router.post("/stop-live-monitoring", stopLiveMonitoring);

export default router;
