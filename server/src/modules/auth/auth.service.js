import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const register = async (userData) => {
  // Students: Auto-Approve. Teachers: Need Admin Approval.
  const isApproved = userData.role === "student"; 
  const newUser = await User.create({ ...userData, isApproved });
  const token = signToken(newUser._id);
  return { token, user: newUser };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isApproved) {
    const error = new Error("Account pending approval");
    error.statusCode = 403;
    throw error;
  }

  const token = signToken(user._id);
  return { token, user };
};

export const getUsersByRole = async (role) => {
  return User.find({ role, isApproved: true }).select("name email department");
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    const error = new Error("Incorrect current password");
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword; // Pre-save hook will hash this
  await user.save();
  return true;
};