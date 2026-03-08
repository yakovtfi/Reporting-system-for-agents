import { createUser, listUsers } from "../services/userService.js";

export const createUserHandler = async (req, res) => {
  const { agentCode, fullName, role, password } = req.body || {};

  if (!agentCode || !fullName || !role) {
    res.status(400).json({ message: "agentCode, fullName, and role are required" });
    return;
  }

  try {
    const { user, initialPasswordHint } = await createUser({
      agentCode,
      fullName,
      role,
      password,
    });
    res.status(201).json({
      user: {
        id: user.id,
        agentCode: user.agentCode,
        fullName: user.fullName,
        role: user.role,
        initialPasswordHint,
      },
    });
  } catch (error) {
    if (error && error.message === "AGENT_CODE_EXISTS") {
      res.status(409).json({ message: "agentCode already exists" });
      return;
    }
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const listUsersHandler = async (_req, res) => {
  const users = await listUsers();
  res.json({ users });
};
