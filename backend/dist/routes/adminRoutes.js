"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const paymentController_1 = require("../controllers/paymentController");
const adminController_1 = require("../controllers/adminController");
const authmiddleware_1 = require("../middleware/authmiddleware");
const User_1 = __importDefault(require("../models/User"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const router = express_1.default.Router();
// Admin routes with authentication
router.get('/pending-payments', authmiddleware_1.authMiddleware, paymentController_1.getPendingPayments);
router.get('/all-payments', authmiddleware_1.authMiddleware, authmiddleware_1.adminMiddleware, paymentController_1.getAllPayments);
router.post('/approve-payment', authmiddleware_1.authMiddleware, authmiddleware_1.adminMiddleware, paymentController_1.approvePayment);
router.post('/reject-payment', authmiddleware_1.authMiddleware, paymentController_1.rejectPayment);
router.post('/approve-chance', authmiddleware_1.authMiddleware, adminController_1.approveChance);
router.post('/approve-activation', authmiddleware_1.authMiddleware, authmiddleware_1.adminMiddleware, adminController_1.approveActivation);
router.get('/users', authmiddleware_1.authMiddleware, async (req, res) => {
    try {
        const users = await User_1.default.find();
        console.log('Fetched users:', users.length);
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/ban-user/:id', authmiddleware_1.authMiddleware, async (req, res) => {
    try {
        await User_1.default.findByIdAndUpdate(req.params.id, { banned: true });
        res.json({ message: 'User banned' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/unban-user/:id', authmiddleware_1.authMiddleware, async (req, res) => {
    try {
        await User_1.default.findByIdAndUpdate(req.params.id, { banned: false });
        res.json({ message: 'User unbanned' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/get-settings', adminController_1.getSettings);
router.post('/update-settings', authmiddleware_1.authMiddleware, adminController_1.updateSettings);
router.post('/post-news', authmiddleware_1.authMiddleware, adminController_1.postNews);
router.get('/get-news', adminController_1.getNews);
router.get('/notifications-history', adminController_1.getNotificationsHistory);
router.post('/send-notification', authmiddleware_1.authMiddleware, adminController_1.sendNotification);
router.post('/buy-chance', authmiddleware_1.authMiddleware, adminController_1.buyChance);
router.post('/request-activation', authmiddleware_1.authMiddleware, upload.any(), paymentController_1.requestActivation);
// Locked Users Routes
router.get('/locked-users', authmiddleware_1.authMiddleware, authmiddleware_1.adminMiddleware, adminController_1.getLockedUsers);
router.put('/unlock-user', authmiddleware_1.authMiddleware, authmiddleware_1.adminMiddleware, adminController_1.unlockUser);
router.put('/lock-user', authmiddleware_1.authMiddleware, authmiddleware_1.adminMiddleware, adminController_1.lockUser);
router.post('/expire-overdue-users', authmiddleware_1.authMiddleware, authmiddleware_1.adminMiddleware, adminController_1.expireOverdueUsers);
// User Management Routes
router.get('/all-users', authmiddleware_1.authMiddleware, authmiddleware_1.adminMiddleware, adminController_1.getAllUsers);
router.put('/update-user', authmiddleware_1.authMiddleware, authmiddleware_1.adminMiddleware, adminController_1.updateUser);
router.put('/ban-user', authmiddleware_1.authMiddleware, authmiddleware_1.adminMiddleware, adminController_1.banUser);
router.put('/unban-user', authmiddleware_1.authMiddleware, authmiddleware_1.adminMiddleware, adminController_1.unbanUser);
exports.default = router;
