import mongoose, { Schema, Document } from 'mongoose';

// LockedAccount interface for TypeScript
export interface ILockedAccount extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  email: string;
  phone: string;
  city: string;
  referralCount: number;
  requiredReferrals: number; // Usually 11
  totalNetworkSize: number;
  referredBy?: string;
  reasonLocked: string; // "Failed to reach 11 referrals within 2 hours"
  timerEndTime?: Date;
  lockedAt: Date;
  secondChanceGiven?: boolean;
  secondChanceDate?: Date;
  notes?: string;
  unlocked?: boolean;
  unlockedAt?: Date;
}

const LockedAccountSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  referralCount: { type: Number, required: true },
  requiredReferrals: { type: Number, default: 11 },
  totalNetworkSize: { type: Number, required: true },
  referredBy: { type: String },
  reasonLocked: { type: String, default: 'Failed to reach 11 referrals within 2 hours' },
  timerEndTime: { type: Date },
  lockedAt: { type: Date, default: Date.now },
  secondChanceGiven: { type: Boolean, default: false },
  secondChanceDate: { type: Date },
  notes: { type: String },
  unlocked: { type: Boolean, default: false },
  unlockedAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.LockedAccount || mongoose.model<ILockedAccount>('LockedAccount', LockedAccountSchema);
