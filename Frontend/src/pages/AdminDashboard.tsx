import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <div className="grid">
        <Link className="title" to="/admin/users">
          Manage Users
        </Link>
        <Link className="title" to="/admin/reports">
          View Reports
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
