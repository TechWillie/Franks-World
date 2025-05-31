const express = require('express');
const router = express.Router();
const { ChatRoom, Message, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// ! Get all chatrooms
router.get('/', async (req, res) => {
  try {
    const chatrooms = await ChatRoom.findAll();
    return res.json(chatrooms);
  } catch (error) {
    console.error('Error fetching chatrooms:', error); // 👈 Check your terminal logs
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


   module.exports = router;
    // ! Get one chatroom by id