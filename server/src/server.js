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

// ✅ 1. Import Message Logic (for Persistent Chat)
import messageRoutes from "./modules/messages/message.routes.js";
import * as messageService from "./modules/messages/message.service.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// ✅ 2. Define Allowed Origins (Localhost + Live Vercel)
const allowedOrigins = [
  "http://localhost:5173",           // Local Development
  process.env.CLIENT_URL             // Live Production (Set this in Render Env Vars)
];

// --- SOCKET.IO SETUP ---
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE"],
    credentials: true, // Crucial for Auth
  },
});

app.use(express.json());
app.use(cookieParser());

// --- CORS SETUP ---
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // ✅ Must be true for Cookies/Login to work
}));

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes); // ✅ Register Message Routes

// --- SOCKET LOGIC ---
io.on("connection", (socket) => {
  console.log(`⚡ Client Connected: ${socket.id}`);

  // Join Room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // ✅ Send Message (Save to DB -> Broadcast)
  socket.on("send_message", async (data) => {
    try {
      // 1. Save to MongoDB
      const savedMsg = await messageService.sendMessage({
        appointmentId: data.room,
        senderId: data.senderId,
        text: data.message,
      });

      // 2. Prepare payload with DB ID (needed for delete)
      const broadcastData = {
        _id: savedMsg._id, 
        room: data.room,
        author: savedMsg.senderId.name,
        senderId: data.senderId,
        message: savedMsg.text,
        time: new Date(savedMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // 3. Broadcast to Room
      io.to(data.room).emit("receive_message", broadcastData);

    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // ✅ Delete Message
  socket.on("delete_message", (data) => {
    // Tell everyone in room to remove this ID
    socket.to(data.room).emit("message_deleted", data.messageId);
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