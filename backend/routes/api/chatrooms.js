const express = require('express');
const router = express.Router();
const { Chatroom, Message, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// ! Get all chatrooms
router.get('/', async (req, res) => {
    const chatrooms = await Chatroom.findAll({
        // include: [
        //     {
        //         model: Message,
        //         include: {
        //             model: User,
        //             attributes: ['username']
        //         }
        //     },
        //     {
        //         model: User,
        //         attributes: ['username']
        //     }
        // ]
    });
    return res.json(chatrooms);
    });

   module.exports = router;
    // ! Get one chatroom by id