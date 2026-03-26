"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unbanUser = exports.banUser = exports.updateUser = exports.getAllUsers = exports.expireOverdueUsers = exports.expireOverdueUsersInternal = exports.lockUser = exports.unlockUser = exports.getLockedUsers = exports.approveActivation = exports.approveChance = exports.buyChance = exports.sendNotification = exports.getNotificationsHistory = exports.getNews = exports.postNews = exports.updateSettings = exports.getSettings = void 0;
const User_1 = __importDefault(require("../models/User"));
const Payment_1 = __importDefault(require("../models/Payment"));
const Settings_1 = __importDefault(require("../models/Settings"));
const News_1 = __importDefault(require("../models/News"));
const Notification_1 = __importDefault(require("../models/Notification"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const settingsFile = path_1.default.join(process.cwd(), 'settings.json');
// Helper to read settings
const readSettings = () => {
    if (fs_1.default.existsSync(settingsFile)) {
        return JSON.parse(fs_1.default.readFileSync(settingsFile, 'utf8'));
    }
    return {
        jazzcash: '0300-1234567',
        easypaisa: '0345-1234567',
        bank: 'HBL - 1234567890123456',
        withdrawLimit: '500',
        ytLink: '', ytSlogan: 'Subscribe for Updates',
        ttLink: '', ttSlogan: 'Follow for Fun',
        twLink: '', twSlogan: 'Latest Updates',
        fbLink: '', fbSlogan: 'Join Our Community',
        liLink: '', liSlogan: 'Professional Network',
        waLink: '', waSlogan: 'Get Alerts on WhatsApp',
        igLink: '', igSlogan: 'See Our Stories',
        notice: ''
    };
};
// Helper to write settings
const writeSettings = (settings) => {
    fs_1.default.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
};
const getSettings = async (req, res) => {
    try {
        let settings = await Settings_1.default.findOne();
        if (!settings) {
            settings = new Settings_1.default();
            await settings.save();
        }
        console.log('Fetched settings:', settings);
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        const updateData = req.body;
        console.log('Updating settings:', updateData);
        let settings = await Settings_1.default.findOne();
        if (!settings) {
            settings = new Settings_1.default(updateData);
        }
        else {
            Object.assign(settings, updateData);
        }
        await settings.save();
        console.log('Settings updated successfully');
        res.json({ message: 'Settings updated' });
    }
    catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: error.message || 'Failed to update settings' });
    }
};
exports.updateSettings = updateSettings;
const postNews = async (req, res) => {
    try {
        const { content } = req.body;
        const news = new News_1.default({ content });
        await news.save();
        res.json({ message: 'News posted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.postNews = postNews;
const getNews = async (req, res) => {
    try {
        const news = await News_1.default.find().sort({ createdAt: -1 });
        res.json(news);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getNews = getNews;
const getNotificationsHistory = async (req, res) => {
    try {
        const notifications = await Notification_1.default.find().sort({ createdAt: -1 });
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getNotificationsHistory = getNotificationsHistory;
const sendNotification = async (req, res) => {
    try {
        const { content } = req.body;
        const notification = new Notification_1.default({ content });
        await notification.save();
        res.json({ message: 'Notification sent successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.sendNotification = sendNotification;
const buyChance = async (req, res) => {
    try {
        const { userId, tid, amount } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const payment = new Payment_1.default({
            userId,
            username: user.name,
            transactionId: tid,
            amountType: amount,
            type: amount === 50 ? '1st Chance' : '2nd Chance',
            status: 'Pending'
        });
        await payment.save();
        res.json({ message: 'Chance purchase requested' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.buyChance = buyChance;
const approveChance = async (req, res) => {
    try {
        const { paymentId, userId } = req.body;
        // Try to find by paymentId first (for payment records)
        let payment = null;
        let user = null;
        if (paymentId) {
            payment = await Payment_1.default.findById(paymentId);
            if (!payment)
                return res.status(404).json({ error: 'Payment not found' });
            user = await User_1.default.findById(payment.userId);
        }
        else if (userId) {
            // For direct user ID
            user = await User_1.default.findById(userId);
        }
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Update payment status if found
        if (payment) {
            payment.status = 'Approved';
            payment.approvedAt = new Date();
            await payment.save();
        }
        // Update user with chance level and timer
        if (payment?.type === '1st Chance') {
            user.chanceLevel = 1;
        }
        else if (payment?.type === '2nd Chance') {
            user.chanceLevel = 2;
        }
        // Set the 2-hour timer for chance activation
        user.activationStatus = 'approved';
        user.status = 'active';
        user.activationTime = new Date();
        user.timerEndTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
        await user.save();
        res.json({ message: 'Chance approved with timer started' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.approveChance = approveChance;
const approveActivation = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        user.activationStatus = 'approved';
        user.activationRequest = false;
        await user.save();
        res.json({ message: 'Activation approved' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.approveActivation = approveActivation;
// Get locked users (those whose timerEndTime has expired and are not complete)
const getLockedUsers = async (req, res) => {
    try {
        const now = new Date();
        const expiredUsers = await User_1.default.find({
            timerEndTime: { $exists: true, $lte: now },
            activationStatus: { $in: ['approved', 'pending_chance', 'expired'] }
        });
        const lockedUsers = expiredUsers.filter(user => {
            const activeCount = user.networkReferrals.filter((r) => r.status === 'unlocked').length;
            return activeCount < 11;
        });
        res.json(lockedUsers.map(user => ({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            city: user.city,
            activationStatus: user.activationStatus,
            timerEndTime: user.timerEndTime,
            referralCount: user.referralCount,
            activeCount: user.networkReferrals.filter((r) => r.status === 'unlocked').length
        })));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getLockedUsers = getLockedUsers;
// Unlock a user (reset timerEndTime)
const unlockUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User_1.default.findByIdAndUpdate(userId, { timerEndTime: null }, { new: true });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User unlocked successfully', user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.unlockUser = unlockUser;
// Lock a user (set timerEndTime to now)
const lockUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const existingUser = await User_1.default.findById(userId);
        if (!existingUser)
            return res.status(404).json({ error: 'User not found' });
        existingUser.timerEndTime = new Date();
        existingUser.activationStatus = 'locked';
        existingUser.chanceLevel = 3;
        existingUser.networkReferrals = existingUser.networkReferrals.map((r) => ({ ...r, status: 'locked' }));
        await existingUser.save();
        res.json({ message: 'User locked successfully', user: existingUser });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.lockUser = lockUser;
// Expire overdue users and lock if referral count < 11
const expireOverdueUsersInternal = async () => {
    const now = new Date();
    const candidates = await User_1.default.find({
        timerEndTime: { $exists: true, $lte: now },
        activationStatus: { $in: ['approved', 'pending_chance'] }
    });
    let processed = 0;
    for (const user of candidates) {
        const activeCount = user.networkReferrals.filter((r) => r.status === 'unlocked').length;
        if (activeCount >= 11) {
            user.activationStatus = 'completed';
        }
        else {
            user.activationStatus = 'locked';
            user.chanceLevel = 3;
            user.networkReferrals = user.networkReferrals.map((r) => ({ ...r, status: 'locked' }));
        }
        await user.save();
        processed += 1;
    }
    return processed;
};
exports.expireOverdueUsersInternal = expireOverdueUsersInternal;
const expireOverdueUsers = async (_req, res) => {
    try {
        const processed = await (0, exports.expireOverdueUsersInternal)();
        res.json({ message: 'Overdue processing complete', processed });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.expireOverdueUsers = expireOverdueUsers;
// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.default.find().select('-password -otp -otpExpiry').sort({ createdAt: -1 });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllUsers = getAllUsers;
// Update user data
const updateUser = async (req, res) => {
    try {
        const { userId, name, phone, email, city, username, referredBy } = req.body;
        const user = await User_1.default.findByIdAndUpdate(userId, { name, phone, email, city, username, referredBy }, { new: true });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User updated successfully', user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateUser = updateUser;
// Ban user
const banUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User_1.default.findByIdAndUpdate(userId, { banned: true }, { new: true });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User banned successfully', user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.banUser = banUser;
// Unban user
const unbanUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User_1.default.findByIdAndUpdate(userId, { banned: false }, { new: true });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User unbanned successfully', user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.unbanUser = unbanUser;
