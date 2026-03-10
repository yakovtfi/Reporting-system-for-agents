import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Report {
  id: string;
  agentCode?: string | null;
  category: string;
  urgency: string;
  message: string;
  createdAt: string;
}

const MyReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/reports");
        setReports(data.reports || []);
      } catch (_err) {
        setStatus("Failed to load reports.");
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <h1>My Reports</h1>
      {status && <div className="error">{status}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Category</th>
            <th>Urgency</th>
            <th>Date</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.agentCode ?? user?.agentCode ?? ""}</td>
              <td>{report.category}</td>
              <td>{report.urgency}</td>
              <td>{new Date(report.createdAt).toLocaleString()}</td>
              <td>{report.message}</td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={5}>No reports yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyReportsPage;
