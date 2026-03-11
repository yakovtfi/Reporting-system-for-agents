import React, { useEffect, useState } from "react";
import api from "../services/api";

interface Report {
  id: string;
  userId: string;
  agentCode: string;
  category: string;
  urgency: string;
  message: string;
  createdAt: string;
  imagePath: string;
}

const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [agentCode, setAgentCode] = useState("");
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const loadReports = async () => {
    const { data } = await api.get("/reports", {
      params: {
        agentCode: agentCode || undefined,
        category: category || undefined,
        urgency: urgency || undefined,
      },
    });
    setReports(data.reports || []);
  };

  useEffect(() => {
    loadReports().catch(() => setStatus("Failed to load reports"));
  }, []);

  const handelFilter = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    try {
      await loadReports();
    } catch (_err) {
      setStatus("Failed to load reports");
    }
  };

  return (
    <div className="page">
      <h1>Reports</h1>
      <form className="form" onSubmit={handelFilter}>
        <label>
          Agent Code
          <input
            value={agentCode}
            onChange={(e) => setAgentCode(e.target.value)}
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="intelligence">Intelligence</option>
            <option value="logistics">Logistics</option>
            <option value="alert">Alert</option>
          </select>
        </label>
        <label>
          Urgency
          <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        {status && <div className="status">{status}</div>}
        <button type="submit">Apply Filters</button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Category</th>
            <th>Urgency</th>
            <th>Date</th>
            <th>Message</th>
            <th>image</th>
          </tr>
        </thead>
        <tbody>
        {reports.map((report) => (
          <tr key={report.id}>
            <td>{report.agentCode ?? report.userId}</td>
            <td>{report.category}</td>
            <td>{report.urgency}</td>
            <td>{new Date(report.createdAt).toLocaleString()}</td>
            <td>{report.message}</td>
            <td>
                {report.imagePath ? (
                  <a href={`${api.defaults.baseURL}${report.imagePath}`} target="_blank" rel="noreferrer">
                    <img src={`${api.defaults.baseURL}${report.imagePath}`} alt="report" />
                  </a>
                ) : (
                  <span>—</span>
                )}
              </td>
          </tr>
        ))}
        {reports.length === 0 && (
          <tr>
            <td colSpan={5}>No reports found</td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReportsPage;
