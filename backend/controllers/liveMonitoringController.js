import { startLiveMonitoring } from '../models/liveMonitoring.js';


const startLiveMonitoringController = (req, res) => {
  try {
    const videoPath = startLiveMonitoring(60); 
    res.status(200).json({ message: 'Live Monitoring Started', videoPath });
  } catch (error) {
    res.status(500).json({ error: 'Error starting live monitoring' });
  }
};

const stopLiveMonitoringController = (req, res) => {
  try {

    res.status(200).json({ message: 'Live Monitoring Stopped' });
    // Emit a stop event via socket (to notify frontend)
    req.app.io.emit('live-monitoring-stopped', { message: 'Live Monitoring has stopped.' });
  } catch (error) {
    res.status(500).json({ error: 'Error stopping live monitoring' });
  }
};

export { startLiveMonitoringController, stopLiveMonitoringController };
