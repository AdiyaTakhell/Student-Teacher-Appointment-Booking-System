import * as adminService from "./admin.service.js";

// Get Dashboard Stats
export const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getSystemStats();
    res.json(stats);
  } catch (err) { next(err); }
};

// Get List of All Teachers
export const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await adminService.getAllTeachers();
    res.json(teachers);
  } catch (err) { next(err); }
};

// Approve a Teacher
export const approveTeacher = async (req, res, next) => {
  try {
    const teacher = await adminService.verifyTeacher(req.params.id);
    res.json({ message: "Teacher approved successfully", teacher });
  } catch (err) { next(err); }
};

// Delete a Teacher
export const deleteTeacher = async (req, res, next) => {
  try {
    await adminService.removeTeacher(req.params.id);
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) { next(err); }
};