require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package

// Import Routes
const authRoutes = require('../routes/authRoutes');
const appointmentRoutes = require('../routes/appointmentRoutes');
const serviceRoutes = require('../routes/serviceRoutes');
const pricingRoutes = require('../routes/pricingRoutes');
const feedbackRoutes = require('../routes/feedbackRoutes');
const cashieringRoutes = require('../routes/cashieringRoutes');
const inventoryRoutes = require('../routes/inventoryRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Database connection error:', err));

// Routes
app.get('/auth', (req, res) => res.send('Welcome to the Express-MongoDB backend!'));

// Use the auth routes
app.use('/api', authRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', serviceRoutes);
app.use('/api', pricingRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', cashieringRoutes);
app.use('/api', inventoryRoutes);

// Start the server
// const PORT = process.env.PORT || 3100;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
