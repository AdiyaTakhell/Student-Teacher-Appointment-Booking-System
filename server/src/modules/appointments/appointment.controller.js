import * as appointmentService from "./appointment.service.js";

export const createAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.createAppointment({
      ...req.body,
      studentId: req.user.id // Attach Student ID from Token
    });
    res.status(201).json({ status: "success", data: appointment });
  } catch (err) { next(err); }
};

export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getAppointments(req.user, req.query);
    res.json({ status: "success", results: appointments.length, data: appointments });
  } catch (err) { next(err); }
};

export const updateStatus = async (req, res, next) => {
  try {
    const appointment = await appointmentService.updateStatus(req.params.id, req.body.status, req.user.id);
    res.json({ status: "success", data: appointment });
  } catch (err) { next(err); }
};