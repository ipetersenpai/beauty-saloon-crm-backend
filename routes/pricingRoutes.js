const express = require('express');
const Pricing = require('../models/pricing/Pricing');
const Service = require('../models/service/Service');
const router = express.Router();

// Create a new pricing entry
router.post('/pricings', async (req, res) => {
    const { serviceId, inclusions, pricing } = req.body;

    try {
        // Validate service existence
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const pricingEntry = new Pricing({
            serviceId,
            inclusions,
            pricing,
        });

        await pricingEntry.save();
        res.status(201).json({ message: 'Pricing created successfully', pricingEntry });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all pricing entries
router.get('/pricings', async (req, res) => {
    try {
        const pricings = await Pricing.find().populate('serviceId', 'serviceName description');
        res.status(200).json(pricings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a pricing entry by ID
router.get('/pricings/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pricing = await Pricing.findById(id)
            .populate('serviceId', 'serviceName')
            .select('inclusions pricing');

        if (!pricing) {
            return res.status(404).json({ error: 'Pricing not found' });
        }

        res.status(200).json({
            id: pricing._id,
            serviceName: pricing.serviceId.serviceName,
            inclusions: pricing.inclusions,
            pricing: pricing.pricing,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update a pricing entry
router.put('/pricings/:id', async (req, res) => {
    const { id } = req.params;
    const { serviceId, inclusions, pricing } = req.body;

    try {
        const pricingEntry = await Pricing.findById(id);
        if (!pricingEntry) {
            return res.status(404).json({ error: 'Pricing not found' });
        }

        if (serviceId) {
            const service = await Service.findById(serviceId);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            pricingEntry.serviceId = serviceId;
        }

        if (inclusions) {
            pricingEntry.inclusions = inclusions;
        }

        if (pricing !== undefined) {
            pricingEntry.pricing = pricing;
        }

        await pricingEntry.save();
        res.status(200).json({ message: 'Pricing updated successfully', pricingEntry });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a pricing entry
router.delete('/pricings/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pricingEntry = await Pricing.findByIdAndDelete(id);
        if (!pricingEntry) {
            return res.status(404).json({ error: 'Pricing not found' });
        }

        res.status(200).json({ message: 'Pricing deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
