import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  content: string;
  date: Date;
}

const NewsSchema: Schema = new Schema({
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.News || mongoose.model<INews>('News', NewsSchema);