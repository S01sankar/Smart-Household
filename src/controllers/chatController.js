const Chat = require('../models/Chat');

exports.getMessages = async (req, res) => {
  try {
    const messages = await Chat.find({
      householdId: req.user.householdId
    })
      .populate('sender', 'name phone')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { message, type } = req.body;

    if (!message || !message.trim())
      return res.status(400).json({ message: 'Message cannot be empty' });

    const chat = await Chat.create({
      householdId: req.user.householdId,
      sender:      req.user._id,
      message:     message.trim(),
      type:        type || 'text',
      readBy:      [req.user._id]
    });

    const populated = await Chat.findById(chat._id)
      .populate('sender', 'name phone');

    // Emit real time message
    global.io.to(req.user.householdId.toString()).emit('new-message', {
      message:  populated,
      sender:   req.user.name
    });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Chat.findById(req.params.id);

    if (!message)
      return res.status(404).json({ message: 'Message not found' });

    if (message.sender.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to delete this message' });

    await Chat.findByIdAndDelete(req.params.id);

    global.io.to(req.user.householdId.toString()).emit('message-deleted', {
      messageId: req.params.id
    });

    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};