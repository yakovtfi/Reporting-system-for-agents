import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [agentCode, setAgentCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(agentCode, password);
      navigate(user.role === "admin" ? "/admin" : "/agent");
    } catch (_err) {
      setError("Invalid agent code or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Login</h1>
        <p>Use your agent code and Atbash password.</p>
        <form onSubmit={onSubmit} className="form">
          <label>
            Agent Code
            <input value={agentCode} onChange={(e) => setAgentCode(e.target.value)} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
