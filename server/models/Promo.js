import mongoose from 'mongoose';

const PromoSchema = new mongoose.Schema({
  code: { type: String, required: true, uppercase: true, unique: true },
  type: { type: String, enum: ['percent', 'flat'], required: true },
  amount: { type: Number, required: true },
  expiresAt: Date,
  active: { type: Boolean, default: true },
});

export default mongoose.models.Promo || mongoose.model('Promo', PromoSchema);