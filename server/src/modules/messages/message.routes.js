import express from "express";
import { getMessages, deleteMessage } from "./message.controller.js";
import { verifyToken } from "../../middleware/auth.middleware.js";

const router = express.Router();

// ✅ GET history
router.get("/:appointmentId", verifyToken, getMessages);

// ✅ DELETE message
router.delete("/:id", verifyToken, deleteMessage);

// ❌ DELETE OR REMOVE THIS LINE IF IT EXISTS:
// router.post("/", verifyToken, sendMessage);  <-- This is causing the crash!

export default router;