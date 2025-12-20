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
const httpServer = createServer(app); //  Create HTTP Server

//  Configure Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", //  Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

//  Socket.io Logic
io.on("connection", (socket) => {
  console.log(`⚡ Client Connected: ${socket.id}`);

  // Join a specific chat room (Unique per Appointment ID)
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Handle sending messages
  socket.on("send_message", (data) => {
    // data = { room, author, message, time }
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;

//  Change app.listen to httpServer.listen
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});