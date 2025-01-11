// models/cashiering/Cashiering.js
const mongoose = require('mongoose');

const CashieringSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
    },
    services: {
        type: String,
        required: true,
    },
    serviceDate: {
        type: Date,
        required: true,
    },
    modeOfPayment: {
        type: String,
        required: true,
    },
    referenceNo: {
        type: String,
        default: null, // Optional
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Cashiering', CashieringSchema);
