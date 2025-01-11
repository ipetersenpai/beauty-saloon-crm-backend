// models/feedback/Feedback.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    dateUpdated: {
        type: Date,
    },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
