import express from 'express';
import { 
  createBlog, 
  getAllBlogs, 
  getBlogBySlug, 
  updateBlog, 
  deleteBlog,
  getBlogsForAdmin,
  togglePublishBlog
} from '../controllers/blogController';
import { authMiddleware, adminMiddleware } from '../middleware/authmiddleware';

const router = express.Router();

// Admin routes MUST come before wildcard routes
router.post('/create', authMiddleware, adminMiddleware, createBlog);
router.get('/admin/all', authMiddleware, adminMiddleware, getBlogsForAdmin);
router.put('/:id', authMiddleware, adminMiddleware, updateBlog);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBlog);
router.post('/:id/toggle-publish', authMiddleware, adminMiddleware, togglePublishBlog);

// Public routes
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

export default router;
