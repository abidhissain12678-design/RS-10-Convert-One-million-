import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  content: string;
  date: Date;
}

const NotificationSchema: Schema = new Schema({
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);