import React,{useState} from 'react';
import api from '../services/api';


const categories = ["intelligence", "logistics", "alert"]
const urgencies = ["low", "medium", "high"]


const NewReportPage:React.FC = () => {
    const [category, setCategory] = useState("intelligence");
    const [urgency, setUrgency] = useState("low");
    const [message, setMessage] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        setStatus(null);
        const formData = new FormData();
        formData.append("category", category);
        formData.append("urgency", urgency);
        formData.append("message", message)
        if(image){
            formData.append("image", image)
        }

        try{
            await api.post("/reports",formData,{
                headers: {"Content-Type": "multipart/form-data"}
            });
            setStatus("Report submit succssfully");
            setMessage("");
            setImage(null)
        }catch(_err){
            setStatus("Failed to submit report")
        }
    }
 return (
    <div className="page">
      <h1>New Report</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Urgency
          <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            {urgencies.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
        <label>
          Message
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
        </label>
        <label>
          Attach Image (optional)
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
        </label>
        {status && <div className="status">{status}</div>}
        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default NewReportPage