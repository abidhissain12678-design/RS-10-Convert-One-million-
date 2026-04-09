import mongoose, { Document, Schema } from 'mongoose';

export interface TaskDocument extends Document {
  taskType: string;
  title: string;
  description: string;
  link: string;
  reward: string;
  totalQuantity: number;
  completedQuantity: number;
  completedBy: string[];
  active: boolean;
  imageUrl: string;
  requiresProof: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<TaskDocument>({
  taskType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  reward: { type: String, required: true },
  totalQuantity: { type: Number, required: true },
  completedQuantity: { type: Number, default: 0 },
  completedBy: { type: [String], default: [] },
  active: { type: Boolean, default: true },
  imageUrl: { type: String, default: '' },
  requiresProof: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.models.Task || mongoose.model<TaskDocument>('Task', TaskSchema);
