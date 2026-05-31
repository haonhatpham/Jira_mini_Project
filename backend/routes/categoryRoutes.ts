/**
 * File route category: khai bao endpoint doc danh sach category.
 */
import express from "express";
import * as categoryController from "../controllers/categoryController.js";

const router = express.Router();

// Lay tat ca category san pham.
router.get("/", categoryController.getCategories);

export default router;
