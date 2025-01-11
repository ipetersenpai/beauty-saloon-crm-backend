const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    inclusions: {
        type: [String],
        required: true,
    },
    pricing: {
        type: Number,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Pricing', pricingSchema);
