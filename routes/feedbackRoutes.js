// routes/feedbackRoutes.js
const express = require('express');
const Feedback = require('../models/feedback/Feedback');
const router = express.Router();

// Create feedback
router.post('/feedback', async (req, res) => {
    const { clientName, review, rating } = req.body;

    try {
        const feedback = new Feedback({
            clientName,
            review,
            rating,
        });

        await feedback.save();
        res.status(201).json({ message: 'Feedback created successfully', feedback });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all feedback
router.get('/feedback', async (req, res) => {
    try {
        const feedbackList = await Feedback.find();
        res.status(200).json(feedbackList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update feedback
router.put('/feedback/:id', async (req, res) => {
    const { id } = req.params;
    const { clientName, review, rating } = req.body;

    try {
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        if (clientName) feedback.clientName = clientName;
        if (review) feedback.review = review;
        if (rating) feedback.rating = rating;
        feedback.dateUpdated = new Date();

        await feedback.save();
        res.status(200).json({ message: 'Feedback updated successfully', feedback });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete feedback
router.delete('/feedback/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        await Feedback.findByIdAndDelete(id);
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
