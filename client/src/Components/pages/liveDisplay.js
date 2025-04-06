import React, { useState, useEffect } from "react";
import "../css/LiveDisplay.css"; // Import external CSS

const LiveDisplay = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:4000/get-recorded-videos")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.videos);
      })
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  return (
    <div className="live-display-container">
      <h2 className="title">Recorded Videos</h2>
      {videos.length === 0 ? (
        <p className="no-videos">No videos recorded yet.</p>
      ) : (
        <div className="video-list">
          {videos.map((video, index) => (
            <div key={index} className="video-card">
              <h3 className="video-title">Video {index + 1}</h3>
              <video width="600" controls className="video-player">
                <source src={`http://127.0.0.1:4000/videos/${video}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveDisplay;
