import express from 'express';
import { getActiveTasks, submitProof, claimReward, getAllTasks, updateTask, deleteTask, getUserTaskSubmissions, approveTaskPayment, rejectTaskPayment, getUserTaskEarnings, getCurrentUserSubmissions } from '../controllers/taskController';
import { authMiddleware } from '../middleware/authmiddleware';
import { adminMiddleware } from '../middleware/authmiddleware';

const router = express.Router();

router.get('/active', authMiddleware, getActiveTasks);
router.post('/submit-proof', authMiddleware, submitProof);
router.post('/claim-reward', authMiddleware, claimReward);
router.get('/user/submissions', authMiddleware, getUserTaskSubmissions);
router.get('/user/my-submissions', authMiddleware, getCurrentUserSubmissions);
router.get('/user/earnings', authMiddleware, getUserTaskEarnings);

// Admin routes
router.get('/all', authMiddleware, adminMiddleware, getAllTasks);
router.put('/:taskId', authMiddleware, adminMiddleware, updateTask);
router.delete('/:taskId', authMiddleware, adminMiddleware, deleteTask);
router.get('/admin/submissions', authMiddleware, adminMiddleware, getUserTaskSubmissions);
router.post('/admin/approve-payment', authMiddleware, adminMiddleware, approveTaskPayment);
router.post('/admin/reject-payment', authMiddleware, adminMiddleware, rejectTaskPayment);

export default router;