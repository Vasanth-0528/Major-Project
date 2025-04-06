import React, { useState } from "react";
import axios from "axios";
import "../css/UploadVideo.css"; // Import external CSS

function UploadVideo() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a video file first.");

    const formData = new FormData();
    formData.append("video", file);

    try {
      setUploading(true);
      await axios.post("http://localhost:5000/upload", formData);
      alert("🎉 Upload successful!");
      setFile(null);
    } catch (error) {
      alert("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h2>📤 Upload a Video</h2>
        <p>Select a video file to analyze smuggling activities.</p>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input"
        />

        {file && <p className="file-name">🎥 {file.name}</p>}

        <button className="upload-btn" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </div>
    </div>
  );
}

export default UploadVideo;
