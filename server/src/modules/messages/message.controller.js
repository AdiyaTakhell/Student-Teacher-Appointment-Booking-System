import * as messageService from "./message.service.js";

export const getMessages = async (req, res, next) => {
  try {
    const messages = await messageService.getMessages(req.params.appointmentId);
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    await messageService.deleteMessage(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (err) {
    next(err);
  }
};