import express from "express";
import * as controller from "./message.controller.js";
import { auth } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();
router.get("/:appointmentId", auth, controller.getMessages);
router.post("/", auth, controller.sendMessage);

export default router;