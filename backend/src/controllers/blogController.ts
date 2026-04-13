import { Request, Response } from 'express';
import Blog from '../models/Blog';
import multer from 'multer';
import { storage } from '../utils/cloudinary';
import { calculateWordCount, calculateReadingTime, generateExcerpt } from '../utils/blogUtils';

const upload = multer({ storage: storage });

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 100); // Limit slug length
};

/**
 * CREATE BLOG - Admin only
 * POST /api/blogs/create
 */
export const createBlog = [
  upload.single('thumbnail'),
  async (req: Request, res: Response) => {
    try {
      const { title, content, author, status = 'draft', metaDescription, focusKeywords } = req.body;
      const thumbnail = (req.file as any)?.path || req.body.thumbnailUrl;

      // Validation
      if (!title || !content || !thumbnail) {
        return res.status(400).json({ 
          error: 'Title, content, and thumbnail are required' 
        });
      }

      // Calculate word count and reading time
      const wordCount = calculateWordCount(content);
      const readingTime = calculateReadingTime(wordCount);
      const excerpt = generateExcerpt(content, 300);

      // Generate slug from title
      let slug = generateSlug(title);
      
      // Check if slug already exists
      let slugExists = await Blog.findOne({ slug });
      let counter = 1;
      const baseSlug = slug;
      
      while (slugExists) {
        slug = `${baseSlug}-${counter}`;
        slugExists = await Blog.findOne({ slug });
        counter++;
      }

      // Parse focusKeywords if it's a string
      let keywordsArray = [];
      if (focusKeywords) {
        if (typeof focusKeywords === 'string') {
          keywordsArray = focusKeywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);
        } else if (Array.isArray(focusKeywords)) {
          keywordsArray = focusKeywords;
        }
      }

      // Create new blog
      const newBlog = new Blog({
        title: title.trim(),
        slug,
        content: content.trim(),
        thumbnail,
        author: author || 'Million Hub',
        status: status || 'draft',
        metaDescription: metaDescription?.trim() || '',
        focusKeywords: keywordsArray,
        wordCount,
        readingTime,
        excerpt,
        publishedAt: status === 'published' ? new Date() : null
      });

      const savedBlog = await newBlog.save();

      console.log('✅ Blog created successfully:', {
        id: savedBlog._id,
        title: savedBlog.title,
        slug: savedBlog.slug,
        status: savedBlog.status,
        wordCount: savedBlog.wordCount,
        readingTime: savedBlog.readingTime
      });

      res.status(201).json({
        message: 'Blog created successfully',
        blog: savedBlog
      });
    } catch (error: any) {
      console.error('❌ Error creating blog:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to create blog' 
      });
    }
  }
];

/**
 * GET ALL BLOGS - Public
 * GET /api/blogs
 */
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .select('_id title slug thumbnail author createdAt readingTime excerpt focusKeywords');

    console.log('📚 Fetched all published blogs:', blogs.length);

    res.status(200).json({
      count: blogs.length,
      blogs
    });
  } catch (error: any) {
    console.error('❌ Error fetching blogs:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch blogs' 
    });
  }
};

/**
 * GET SINGLE BLOG BY SLUG - Public
 * GET /api/blogs/:slug
 */
export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, status: 'published' });

    if (!blog) {
      return res.status(404).json({ 
        error: 'Blog not found' 
      });
    }

    console.log('📖 Fetched blog:', blog.slug);

    res.status(200).json(blog);
  } catch (error: any) {
    console.error('❌ Error fetching blog:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch blog' 
    });
  }
};

/**
 * UPDATE BLOG - Admin only
 * PUT /api/blogs/:id
 */
export const updateBlog = [
  upload.single('thumbnail'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, content, author, status, metaDescription, focusKeywords } = req.body;
      const thumbnail = (req.file as any)?.path;

      const blog = await Blog.findById(id);

      if (!blog) {
        return res.status(404).json({ 
          error: 'Blog not found' 
        });
      }

      // Update fields if provided
      if (title) {
        blog.title = title.trim();
        // Generate new slug if title changed
        blog.slug = generateSlug(title);
      }
      if (content) {
        blog.content = content.trim();
        // Recalculate word count and reading time
        blog.wordCount = calculateWordCount(content);
        blog.readingTime = calculateReadingTime(blog.wordCount);
        blog.excerpt = generateExcerpt(content, 300);
      }
      if (thumbnail) blog.thumbnail = thumbnail;
      if (author) blog.author = author;
      
      if (status) {
        blog.status = status;
        // Set publishedAt when status changes to published
        if (status === 'published' && !blog.publishedAt) {
          blog.publishedAt = new Date();
        }
      }

      if (metaDescription) blog.metaDescription = metaDescription.trim();
      
      if (focusKeywords) {
        let keywordsArray = [];
        if (typeof focusKeywords === 'string') {
          keywordsArray = focusKeywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);
        } else if (Array.isArray(focusKeywords)) {
          keywordsArray = focusKeywords;
        }
        blog.focusKeywords = keywordsArray;
      }

      const updatedBlog = await blog.save();

      console.log('✏️ Blog updated successfully:', {
        id: updatedBlog._id,
        status: updatedBlog.status,
        wordCount: updatedBlog.wordCount
      });

      res.status(200).json({
        message: 'Blog updated successfully',
        blog: updatedBlog
      });
    } catch (error: any) {
      console.error('❌ Error updating blog:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to update blog' 
      });
    }
  }
];

/**
 * DELETE BLOG - Admin only
 * DELETE /api/blogs/:id
 */
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ 
        error: 'Blog not found' 
      });
    }

    console.log('🗑️ Blog deleted successfully:', blog._id);

    res.status(200).json({
      message: 'Blog deleted successfully',
      deletedBlog: blog
    });
  } catch (error: any) {
    console.error('❌ Error deleting blog:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to delete blog' 
    });
  }
};

/**
 * GET BLOGS FOR ADMIN (with all fields, including drafts) - Admin only
 * GET /api/blogs/admin/all
 */
export const getBlogsForAdmin = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 });

    console.log('📚 Fetched all blogs for admin:', blogs.length);

    res.status(200).json({
      count: blogs.length,
      blogs
    });
  } catch (error: any) {
    console.error('❌ Error fetching blogs for admin:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch blogs' 
    });
  }
};

/**
 * Change blog publish status
 * POST /api/blogs/:id/publish or /api/blogs/:id/unpublish
 */
export const togglePublishBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { publish } = req.body; // true to publish, false to unpublish

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    blog.status = publish ? 'published' : 'draft';
    if (publish && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    const updatedBlog = await blog.save();

    console.log(`📤 Blog ${publish ? 'published' : 'unpublished'}:`, blog._id);

    res.status(200).json({
      message: `Blog ${publish ? 'published' : 'unpublished'} successfully`,
      blog: updatedBlog
    });
  } catch (error: any) {
    console.error('❌ Error toggling publish status:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to toggle publish status' 
    });
  }
};
