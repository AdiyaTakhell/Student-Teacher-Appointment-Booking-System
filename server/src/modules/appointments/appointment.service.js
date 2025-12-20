import Appointment from "../../models/Appointment.js";

export const createAppointment = async (data) => {
  // Check for time conflicts
  const conflict = await Appointment.findOne({
    teacherId: data.teacherId,
    startTime: data.startTime,
    status: { $in: ["pending", "approved"] }
  });

  if (conflict) {
    const error = new Error("This time slot is already booked.");
    error.statusCode = 409; 
    throw error;
  }

  return await Appointment.create({
    studentId: data.studentId,
    teacherId: data.teacherId,
    startTime: data.startTime,
    endTime: data.endTime,
    purpose: data.purpose,
    status: "pending"
  });
};

export const getAppointments = async (user, query) => {
  let filter = {};
  if (user.role === "student") filter.studentId = user._id;
  else if (user.role === "teacher") filter.teacherId = user._id;

  const limit = query.limit ? parseInt(query.limit) : 0;

  return await Appointment.find(filter)
    .populate("teacherId", "name email department")
    .populate("studentId", "name email")
    .sort({ startTime: 1 })
    .limit(limit);
};

export const updateStatus = async (appointmentId, status, teacherId) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  if (appointment.teacherId.toString() !== teacherId) {
    const error = new Error("Unauthorized");
    error.statusCode = 403;
    throw error;
  }

  appointment.status = status;
  await appointment.save();
  return appointment;
};