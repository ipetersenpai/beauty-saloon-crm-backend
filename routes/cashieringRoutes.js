// routes/cashieringRoutes.js
const express = require('express');
const Cashiering = require('../models/cashiering/Cashiering');
const router = express.Router();

// Add a payment
router.post('/cashiering', async (req, res) => {
    const { clientName, services, serviceDate, modeOfPayment, referenceNo, totalAmount } = req.body;

    try {
        const cashiering = new Cashiering({
            clientName,
            services,
            serviceDate,
            modeOfPayment,
            referenceNo,
            totalAmount,
        });

        await cashiering.save();
        res.status(201).json({ message: 'Payment added successfully', cashiering });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all payments or filter by mode of payment
router.get('/cashiering', async (req, res) => {
    const { modeOfPayment } = req.query;

    try {
        let query = {};
        if (modeOfPayment) {
            query.modeOfPayment = modeOfPayment;
        }

        const payments = await Cashiering.find(query);
        res.status(200).json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
