const express = require('express');
const Service = require('../models/service/Service');
const router = express.Router();

// Create a new service
router.post('/services', async (req, res) => {
    const { serviceName, description } = req.body;

    try {
        const service = new Service({
            serviceName,
            description,
        });

        await service.save();
        res.status(201).json({ message: 'Service created successfully', service });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all services
router.get('/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a service
router.put('/services/:id', async (req, res) => {
    const { id } = req.params;
    const { serviceName, description } = req.body;

    try {
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        service.serviceName = serviceName || service.serviceName;
        service.description = description || service.description;

        await service.save();
        res.status(200).json({ message: 'Service updated successfully', service });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a service
router.delete('/services/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const service = await Service.findByIdAndDelete(id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
