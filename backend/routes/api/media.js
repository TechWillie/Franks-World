const express = require('express');
const router = express.Router();
const { Event, Media, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// ! Get all media
router.get('/', async (req, res) => {
    try {
        const media = await Media.findAll();
        return res.json(media);
    } catch (error) {
        console.error('Error fetching media:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ! Get media by id
router.get('/:id', async (req, res) => {
    try {
        const media = await Media.findByPk(req.params.id);
        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }
        return res.json(media);
    } catch (error) {
        console.error('Error fetching media:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ! Create a new media
router.post('/', requireAuth, async (req, res) => {
    try {
        const { eventId, userId, url } = req.body;
        const media = await Media.create({
            eventId, userId, url
        })
        return res.status(201).json(media);
    } catch (error) {
        console.error('Error creating media:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ! Update a media
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { eventId, userId, url } = req.body;
        const media = await Media.findByPk(req.params.id);
        if (!media) {
            return res.status(404).json({ error: 'Media not found' }
                );
        }
            media.eventId = eventId;
            media.userId = userId;
            media.url = url;
            await media.save();
        } catch (error) {
            console.error('Error updating media:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json(media);
    });

// ! Delete a media
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const media = await Media.findByPk(req.params.id);
        if (!media) {
            return res.status(404).json({ error: 'Error deleting media' });
        } 
        await media.destroy();
        return res.json({ message: 'Media deleted successfully' });
    } catch (error) {
            console.error('Error deleting media:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    module.exports = router;
