import User from "../../models/User.js";
import Appointment from "../../models/Appointment.js";

export const getSystemStats = async () => {
  const students = await User.countDocuments({ role: "student" });
  const teachers = await User.countDocuments({ role: "teacher" });
  // specific stat for pending teachers
  const pendingTeachers = await User.countDocuments({ role: "teacher", isApproved: false });
  const totalAppointments = await Appointment.countDocuments();

  const topTeachers = await Appointment.aggregate([
    { $match: { status: "approved" } },
    { $group: { _id: "$teacherId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "teacherInfo" } },
    { $unwind: "$teacherInfo" },
    { $project: { name: "$teacherInfo.name", count: 1 } }
  ]);

  return { 
    users: { students, teachers, pendingTeachers }, 
    appointments: totalAppointments, 
    topTeachers 
  };
};

//  Fetch all teachers, sorting by "Pending" first
export const getAllTeachers = async () => {
  return await User.find({ role: "teacher" })
    .select("-password") // Exclude passwords for security
    .sort({ isApproved: 1, createdAt: -1 }); // false (Pending) comes before true
};

//  Approve Logic
export const verifyTeacher = async (teacherId) => {
  const teacher = await User.findById(teacherId);
  if (!teacher) throw new Error("Teacher not found");
  
  teacher.isApproved = true;
  await teacher.save();
  return teacher;
};

//  Delete Logic (Cascading Delete)
export const removeTeacher = async (teacherId) => {
  const teacher = await User.findById(teacherId);
  if (!teacher) throw new Error("Teacher not found");

  // 1. Delete all appointments associated with this teacher first
  await Appointment.deleteMany({ teacherId: teacher._id });

  // 2. Delete the user
  await User.findByIdAndDelete(teacherId);
  
  return true;
};