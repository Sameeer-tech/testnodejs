const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Get all messages for a room
router.get('/:room', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room })
      .sort({ createdAt: 1 })
      .limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save message
router.post('/save', async (req, res) => {
  try {
    const { sender, username, message, room } = req.body;
    
    const newMessage = new Message({
      sender,
      username,
      message,
      room
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
