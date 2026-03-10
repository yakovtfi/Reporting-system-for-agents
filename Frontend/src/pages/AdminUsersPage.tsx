import React, {useState, useEffect} from 'react';
import api from '../services/api';

interface User {
    id: string,
    agentCode: string,
    fullName: string,
    role: string,
}

const AdminUsersPage:React.FC = () => {
    const [users, setUsers] = useState<User []>([]);
    const [agentCode, setAgentCode] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("agent");
    const [status, setStatus] = useState<string | null>(null);
    const [password, setPassword] = useState("");

    const loadUsers = async() =>{
        const {data} = await api.get("/admin/users")
        setUsers(data.users || [])
    };

    useEffect(() => {
        loadUsers().catch(() => setStatus("Failed to load users"))
    },[]);

    const handleCreate = async (event:React.FormEvent) =>{
        event.preventDefault();
        setStatus(null);
        try{
            const{data} = await api.post("/admin/users", {
                agentCode,
                fullName,
                role,
                password: password || undefined,
            });
            setStatus(`User creates inital password ${data.user.initialPasswordHint}`);
            setAgentCode("");
            setFullName("");
            setRole("agent")
            setPassword("");
            await loadUsers()
        } catch (_err){
            setStatus("Failed to create user")
        }
    }
  return (
    <div className='page'>
        <h1>Users</h1>
        <form className='form' onSubmit={handleCreate}>
            <label >
                Agent Code
                <input value={agentCode} onChange={(e) => setAgentCode(e.target.value)} />
            </label>
            <label>
                Full Name
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </label>
            <label>
                Role
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                </select>
            </label>
            <label>
                Optional Password
                <input value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {status && <div className='status'>{status}</div>}
            <button type='submit'>Create User</button>
        </form>

        <table className='table'>
            <thead>
                <tr>
                    <th>Agent Code</th>
                    <th>Full Name</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) =>(
                    <tr key={user.id}>
                        <td>{user.agentCode}</td>
                        <td>{user.fullName}</td>
                        <td>{user.role}</td>
                    </tr>
                ))}
                {users.length === 0 && (
                    <tr>
                        <td colSpan={3}>No users yet</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
  )
}

export default AdminUsersPage