// routes/liveMonitoringRoutes.js
import express from 'express';
import { startLiveMonitoringController, stopLiveMonitoringController } from '../controllers/liveMonitoringController.js';

const router = express.Router();

router.post('/start-live-monitoring', startLiveMonitoringController);


router.post('/stop-live-monitoring', stopLiveMonitoringController);

export default router;


