import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';

dotenv.config();
await connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve local images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/experiences', experienceRoutes);

// ------------------------------------------------------------------
// 🌱 DEV SEED ROUTE - download & store local images
// ------------------------------------------------------------------
app.post('/seed', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden in production mode' });
  }

  try {
    const Experience = (await import('./models/Experience.js')).default;
    const Booking = (await import('./models/Booking.js')).default;
    const Promo = (await import('./models/Promo.js')).default;

    // Ensure uploads folder exists
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    // Helper: download image and save locally
    const downloadImage = async (url, filename) => {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, Buffer.from(buffer));
      return `/uploads/${filename}`;
    };

    // Clear collections
    await Booking.deleteMany({});
    await Experience.deleteMany({});
    await Promo.deleteMany({});

    // Download images and save locally
    const kayakingImage = await downloadImage(
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80',
      'kayaking.jpg'
    );
    const nandiHillsImage = await downloadImage(
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80',
      'nandi_hills.jpg'
    );
    const coffeeTrailImage = await downloadImage(
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
      'coffee_trail.jpg'
    );

    // Helper for available dates
    const makeAvailableDates = (days = 5, times = ['07:00', '09:00', '11:00', '13:00']) => {
      const today = new Date();
      const availableDates = [];
      for (let d = 0; d < days; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() + d);
        date.setHours(0, 0, 0, 0);
        const timeSlots = times.map((t) => ({
          time: t,
          available: true,
          maxCapacity: 10,
          currentBookings: 0,
        }));
        availableDates.push({ date, timeSlots });
      }
      return availableDates;
    };

    // Create experiences using local images
    const experiences = [
      {
        title: 'Kayaking',
        description: 'Curated small-group experience with certified guide and safety gear.',
        price: 999,
        location: 'Udupi, Karnataka',
        image: "/uploads/kayaking.jpg",
        availableDates: makeAvailableDates(),
      },
      {
        title: 'Nandi Hills Sunrise',
        description: 'Sunrise trek with panoramic views and breakfast included.',
        price: 899,
        location: 'Bangalore',
        image: "/uploads/nandi_hills.jpg",
        availableDates: makeAvailableDates(5, ['05:30', '06:30', '07:30']),
      },
      {
        title: 'Coffee Trail',
        description: 'Walk through coffee plantations with guided tastings.',
        price: 1299,
        location: 'Coorg',
        image:"/uploads/coffee_trail.jpg",
        availableDates: makeAvailableDates(5, ['08:00', '10:00', '14:00']),
      },
    ];

    const createdExperiences = await Experience.create(experiences);

    // Create promo codes
    await Promo.create([
      { code: 'SAVE10', type: 'percent', amount: 10, expiresAt: new Date('2026-01-01'), active: true },
      { code: 'FLAT100', type: 'flat', amount: 100, expiresAt: new Date('2026-01-01'), active: true },
    ]);

    console.log('✅ Database seeded successfully.');
    res.json({
      ok: true,
      created: createdExperiences.length,
      examples: createdExperiences.map((e) => ({
        id: e._id,
        title: e.title,
        image: e.image,
      })),
    });
  } catch (err) {
    console.error('❌ Seed error:', err);
    res.status(500).json({
      error: 'Seeding failed',
      details: err.message,
    });
  }
});

// ------------------------------------------------------------------
// Start Server
// ------------------------------------------------------------------
app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
