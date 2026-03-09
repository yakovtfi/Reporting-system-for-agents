import express from 'express';
import { createUserHandler, listUsersHandler } from '../controllers/adminController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();


router.post("/users", requireAuth,requireRole(["admin"]),createUserHandler);
router.get("/users",requireAuth, requireRole(["admin"]),listUsersHandler);

export default router;