import mongoose, { Document, Schema } from 'mongoose';

export interface BlogDocument extends Document {
  title: string;
  slug: string; // Unique page-friendly URL
  content: string; // HTML/rich text content
  thumbnail: string; // Cloudinary URL
  author: string; // Admin name
  status: 'draft' | 'published'; // Draft or Published
  metaDescription: string; // SEO meta description
  focusKeywords: string[]; // SEO focus keywords
  wordCount: number; // Auto-calculated word count
  readingTime: number; // Auto-calculated reading time in minutes
  excerpt: string; // Short preview text
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date; // When blog was published
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
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description must not exceed 160 characters'],
    default: ''
  },
  focusKeywords: {
    type: [String],
    default: []
  },
  wordCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number, // in minutes
    default: 0
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt must not exceed 300 characters'],
    default: ''
  },
  publishedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
BlogSchema.index({ slug: 1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ status: 1, publishedAt: -1 });
BlogSchema.index({ focusKeywords: 1 });

export default mongoose.models.Blog || mongoose.model<BlogDocument>('Blog', BlogSchema);
