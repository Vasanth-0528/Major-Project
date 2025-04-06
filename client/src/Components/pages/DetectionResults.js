import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/ImageVideoDisplay.css"; // ✅ Import external CSS

const ImageVideoDisplay = () => {
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/detections/image") // ✅ Fetch detected media
      .then((response) => setDetections(response.data))
      .catch((error) => console.error("Error fetching detections:", error));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5">
        <u>📷 Uploaded & Processed Media 🎥</u>
      </h2>
      <div className="row">
        {detections.map((item, index) => (
          <div className="col-md-6" key={index}>
            <div className="media-card shadow-lg">
              <h5 className="text-center media-title">{item.filename}</h5>

              <div className="media-wrapper">
                {/* Left: Uploaded Media */}
                <div className="media-section">
                  <h6 className="text-primary">🆕 Uploaded</h6>
                  {item.filename.endsWith(".mp4") ||
                  item.filename.endsWith(".avi") ? (
                    <video width="100%" controls className="media-video">
                      <source
                        src={`http://localhost:5000/uploads/videos/${item.filename}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={`http://localhost:5000/uploads/images/${item.filename}`}
                      alt="Uploaded"
                      className="media-image"
                    />
                  )}
                </div>

                {/* Right: Processed Output */}
                {/* Right: Processed Output */}
                <div className="media-section">
                  <h6 className="text-danger">✅ Processed Output</h6>
                  {item.outputFile.endsWith(".mp4") ||
                  item.outputFile.endsWith(".avi") ? (
                    <video width="100%" controls className="media-video">
                      <source
                        src={`http://localhost:5000/${item.outputFile}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={`http://localhost:5000/output/${item.filename}`}
                      alt="Processed Output"
                      className="media-image"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageVideoDisplay;
