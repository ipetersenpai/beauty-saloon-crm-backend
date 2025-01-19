// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/authentication/User');
require('dotenv').config();

const router = express.Router();

// User Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create FULL NAME
    const fullName = `${user.firstname} ${user.middlename || ''} ${user.lastname}`.trim();

    // Generate a JWT token
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        fullName: fullName,
        role: user.role
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7776000s' } // Token expiration
    );

    // Send the token as a response
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// User Registration Route
router.post('/register', async (req, res) => {
  const { firstname, middlename, lastname, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({
      firstname,
      middlename,
      lastname,
      email,
      password,
      role,
    });

    // Save the new user
    await newUser.save();

    // Return success response
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Generate a password reset token (valid for a short time)
        const resetToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' } // Token valid for 1 hour
        );

        // Create a reset link with the token
        const resetLink = `http://localhost:3100/api/reset-password/${resetToken}`;

        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER, // Your email address
                pass: process.env.SMTP_PASSWORD, // Your email password
            },
        });

        // Email content with a button
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Beauty Saloon - Password Reset Request',
            html: `
                <p>To reset your password, click the button below:</p>
                <a href="${resetLink}" style="
                    display: inline-block;
                    background-color: #007BFF;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    font-size: 16px;
                ">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: 'Error sending email' });
            } else {
                return res.status(200).json({ message: 'Password reset email sent successfully' });
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
