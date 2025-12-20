import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./modules/auth/auth.routes.js";
import appointmentRoutes from "./modules/appointments/appointment.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Define Allowed Origins (Localhost + Live Vercel)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL // Live Production
];

// --- SOCKET.IO SETUP ---
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());

// --- CORS SETUP ---
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

// --- SOCKET LOGIC ---
io.on("connection", (socket) => {
  console.log(`⚡ Client Connected: ${socket.id}`);

  // Join Room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Handle sending messages (Real-time only, )
  socket.on("send_message", (data) => {
    // Send to everyone in the room EXCEPT sender
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// --- DATABASE & SERVER ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});