import Message from "../../models/Message.js";

// Save a new message
export const sendMessage = async ({ appointmentId, senderId, text }) => {
  const newMessage = await Message.create({ appointmentId, senderId, text });
  return await newMessage.populate("senderId", "name");
};

// Get chat history
export const getMessages = async (appointmentId) => {
  return await Message.find({ appointmentId })
    .populate("senderId", "name")
    .sort({ createdAt: 1 });
};

// Delete a message
export const deleteMessage = async (messageId, userId) => {
  const message = await Message.findById(messageId);
  if (!message) throw new Error("Message not found");

  // Security Check: Only the sender can delete
  if (message.senderId.toString() !== userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 403;
    throw error;
  }

  await message.deleteOne();
  return message;
};