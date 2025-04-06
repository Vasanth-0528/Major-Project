import React from "react";
import { NavLink } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        {/* Logo & Brand */}
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img src="adlogo.png" alt="Logo" className="nav-logo" />
          Smuggling Detection
        </NavLink>
        
        {/* Navbar Toggler for Mobile */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                <i className="bi bi-cloud-upload"></i> Upload Here
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/results">
                <i className="bi bi-image"></i> Results Img
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/vid">
                <i className="bi bi-camera-reels"></i> Results Vid
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/display">
                <i className="bi bi-broadcast"></i> Live Rec Vid
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
