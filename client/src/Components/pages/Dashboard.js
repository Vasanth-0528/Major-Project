import React, { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/Dashboard.css";

function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "warning",
        title: "No File Selected",
        text: "Please select an image or video to upload.",
      });
      return;
    }
  
    const fileType = selectedFile.type.startsWith("image") ? "image" : "video";
    const formData = new FormData();
    formData.append(fileType, selectedFile);
  
    setLoading(true);
  
    try {
      const response = await axios.post(`http://localhost:5000/upload/${fileType}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setLoading(false);
  
      const { detectedObjects, message } = response.data;
      console.log("✅ Upload Success:", response.data);
  
      // 🔔 Alert configuration (Object → Message + Sound)
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
  
      let alertTriggered = false;
  
      detectedObjects.forEach((obj) => {
        // If obj is a string (video case), use it directly; otherwise, get obj.className
        const objectName = typeof obj === "string" ? obj.toLowerCase() : obj.className?.toLowerCase();
      
        if (!objectName) return;
        
        if (alertConfig[objectName]) {
          alertTriggered = true;
  
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
  
      // ✅ If no special objects detected, show a success message
      if (!alertTriggered) {
        Swal.fire({
          icon: "success",
          title: "✅ File Processed",
          text: message,
          timer: 2000,
        });
      }
  
      navigate("/results");
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Something went wrong. Please try again!",
      });
      console.error("❌ Upload Error:", error);
    }
  };
  

  return (
    <div className="dashboard-container">
      <div className="overlay">
        <div className="dashboard-content text-center">
          <h1>🚀 Real-Time Smuggling Detection System</h1>
          <p>Choose an image or video to start the detection process.</p>

         <div className="button-group">

          <div className="upload-section">
          <input
              type="file"
              accept="image/*, video/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="file-input w-100"
            />
          </div>
          
         <div className="upload-section">
            
            <button className="upload-btn" onClick={handleUpload} disabled={loading}>
              {loading ? <span className="spinner"></span> : "📤 Upload File"}
            </button>
          </div>

          <div className="upload-section">
          <Link to="/live">
            <button className="upload-btn">🔴 Live Monitoring</button>
          </Link>
        </div>

         </div>
         
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
