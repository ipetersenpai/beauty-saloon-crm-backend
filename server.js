// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const app = express();

// Middleware
app.use(express.json());

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

// Start the server
const PORT = process.env.PORT || 3100;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
