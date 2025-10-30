import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
await connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://travel-experiences-web.onrender.com'
];

app.use(cors({
  origin: 'http://localhost:3000', // your React app
  credentials: true,
}));
app.use(express.json());

// ------------------------------------------------------------------
// 📂 Path setup (for serving uploads folder)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------------------------------------------------------
// 🚪 Routes
app.use('/auth', authRoutes);
app.use('/experiences', experienceRoutes);

// ------------------------------------------------------------------
// 🌱 DEV SEED ROUTE - uses local images in /uploads folder
// ------------------------------------------------------------------
app.post('/seed', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden in production mode' });
  }

  try {
    const Experience = (await import('./models/Experience.js')).default;
    const Booking = (await import('./models/Booking.js')).default;
    const Promo = (await import('./models/Promo.js')).default;

    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // ✅ Helper for available dates
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

    // ✅ Clear existing data
    await Booking.deleteMany({});
    await Experience.deleteMany({});
    await Promo.deleteMany({});

    // ✅ Use local images directly (must already exist in /uploads)
    const experiences = [
      {
        title: 'Kayaking',
        description: 'Curated small-group experience with certified guide and safety gear.',
        price: 999,
        location: 'Udupi, Karnataka',
        image: '/uploads/kayaking.jpg',// local image path
        availableDates: makeAvailableDates(),
      },
      {
        title: 'Nandi Hills Sunrise',
        description: 'Sunrise trek with panoramic views and breakfast included.',
        price: 899,
        location: 'Bangalore',
        image: '/uploads/nandi_hills.jpg', // local image path
        availableDates: makeAvailableDates(5, ['05:30', '06:30', '07:30']),
      },
      {
        title: 'Coffee Trail',
        description: 'Walk through coffee plantations with guided tastings.',
        price: 1299,
        location: 'Coorg',
        image: '/uploads/coffee_trail.jpg', // local image path
        availableDates: makeAvailableDates(5, ['08:00', '10:00', '14:00']),
      },
    ];

    const createdExperiences = await Experience.create(experiences);

    // ✅ Create promo codes
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
// 🚀 Start Server
// ------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
