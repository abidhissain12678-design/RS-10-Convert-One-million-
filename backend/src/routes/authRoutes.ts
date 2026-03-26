import express from 'express';
import { register, login, adminLogin, getUser, updatePassword, forgotPassword, verifyOTP, resetPassword, requestActivation, getMe, getReferredUsers } from '../controllers/authController';
import { authMiddleware } from '../middleware/authmiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/user/:id', getUser);
router.post('/update-password', updatePassword);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Get current user
router.get('/me', authMiddleware, getMe);

// Get referred users
router.get('/referred-users', authMiddleware, getReferredUsers);

export default router;