import mongoose, { Document, Schema } from 'mongoose';

export interface BlogDocument extends Document {
  title: string;
  slug: string; // Unique page-friendly URL
  content: string; // Supports HTML/rich text
  thumbnail: string; // Cloudinary URL
  author: string; // Admin name
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<BlogDocument>({
  title: { 
    type: String, 
    required: [true, 'Blog title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title must not exceed 200 characters']
  },
  slug: { 
    type: String, 
    required: [true, 'Blog slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly (lowercase, hyphens only)']
  },
  content: { 
    type: String, 
    required: [true, 'Blog content is required'],
    minlength: [10, 'Content must be at least 10 characters']
  },
  thumbnail: { 
    type: String, 
    required: [true, 'Blog thumbnail is required'],
    default: ''
  },
  author: { 
    type: String, 
    required: [true, 'Author name is required'],
    default: 'Million Hub'
  }
}, {
  timestamps: true
});

// Index for faster queries
BlogSchema.index({ slug: 1 });
BlogSchema.index({ createdAt: -1 });

export default mongoose.models.Blog || mongoose.model<BlogDocument>('Blog', BlogSchema);
