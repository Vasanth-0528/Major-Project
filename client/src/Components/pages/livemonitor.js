import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "../css/LiveMonitoring.css"; // Import the external CSS file
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert for pop-ups

const LiveMonitoring = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const socket = io("http://127.0.0.1:4000"); // Connect to the Flask Socket.IO server

  // Alert configuration (Object → Message + Sound)
  const alertConfig = {
    gun: { 
      message: "⚠️ Gun Detected! Stay Alert!", 
      sound: "/sounds/gun-alert.mp3", 
      icon: "error" 
    },
    knife: { 
      message: "🔪 Knife Detected! Proceed with Caution!", 
      sound: "/sounds/knife-alert.mp3", 
      icon: "warning" 
    },
    truck: { 
      message: "🚛 Unauthorized Truck Detected!", 
      sound: "/sounds/truck-alert.mp3", 
      icon: "info" 
    },
    chainsaw: { 
      message: "🛠️ Chainsaw Detected! High Risk of Danger!", 
      sound: "/sounds/chainsaw-alert.mp3", 
      icon: "error" 
    }
  };

  useEffect(() => {
    // Listen for object detection alerts from Flask backend
    socket.on("object-detection-alert", (data) => {
      console.log("Detected objects:", data.objects);
      setAlerts(data.objects); // Update alerts with detected objects

      // 🔔 Alert handling for each detected object
      data.objects.forEach((obj) => {
        const objectName = obj.toLowerCase(); // Convert object name to lowercase
        
        if (alertConfig[objectName]) {
          // 🎵 Play corresponding alert sound
          const alertSound = new Audio(alertConfig[objectName].sound);
          alertSound.play();

          // 🔔 Show specific alert pop-up
          Swal.fire({
            icon: alertConfig[objectName].icon,
            title: "⚠️ ALERT!",
            text: alertConfig[objectName].message,
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });
        }
      });
    });

    // Cleanup socket listener on unmount
    return () => {
      socket.off("object-detection-alert");
    };
  }, [socket]);

  const startMonitoring = () => {
    fetch("http://127.0.0.1:4000/start-live-monitoring", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsMonitoring(true);
      });
  };

  const stopMonitoring = () => {
    fetch("http://127.0.0.1:4000/stop-live-monitoring", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsMonitoring(false);
        setAlerts([]); // Clear alerts when monitoring stops
      });
  };

  return (
    <div className="monitoring-container">
      <h1 className="title">Live Object Detection</h1>

      <div className="button-group">
        <button onClick={startMonitoring} className="start-btn">Start Monitoring</button>
        <button onClick={stopMonitoring} className="stop-btn">Stop Monitoring</button>
        <Link to="/display">
          <button className="upload-btn">View Rec Vid</button>
        </Link>
      </div>

      {isMonitoring && (
        <div className="live-feed">
          <h2 className="feed-title">Live Feed</h2>
          <img src="http://127.0.0.1:4000/video_feed" alt="Live Stream" className="video-stream" />
        </div>
      )}

      {alerts.length > 0 && (
        <div className="alert-box">
          <h3>🚨 Alert! Objects Detected:</h3>
          <ul>
            {alerts.map((object, index) => (
              <li key={index} className="alert-item">{object}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LiveMonitoring;
