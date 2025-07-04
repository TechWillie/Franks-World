const express = require('express')
const bcrypt = require('bcryptjs');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Message, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.get('/', async (req, res) => {
  try {
    const messages = await Message.findAll(
      {
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email'],
          },
        ],
      }
    );
    const plainMessagesArr = messages.map(message => message.toJSON());
    console.log(plainMessagesArr);
    return res.json(plainMessagesArr);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'theHype Message not found' });
    }
    return res.json(message);
  } catch (error) {
    console.error('Error fetching theHype message:', error);
    return res.status(500).json({ error: 'Some Hype went wrong' });
  }   
  const message = await Message.findByPk(req.params.id);
  return res.json(message);
});
router.post('/', async (req, res) => {
  try {
    const { content, userId, chatRoomId } = req.body;
    const newMessage = await Message.create({ content, userId, chatRoomId });
    return res.json(newMessage);
  } catch (error) {
    console.error('Error creating theHype message:', error);
    return res.status(500).json({ error: 'Some Hype went wrong' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { content, userId, chatRoomId } = req.body;
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'theHype Message not found' });
    }
    message.content = content;
    message.userId = userId;
    message.chatRoomId = chatRoomId;
    await message.save();
    return res.json(message);
  } catch (error) {
    console.error('Error updating theHype message:', error);
    return res.status(500).json({ error: 'Some Hype went wrong' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'theHype Message not found' });
    }
    await message.destroy();
    return res.json({ message: 'theHype Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting theHype message:', error);
    return res.status(500).json({ error: 'Some Hype went wrong' });
  }
});


module.exports = router;