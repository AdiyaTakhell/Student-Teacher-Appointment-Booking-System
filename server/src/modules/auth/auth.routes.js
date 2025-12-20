import express from "express";
import * as controller from "./auth.controller.js";
import { auth } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile", auth, controller.getProfile);
router.get("/teachers", auth, controller.getTeachers); // Dropdown List
router.post("/change-password", auth, controller.updatePassword); // Settings

export default router;