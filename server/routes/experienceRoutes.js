import express from 'express';
import mongoose from 'mongoose';
import Experience from '../models/Experience.js';
import Booking from '../models/Booking.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * ✅ GET /experiences
 * Fetch all available experiences
 */
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const experiences = await Experience.find().lean();
    res.status(200).json(experiences);
  } catch (err) {
    console.error('Error fetching experiences:', err);
    res.status(500).json({ error: 'Failed to load experiences', details: err.message });
  }
});

/**
 * ✅ GET /experiences/:id
 * Fetch single experience details + available dates & times
 */
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid experience ID' });
    }

    const experience = await Experience.findById(id).lean();
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Fetch all non-cancelled bookings for this experience
    const bookings = await Booking.find({
      experience: id,
      status: { $ne: 'cancelled' }
    }).lean();

    // Generate next 7 days as available booking dates
    const availableDates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);
      availableDates.push(date.toISOString().split('T')[0]);
    }

    const availableTimes = ['07:00', '09:00', '11:00', '13:00', '15:00'];
    const bookedSlots = new Map();

    // Track booked time slots per date
    bookings.forEach(booking => {
      if (!booking.date) return;
      const parsedDate = new Date(booking.date);
      if (isNaN(parsedDate)) return;

      const dateKey = parsedDate.toISOString().split('T')[0];
      if (!bookedSlots.has(dateKey)) bookedSlots.set(dateKey, new Set());
      bookedSlots.get(dateKey).add(booking.time);
    });

    // Filter only those dates which have at least one available time
    const finalAvailableDates = availableDates.filter(date => {
      const bookedTimes = bookedSlots.get(date) || new Set();
      return availableTimes.some(time => !bookedTimes.has(time));
    });

    res.json({
      ...experience,
      availableDates: finalAvailableDates,
      availableTimes,
      price: experience.price || 999
    });
  } catch (err) {
    console.error('Error fetching experience details:', err);
    res.status(500).json({ error: 'Failed to load experience', details: err.message });
  }
});

/**
 * ✅ POST /experiences/bookings
 * Create a new booking for an experience
 */
router.post('/bookings', async (req, res) => {
  try {
    const { experienceId, date, time, quantity, fullName, email, promoCode } = req.body;

    // 🔍 Validate required fields
    if (!experienceId || !date || !time || !quantity || !fullName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 🔍 Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(experienceId)) {
      return res.status(400).json({ error: 'Invalid experience ID format' });
    }

    // Fetch experience
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // ✅ Validate selected date (must be within next 7 days)
    const today = new Date();
    const selectedDate = new Date(date);
    const daysDiff = (selectedDate - today) / (1000 * 60 * 60 * 24);

    if (isNaN(selectedDate.getTime()) || daysDiff < 0 || daysDiff > 6) {
      return res.status(400).json({ error: 'Selected date not available' });
    }

    // ✅ Validate selected time slot
    const availableTimes = ['07:00', '09:00', '11:00', '13:00', '15:00'];
    if (!availableTimes.includes(time)) {
      return res.status(400).json({ error: 'Selected time not available' });
    }

    // ✅ Prevent duplicate booking for same slot
    const existingBooking = await Booking.findOne({
      experience: experienceId,
      date: selectedDate,
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    // ✅ Pricing calculation
    const pricePerPerson = experience.price || 999;
    const subtotal = pricePerPerson * quantity;
    const taxes = Math.round(subtotal * 0.05);
    const total = subtotal + taxes;

    // ✅ Create booking record
    const booking = new Booking({
      experience: experienceId,
      fullName,
      email,
      date: selectedDate,
      time,
      quantity,
      subtotal,
      taxes,
      total,
      promoCode,
      status: 'confirmed'
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking successful!',
      bookingReference: booking._id,
      total
    });
  } catch (error) {
    console.error('Booking creation error:', error);

    if (error.code === 11000) {
      return res.status(409).json({ error: 'Duplicate booking detected for this slot' });
    }

    res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
});

export default router;
