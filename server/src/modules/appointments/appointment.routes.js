import express from "express";
import * as controller from "./appointment.controller.js";
import { auth, authorize } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.post("/", auth, authorize("student"), controller.createAppointment);
router.get("/", auth, authorize("student", "teacher", "admin"), controller.getAppointments);
router.put("/:id/status", auth, authorize("teacher"), controller.updateStatus);

export default router;