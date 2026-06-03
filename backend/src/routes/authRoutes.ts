/**
 * File route auth: khai bao endpoint dang nhap va dang ky.
 */
import express from "express";
import * as authController from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  loginRequestSchema,
  registerRequestSchema,
} from "../schemas/authSchemas.js";

const router = express.Router();

// Dang ky user customer moi.
router.post("/register", validateRequest(registerRequestSchema), authController.register);

// Dang nhap user va tra JWT.
router.post("/login", validateRequest(loginRequestSchema), authController.login);

// Dang xuat stateless JWT; frontend se xoa token trong localStorage.
router.post("/logout", authController.logout);

export default router;
