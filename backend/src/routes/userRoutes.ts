/**
 * File route user: khai bao endpoint user duoc bao ve boi role admin.
 */
import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { requireRole } from "../middleware/requireRole.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// Lay danh sach user public; chi admin moi truy cap duoc.
router.get("/", authenticateToken, requireRole("admin"), userController.getUsers);

export default router;
