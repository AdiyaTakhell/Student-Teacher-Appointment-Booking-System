import express from "express";
import * as controller from "./admin.controller.js";
import { auth, authorize } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// 1. Dashboard Stats
router.get("/stats", auth, authorize("admin"), controller.getStats);

// 2. Teacher Management (NEW)
router.get("/teachers", auth, authorize("admin"), controller.getAllTeachers); // List all
router.put("/teachers/:id/approve", auth, authorize("admin"), controller.approveTeacher); // Approve specific
router.delete("/teachers/:id", auth, authorize("admin"), controller.deleteTeacher); // Delete specific

export default router;