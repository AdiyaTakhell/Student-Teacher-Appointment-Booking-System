import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  purpose: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "approved", "cancelled", "completed"], 
    default: "pending" 
  }
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);