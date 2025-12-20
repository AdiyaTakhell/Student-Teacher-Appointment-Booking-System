import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv"; 

// 1. Load env vars immediately
dotenv.config(); 

import authRoutes from "./modules/auth/auth.routes.js";
import appointmentRoutes from "./modules/appointments/appointment.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import messageRoutes from "./modules/messages/message.routes.js";
import { errorHandler } from "./shared/middleware/error.middleware.js";

const app = express();

// 2. Debug Log to confirm it works
console.log(" CORS Configured for:", process.env.CLIENT_URL);

app.use(
  cors({
    origin: [process.env.CLIENT_URL], // Matches your frontend URL
    credentials: true
  })
);

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());

// Rate Limiting
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);

//  Root Route for Browser Testing
app.get("/", (req, res) => {
  res.send("API is running successfully!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;