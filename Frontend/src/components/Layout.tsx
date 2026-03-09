import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <header className="header">
        <div className="brand">Agent Reporting</div>
        <nav className="nav">
          {user?.role === "agent" && (
            <>
              <Link to="/agent">Dashboard</Link>
              <Link to="/reports/new">New Report</Link>
              <Link to="/reports/upload">CSV Upload</Link>
              <Link to="/reports/mine">My Reports</Link>
            </>
          )}
          {user?.role === "admin" && (
            <>
              <Link to="/admin">Admin</Link>
              <Link to="/admin/users">Users</Link>
              <Link to="/admin/reports">Reports</Link>
            </>
          )}
        </nav>
        {user && (
          <div className="user-info">
            <span>{user.fullName}</span>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </header>
      <main className="main">{children}</main>
    </div>
  );
};

export default Layout;
