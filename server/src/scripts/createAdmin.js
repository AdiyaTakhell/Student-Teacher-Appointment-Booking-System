import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔌 Connected to DB...");
    const adminExists = await User.findOne({ email: "admin@classconnect.com" });
    if (adminExists) {
      console.log("⚠️ Admin already exists!");
      process.exit();
    }
    await User.create({
      name: "System Admin",
      email: "admin@classconnect.com",
      password: "adminpassword123",
      role: "admin",
      isApproved: true
    });
    console.log("✅ Admin created!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit();
  }
};
createAdmin();