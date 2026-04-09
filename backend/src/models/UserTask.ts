import mongoose, { Document, Schema } from 'mongoose';

export interface UserTaskDocument extends Document {
  userId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
  proofSubmitted: boolean;
  proofUrls: string[];
  completed: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy: string;
  reviewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserTaskSchema = new Schema<UserTaskDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  proofSubmitted: { type: Boolean, default: false },
  proofUrls: [{ type: String }],
  completed: { type: Boolean, default: false },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  reviewedBy: { type: String, default: '' },
  reviewedAt: { type: Date }
}, {
  timestamps: true
});

export default mongoose.models.UserTask || mongoose.model<UserTaskDocument>('UserTask', UserTaskSchema);