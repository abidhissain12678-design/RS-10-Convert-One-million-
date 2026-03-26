import express from 'express';
import multer from 'multer';
import { getPendingPayments, approvePayment, rejectPayment, getAllPayments, requestActivation } from '../controllers/paymentController';
import { getSettings, updateSettings, postNews, getNews, getNotificationsHistory, sendNotification, buyChance, approveChance, approveActivation, getLockedUsers, unlockUser, lockUser, expireOverdueUsers, getAllUsers, updateUser, banUser, unbanUser, getAllLockedAccounts, createLockedAccountRecord, giveSecondChanceToLockedAccount, unlockLockedAccount, updateLockedAccountNotes, backfillLockedAccounts, createTestLockedAccount } from '../controllers/adminController';
import { authMiddleware, adminMiddleware }  from '../middleware/authmiddleware';
import User from '../models/User';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Admin routes with authentication
router.get('/pending-payments', authMiddleware, getPendingPayments);
router.get('/all-payments', authMiddleware, adminMiddleware, getAllPayments);
router.post('/approve-payment', authMiddleware, adminMiddleware, approvePayment);
router.post('/reject-payment', authMiddleware, adminMiddleware, rejectPayment);
router.post('/approve-chance', authMiddleware, approveChance);
router.post('/approve-activation', authMiddleware, adminMiddleware, approveActivation);
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    console.log('Fetched users:', users.length);
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/ban-user/:id', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { banned: true });
    res.json({ message: 'User banned' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/unban-user/:id', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { banned: false });
    res.json({ message: 'User unbanned' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get-settings', getSettings);
router.post('/update-settings', authMiddleware, updateSettings);
router.post('/post-news', authMiddleware, postNews);
router.get('/get-news', getNews);
router.get('/notifications-history', getNotificationsHistory);
router.post('/send-notification', authMiddleware, sendNotification);
router.post('/buy-chance', authMiddleware, buyChance);
router.post('/request-activation', authMiddleware, upload.any(), requestActivation);

// Locked Users Routes
router.get('/locked-users', authMiddleware, adminMiddleware, getLockedUsers);
router.put('/unlock-user', authMiddleware, adminMiddleware, unlockUser);
router.put('/lock-user', authMiddleware, adminMiddleware, lockUser);
router.post('/expire-overdue-users', authMiddleware, adminMiddleware, expireOverdueUsers);

// User Management Routes
router.get('/all-users', authMiddleware, adminMiddleware, getAllUsers);
router.put('/update-user', authMiddleware, adminMiddleware, updateUser);
router.put('/ban-user', authMiddleware, adminMiddleware, banUser);
router.put('/unban-user', authMiddleware, adminMiddleware, unbanUser);

// ==================== LOCKED ACCOUNTS TABLE ROUTES ====================
router.get('/locked-accounts', authMiddleware, adminMiddleware, getAllLockedAccounts);
router.post('/create-locked-account', authMiddleware, adminMiddleware, createLockedAccountRecord);
router.post('/give-second-chance-locked', authMiddleware, adminMiddleware, giveSecondChanceToLockedAccount);
router.post('/unlock-locked-account', authMiddleware, adminMiddleware, unlockLockedAccount);
router.post('/update-locked-account-notes', authMiddleware, adminMiddleware, updateLockedAccountNotes);
router.post('/backfill-locked-accounts', authMiddleware, adminMiddleware, backfillLockedAccounts);
router.post('/create-test-locked-account', authMiddleware, adminMiddleware, createTestLockedAccount);

export default router;