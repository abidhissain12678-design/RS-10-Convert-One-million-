import mongoose, { Schema, Document } from 'mongoose';

// Payment interface for TypeScript
export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  email: string;
  transactionId: string;
  screenshotUrl?: string;
  amountType: number; // 10, 50, or 100
  status: 'Pending' | 'Approved' | 'Rejected';
  type: 'Activation' | '1st Chance' | '2nd Chance';
  createdAt: Date;
  approvedAt?: Date;
}

const PaymentSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  transactionId: { type: String, required: true },
  screenshotUrl: { type: String },
  amountType: { type: Number, required: true },
  withdrawMethod: { type: String },
  withdrawAccount: { type: String },
  status: { type: String, required: true, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  type: { type: String, required: true, enum: ['Activation', '1st Chance', '2nd Chance', 'Withdraw'] },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);