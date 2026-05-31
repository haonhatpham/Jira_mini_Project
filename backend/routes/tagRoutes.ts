/**
 * File route tag: khai bao endpoint doc danh sach tag.
 */
import express from "express";
import * as tagController from "../controllers/tagController.js";

const router = express.Router();

// Lay tat ca tag san pham.
router.get("/", tagController.getTags);

export default router;
