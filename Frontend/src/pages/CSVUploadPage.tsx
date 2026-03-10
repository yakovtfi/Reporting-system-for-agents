import React, { useState } from "react";
import api from "../services/api";

const CsvUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setStatus("Please choose a CSV file.");
      return;
    }
    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const { data } = await api.post("/reports/csv", formData);
      setStatus(`Imported ${data.importedCount} reports.`);
      setFile(null);
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to import CSV. Please check the format.";
      setStatus(message);
    }
  };

  return (
    <div className="page">
      <h1>CSV Upload</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          CSV File
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {status && <div className="status">{status}</div>}
        <button type="submit">Upload CSV</button>
      </form>
      <div className="hint">
        <p>CSV format:</p>
        <pre>category,urgency,message</pre>
      </div>
    </div>
  );
};

export default CsvUploadPage;
