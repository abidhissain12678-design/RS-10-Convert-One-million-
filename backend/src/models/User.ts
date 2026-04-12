import mongoose, { Schema, Document } from 'mongoose';

// User interface for TypeScript
export interface IUser extends Document {
  name: string;
  username: string;
  phone: string;
  email: string;
  city: string;
  password: string;
  referredBy?: string;
  isAdmin: boolean;
  activationStatus: 'not_requested' | 'pending' | 'approved' | 'expired' | 'pending_chance' | 'locked' | 'completed';
  banned: boolean;
  myReferralCode?: string;
  referralCount: number;
  totalNetworkSize: number;
  timerEndTime?: Date;
  networkReferrals: { position: number; referralCode: string; status: 'locked' | 'unlocked'; paymentApproved: boolean }[];
  referredUsers: string[]; // Array of usernames referred
  otp?: string;
  otpExpiry?: Date;
  activationRequest: boolean;
  chanceLevel: number;
  taskEarnings: number;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  password: { type: String, required: true },
  referredBy: { type: String },
  isAdmin: { type: Boolean, default: false },
  activationStatus: { type: String, default: 'not_requested', enum: ['not_requested', 'pending', 'approved', 'expired', 'pending_chance', 'locked', 'completed'] },
  banned: { type: Boolean, default: false },
  myReferralCode: { type: String },
  referralCount: { type: Number, default: 0 },
  totalNetworkSize: { type: Number, default: 0 },
  timerEndTime: { type: Date },
  networkReferrals: [{ position: Number, referralCode: String, status: { type: String, enum: ['locked', 'unlocked'], default: 'locked' }, paymentApproved: { type: Boolean, default: false } }],
  referredUsers: [{ type: String }], // Array of usernames
  otp: { type: String },
  otpExpiry: { type: Date },
  activationRequest: { type: Boolean, default: false },
  chanceLevel: { type: Number, default: 0 },
  taskEarnings: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);