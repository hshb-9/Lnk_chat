import Message from "../models/message.model.js";

// Get all messages between current user and selected user
export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const selectedUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, image } = req.body;
    const senderId = req.user._id;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete single message by ID
export const deleteMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Bulk delete messages by IDs
export const deleteMessagesBulk = async (req, res) => {
  try {
    const { messageIds } = req.body;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ message: "No message IDs provided" });
    }

    const result = await Message.deleteMany({
      _id: { $in: messageIds }
    });

    res.status(200).json({
      message: "Messages deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error in deleteMessagesBulk:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
