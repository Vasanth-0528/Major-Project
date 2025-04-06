import React, { useEffect, useState } from "react";
import axios from "axios";

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/alerts").then((res) => setAlerts(res.data));
  }, []);

  return (
    <div>
      <h2>Smuggling Alerts</h2>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>{alert.timestamp} - {alert.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default Alerts;