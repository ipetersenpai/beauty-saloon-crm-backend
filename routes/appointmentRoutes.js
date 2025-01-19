// routes/appointmentRoutes.js
const express = require('express');
const Appointment = require('../models/appointment/Appointment');
const Pricing = require('../models/pricing/Pricing');
const Service = require('../models/service/Service');
const router = express.Router();

// Create a new appointment
router.post('/appointments', async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        contactNo,
        selectedService,
        appointmentDate,
        leaveNotes,
    } = req.body;

    try {
        // Create and save the new appointment
        const appointment = new Appointment({
            firstName,
            lastName,
            email,
            contactNo,
            selectedService,
            appointmentDate,
            leaveNotes,
        });

        await appointment.save();
        res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all appointments filter by status
router.get('/appointments', async (req, res) => {
    const { status } = req.query;

    try {
        let appointments;

        if (status) {
            // If a status is provided, filter by status
            appointments = await Appointment.find({ status });
        } else {
            // If no status is provided, get all appointments
            appointments = await Appointment.find();
        }

        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update appointment status
router.put('/appointments', async (req, res) => {
    const { id, status } = req.body;

    // Check if status is valid
    if (!['pending', 'approved', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        if (id) {
            // If ID is provided, update the specific appointment
            const appointment = await Appointment.findById(id);
            if (!appointment) {
                return res.status(404).json({ error: 'Appointment not found' });
            }

            appointment.status = status;
            if (status === 'completed') {
                appointment.dateCompleted = new Date();
            }

            await appointment.save();
            return res.status(200).json({ message: 'Appointment status updated', appointment });
        } else {
            // If no ID is provided, update all appointments
            const appointments = await Appointment.updateMany(
                {},
                { $set: { status } }
            );

            return res.status(200).json({
                message: 'All appointments status updated',
                appointments,
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Delete appointment
router.delete('/appointments', async (req, res) => {
    const { id } = req.body;

    try {
        if (id) {
            // If ID is provided, delete the specific appointment
            const appointment = await Appointment.findByIdAndDelete(id);
            if (!appointment) {
                return res.status(404).json({ error: 'Appointment not found' });
            }

            return res.status(200).json({ message: 'Appointment deleted successfully', appointment });
        } else {
            // If no ID is provided, delete all appointments with status "pending"
            const result = await Appointment.deleteMany({ status: 'pending' });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'No pending appointments found to delete' });
            }

            return res.status(200).json({
                message: `${result.deletedCount} pending appointments deleted successfully`,
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/appointments/sales', async (req, res) => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const services = await Service.find();
        const pricingData = await Pricing.find();

        const serviceLookup = services.reduce((acc, service) => {
            acc[service.serviceName] = service._id.toString();
            return acc;
        }, {});

        const pricingLookup = pricingData.reduce((acc, pricing) => {
            acc[pricing.serviceId.toString()] = pricing.pricing;
            return acc;
        }, {});

        const calculateSales = async (startDate) => {
            const completedAppointments = await Appointment.find({
                status: 'completed',
                appointmentDate: { $gte: startDate },
            });

            console.log('Completed Appointments:', completedAppointments);

            let totalSales = 0;
            for (const appointment of completedAppointments) {
                const serviceId = serviceLookup[appointment.selectedService];
                console.log(`ServiceName: ${appointment.selectedService}, ServiceId: ${serviceId}`);
                if (serviceId && pricingLookup[serviceId]) {
                    console.log(`Pricing Found: ${pricingLookup[serviceId]}`);
                    totalSales += pricingLookup[serviceId];
                } else {
                    console.log(`Pricing Missing for ServiceId: ${serviceId}`);
                }
            }

            return {
                totalSales,
                totalCustomers: completedAppointments.length,
            };
        };

        const [dailyData, weeklyData, monthlyData] = await Promise.all([
            calculateSales(startOfDay),
            calculateSales(startOfWeek),
            calculateSales(startOfMonth),
        ]);

        res.status(200).json({
            daily: dailyData,
            weekly: weeklyData,
            monthly: monthlyData,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





module.exports = router;
