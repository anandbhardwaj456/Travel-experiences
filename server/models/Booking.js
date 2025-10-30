import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    experience: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Experience', 
      required: true 
    },

    bookingReference: {
      type: String,
      unique: true,
      default: () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let reference = 'HUF';
        for (let i = 0; i < 5; i++) {
          reference += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return reference;
      }
    },

    fullName: { type: String, required: true },
    email: { type: String, required: true },
    
    // Ensure both date and time are always present
    date: { type: Date, required: true },
    time: { type: String, required: true },

    quantity: { type: Number, required: true, default: 1 },
    subtotal: { type: Number, required: true },
    taxes: { type: Number, required: true },
    total: { type: Number, required: true },
    promoCode: { type: String },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// ✅ Ensure unique booking per (experience + date + time)
BookingSchema.index({ experience: 1, date: 1, time: 1 }, { unique: true });

// ✅ Drop any outdated indexes automatically (like experience_1_slot_1)
BookingSchema.pre('save', async function(next) {
  try {
    const indexes = await mongoose.models.Booking.listIndexes();
    const hasOldIndex = indexes.some(i => i.name === 'experience_1_slot_1');
    if (hasOldIndex) {
      await mongoose.models.Booking.collection.dropIndex('experience_1_slot_1');
      console.log('🧹 Old index (experience_1_slot_1) dropped successfully');
    }
    next();
  } catch (err) {
    console.warn('Index cleanup skipped:', err.message);
    next();
  }
});

// ✅ Validation safeguard
BookingSchema.pre('validate', function(next) {
  if (!this.date || !this.time) {
    return next(new Error('Both date and time are required for a booking.'));
  }
  next();
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
