import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/pages/Navbar";
import Dashboard from "./Components/pages/Dashboard";
import UploadVideo from "./Components/pages/UploadVideo";
import DetectionResults from "./Components/pages/DetectionResults";
import DetectionVid from "./Components/pages/DetectionVid";
import Alerts from "./Components/pages/Alerts";
import "bootstrap/dist/css/bootstrap.min.css";
import Livemonitor from "./Components/pages/livemonitor";
import LiveDisplay1 from "./Components/pages/liveDisplay";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/results" element={<DetectionResults />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/vid" element={<DetectionVid />} />
          <Route path="/live" element={<Livemonitor />} />
          <Route path="/display" element={<LiveDisplay1 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;