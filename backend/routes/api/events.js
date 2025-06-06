const express = require('express');
const router = express.Router();
const { Event, ChatRoom, Message, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');


// ! Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    return res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error); // 👈 Check your terminal logs
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//! Get one event by id
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        return res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error); // 👈 Check your terminal logs
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

//! Create a new event
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name, description, chatRoomId, placeId, hostId, eventDate } = req.body;
        const event = await Event.create({
            name,
            description,
            hostId,
            eventDate,
            chatRoomId,
            placeId
        });
        return res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error); 
        return res.status(500).json({ error: 'Internal Server Error' }
        );
    }
});

//! Update an event
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (event.hostId !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to update this event' });
        }
        const { name, description, chatroomId, placeId } = req.body;
        await event.update({
            name,
            description,
            chatroomId,
            placeId
        });
        return res.json(event);
    } catch (error) {
        console.error('Error updating event:', error); // 👈 Check your terminal logs
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

//! Delete an event
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (event.hostId !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this event' });
        }
        await event.destroy();
        return res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error); // 👈 Check your terminal logs
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;