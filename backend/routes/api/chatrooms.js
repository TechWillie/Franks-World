const express = require('express');
const router = express.Router();
const { ChatRoom, Message, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { format } = require('sequelize/lib/utils');

// ! Get all chatrooms
router.get('/', async (req, res) => {
  try {
    const chatrooms = await ChatRoom.findAll();
    return res.json(chatrooms);
  } catch (error) {
    console.log('Error fetching chatrooms:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const chatroom = await ChatRoom.findByPk(req.params.id, {
      include: [
        {
          model: Message,
          include: [User],
        },
      ],
    });

    if (!chatroom) {
      return res.status(404).json({ error: 'Chatroom not found' });
    }

    return res.json(chatroom);

  } catch (error) {
    console.log('Error fetching chatroom:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, isPrivate } = req.body;
    const chatroom = await ChatRoom.create(
      { 
        name, 
        isPrivat,
        updatedAt,
        createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
       });
       return res.json(chatroom);
      }
       catch (error) {
        console.error('Error creating chatroom:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  );
  

   module.exports = router;
    // ! Get one chatroom by id