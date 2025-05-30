const express = require('express')
const bcrypt = require('bcryptjs');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Message } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.get('/', async (req, res) => {
  try {
    const messages = await Message.findAll();
    const plainMessagesArr = messages.map(message => message.toJSON());
    console.log(plainMessagesArr); // Log the plain messages array
    return res.json(plainMessagesArr);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});


module.exports = router;