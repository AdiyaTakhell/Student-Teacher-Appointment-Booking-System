import * as authService from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { token, user } = await authService.register(req.body);
    res.status(201).json({ token, user });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { token, user } = await authService.login(req.body);
    res.json({ token, user });
  } catch (err) { next(err); }
};

export const getProfile = async (req, res) => res.json(req.user);

export const getTeachers = async (req, res, next) => {
  try {
    const teachers = await authService.getUsersByRole("teacher");
    res.json(teachers);
  } catch (err) { next(err); }
};

export const updatePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
    res.json({ message: "Password updated successfully" });
  } catch (err) { next(err); }
};