import express from 'express';
import { 
  createBlog, 
  getAllBlogs, 
  getBlogBySlug, 
  updateBlog, 
  deleteBlog,
  getBlogsForAdmin 
} from '../controllers/blogController';
import { authMiddleware, adminMiddleware } from '../middleware/authmiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Admin routes
router.post('/create', authMiddleware, adminMiddleware, createBlog);
router.put('/:id', authMiddleware, adminMiddleware, updateBlog);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBlog);
router.get('/admin/all', authMiddleware, adminMiddleware, getBlogsForAdmin);

export default router;
