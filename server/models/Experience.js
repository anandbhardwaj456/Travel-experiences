import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    minimumAge: { type: Number, default: 10 },
    includedItems: [{ type: String }],
    availableDates: [{
      date: { type: Date, required: true },
      timeSlots: [{
        time: { type: String, required: true },
        available: { type: Boolean, default: true },
        maxCapacity: { type: Number, required: true, default: 10 },
        currentBookings: { type: Number, default: 0 }
      }]
    }],
    requirements: [{ type: String }],
    active: { type: Boolean, default: true }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for calculating available slots
ExperienceSchema.virtual('availableSlots').get(function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.availableDates
    .filter(date => date.date >= today)
    .reduce((slots, date) => {
      const availableTimeSlots = date.timeSlots
        .filter(slot => slot.available && slot.currentBookings < slot.maxCapacity)
        .map(slot => ({
          date: date.date,
          time: slot.time,
          remaining: slot.maxCapacity - slot.currentBookings
        }));
      return [...slots, ...availableTimeSlots];
    }, []);
});

export default mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);