import React from "react";
import { Link } from "react-router-dom";

const AgentDashboard: React.FC = () => {
  return (
    <div className="page">
      <h1>Agent Dashboard</h1>
      <div className="grid">
        <Link className="tile" to="/reports/new">
          New Report
        </Link>
        <Link className="title" to="/reports/upload">
          Upload CSV
        </Link>
        <Link className="title" to="/reports/mine">
          My Report
        </Link>
      </div>
    </div>
  );
};

export default AgentDashboard;
