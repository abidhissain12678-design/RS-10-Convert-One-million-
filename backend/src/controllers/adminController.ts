import { Request, Response } from 'express';
import User from '../models/User';
import Payment from '../models/Payment';
import Settings from '../models/Settings';
import News from '../models/News';
import Notification from '../models/Notification';
import LockedAccount from '../models/LockedAccount';
import fs from 'fs';
import path from 'path';

const settingsFile = path.join(process.cwd(), 'settings.json');

// Helper to read settings
const readSettings = () => {
  if (fs.existsSync(settingsFile)) {
    return JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
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
const writeSettings = (settings: any) => {
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
};

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    console.log('Fetched settings:', settings);
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    console.log('Updating settings:', updateData);
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(updateData);
    } else {
      Object.assign(settings, updateData);
    }
    await settings.save();
    console.log('Settings updated successfully');
    res.json({ message: 'Settings updated' });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: error.message || 'Failed to update settings' });
  }
};

export const postNews = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const news = new News({ content });
    await news.save();
    res.json({ message: 'News posted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getNotificationsHistory = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const notification = new Notification({ content });
    await notification.save();
    res.json({ message: 'Notification sent successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const buyChance = async (req: Request, res: Response) => {
  try {
    const { userId, tid, amount } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const payment = new Payment({
      userId,
      username: user.name,
      transactionId: tid,
      amountType: amount,
      type: amount === 50 ? '1st Chance' : '2nd Chance',
      status: 'Pending'
    });
    await payment.save();
    res.json({ message: 'Chance purchase requested' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approveChance = async (req: Request, res: Response) => {
  try {
    const { paymentId, userId } = req.body;
    
    // Try to find by paymentId first (for payment records)
    let payment = null;
    let user = null;
    
    if (paymentId) {
      payment = await Payment.findById(paymentId);
      if (!payment) return res.status(404).json({ error: 'Payment not found' });
      user = await User.findById(payment.userId);
    } else if (userId) {
      // For direct user ID
      user = await User.findById(userId);
    }
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Update payment status if found
    if (payment) {
      payment.status = 'Approved';
      payment.approvedAt = new Date();
      await payment.save();
    }
    
    // Update user with chance level and timer
    if (payment?.type === '1st Chance') {
      user.chanceLevel = 1;
    } else if (payment?.type === '2nd Chance') {
      user.chanceLevel = 2;
    }
    
    // Set the 2-hour timer for chance activation
    user.activationStatus = 'approved';
    user.status = 'active';
    user.activationTime = new Date();
    user.timerEndTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
    
    await user.save();
    res.json({ message: 'Chance approved with timer started' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approveActivation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.activationStatus = 'approved';
    user.activationRequest = false;
    await user.save();
    res.json({ message: 'Activation approved' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get locked users (those whose timerEndTime has expired and are not complete)
export const getLockedUsers = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const expiredUsers = await User.find({
      timerEndTime: { $exists: true, $lte: now },
      activationStatus: { $in: ['approved', 'pending_chance', 'expired'] }
    });

    const lockedUsers = expiredUsers.filter(user => {
      const activeCount = user.networkReferrals.filter((r: any) => r.status === 'unlocked').length;
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
      activeCount: user.networkReferrals.filter((r: any) => r.status === 'unlocked').length
    })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Unlock a user (reset timerEndTime)
export const unlockUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { timerEndTime: null },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User unlocked successfully', user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Lock a user (set timerEndTime to now)
export const lockUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const existingUser = await User.findById(userId);
    if (!existingUser) return res.status(404).json({ error: 'User not found' });

    existingUser.timerEndTime = new Date();
    existingUser.activationStatus = 'locked';
    existingUser.chanceLevel = 3;
    existingUser.networkReferrals = existingUser.networkReferrals.map((r: any) => ({ ...r, status: 'locked' }));

    await existingUser.save();
    res.json({ message: 'User locked successfully', user: existingUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Expire overdue users and lock if referral count < 11
export const expireOverdueUsersInternal = async () => {
  const now = new Date();
  const candidates = await User.find({
    timerEndTime: { $exists: true, $lte: now },
    activationStatus: { $in: ['approved', 'pending_chance'] }
  });

  let processed = 0;
  for (const user of candidates) {
    const activeCount = user.networkReferrals.filter((r: any) => r.status === 'unlocked').length;
    if (activeCount >= 11) {
      user.activationStatus = 'completed';
    } else {
      user.activationStatus = 'locked';
      user.chanceLevel = 3;
      user.networkReferrals = user.networkReferrals.map((r: any) => ({ ...r, status: 'locked' }));
      
      // Create a LockedAccount record
      try {
        const existingRecord = await LockedAccount.findOne({ userId: user._id, unlocked: false });
        if (!existingRecord) {
          const lockedRecord = new LockedAccount({
            userId: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            city: user.city,
            referralCount: activeCount,
            requiredReferrals: 11,
            totalNetworkSize: user.totalNetworkSize,
            referredBy: user.referredBy,
            reasonLocked: 'Failed to reach 11 referrals within 2 hours',
            timerEndTime: user.timerEndTime,
            lockedAt: new Date()
          });
          await lockedRecord.save();
          console.log(`LockedAccount record created for user: ${user.username}`);
        }
      } catch (error) {
        console.error(`Error creating LockedAccount record for ${user.username}:`, error);
      }
    }
    await user.save();
    processed += 1;
  }

  return processed;
};

export const expireOverdueUsers = async (_req: Request, res: Response) => {
  try {
    const processed = await expireOverdueUsersInternal();
    res.json({ message: 'Overdue processing complete', processed });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password -otp -otpExpiry').sort({ createdAt: -1 });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update user data
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId, name, phone, email, city, username, referredBy } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, email, city, username, referredBy },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Ban user
export const banUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { banned: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User banned successfully', user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Unban user
export const unbanUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { banned: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User unbanned successfully', user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== LOCKED ACCOUNTS TABLE MANAGEMENT ====================

// Get all locked accounts from LockedAccount table
export const getAllLockedAccounts = async (req: Request, res: Response) => {
  try {
    const lockedAccounts = await LockedAccount.find({ unlocked: false })
      .sort({ lockedAt: -1 });
    res.json(lockedAccounts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new locked account record when user fails 2-hour challenge
export const createLockedAccountRecord = async (req: Request, res: Response) => {
  try {
    const { userId, username, email, phone, city, referralCount, totalNetworkSize, referredBy, timerEndTime } = req.body;
    
    // Check if record already exists
    const existingRecord = await LockedAccount.findOne({ userId, unlocked: false });
    if (existingRecord) {
      return res.status(400).json({ error: 'Record already exists for this user' });
    }

    const lockedAccount = new LockedAccount({
      userId,
      username,
      email,
      phone,
      city,
      referralCount,
      requiredReferrals: 11,
      totalNetworkSize,
      referredBy,
      reasonLocked: 'Failed to reach 11 referrals within 2 hours',
      timerEndTime,
      lockedAt: new Date()
    });

    await lockedAccount.save();
    res.json({ message: 'Locked account record created', lockedAccount });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Give second chance to locked account
export const giveSecondChanceToLockedAccount = async (req: Request, res: Response) => {
  try {
    const { lockedAccountId } = req.body;

    const lockedAccount = await LockedAccount.findByIdAndUpdate(
      lockedAccountId,
      {
        secondChanceGiven: true,
        secondChanceDate: new Date()
      },
      { new: true }
    );

    if (!lockedAccount) {
      return res.status(404).json({ error: 'Locked account record not found' });
    }

    // Also update user status
    await User.findByIdAndUpdate(lockedAccount.userId, {
      activationStatus: 'pending_chance',
      chanceLevel: 1
    });

    res.json({ message: 'Second chance given successfully', lockedAccount });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Unlock a locked account (remove from locked status)
export const unlockLockedAccount = async (req: Request, res: Response) => {
  try {
    const { lockedAccountId } = req.body;

    const lockedAccount = await LockedAccount.findByIdAndUpdate(
      lockedAccountId,
      {
        unlocked: true,
        unlockedAt: new Date()
      },
      { new: true }
    );

    if (!lockedAccount) {
      return res.status(404).json({ error: 'Locked account record not found' });
    }

    res.json({ message: 'Account unlocked successfully', lockedAccount });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update notes for locked account
export const updateLockedAccountNotes = async (req: Request, res: Response) => {
  try {
    const { lockedAccountId, notes } = req.body;

    const lockedAccount = await LockedAccount.findByIdAndUpdate(
      lockedAccountId,
      { notes },
      { new: true }
    );

    if (!lockedAccount) {
      return res.status(404).json({ error: 'Locked account record not found' });
    }

    res.json({ message: 'Notes updated successfully', lockedAccount });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== HELPER FUNCTIONS ====================

// Create LockedAccount records for existing locked users (backfill/migration)
export const backfillLockedAccounts = async (req: Request, res: Response) => {
  try {
    const lockedUsers = await User.find({ activationStatus: 'locked' });
    let created = 0;
    let skipped = 0;

    for (const user of lockedUsers) {
      const existingRecord = await LockedAccount.findOne({ userId: user._id, unlocked: false });
      
      if (!existingRecord) {
        const activeCount = user.networkReferrals.filter((r: any) => r.status === 'unlocked' || r.status === 'locked').length;
        
        const lockedRecord = new LockedAccount({
          userId: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          city: user.city,
          referralCount: activeCount,
          requiredReferrals: 11,
          totalNetworkSize: user.totalNetworkSize,
          referredBy: user.referredBy,
          reasonLocked: 'Failed to reach 11 referrals within 2 hours',
          timerEndTime: user.timerEndTime,
          lockedAt: user.updatedAt
        });
        
        await lockedRecord.save();
        created += 1;
      } else {
        skipped += 1;
      }
    }

    res.json({ 
      message: 'Backfill complete', 
      created, 
      skipped,
      total: lockedUsers.length
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create a test/sample locked account (for demo/testing purposes)
export const createTestLockedAccount = async (req: Request, res: Response) => {
  try {
    // Find a locked user from User collection
    const lockedUser = await User.findOne({ activationStatus: 'locked' });
    
    if (!lockedUser) {
      return res.status(400).json({ 
        error: 'No locked users found. Please lock a user first.' 
      });
    }

    // Check if record already exists
    const existingRecord = await LockedAccount.findOne({ 
      userId: lockedUser._id, 
      unlocked: false 
    });
    
    if (existingRecord) {
      return res.status(400).json({ 
        error: 'LockedAccount record already exists for this user' 
      });
    }

    const activeCount = lockedUser.networkReferrals.filter((r: any) => r.status === 'unlocked').length;

    const testRecord = new LockedAccount({
      userId: lockedUser._id,
      username: lockedUser.username,
      email: lockedUser.email,
      phone: lockedUser.phone,
      city: lockedUser.city,
      referralCount: activeCount,
      requiredReferrals: 11,
      totalNetworkSize: lockedUser.totalNetworkSize,
      referredBy: lockedUser.referredBy || 'Direct',
      reasonLocked: 'Failed to reach 11 referrals within 2 hours',
      timerEndTime: lockedUser.timerEndTime,
      lockedAt: new Date()
    });

    await testRecord.save();

    res.json({ 
      message: 'Test locked account record created successfully',
      record: testRecord
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};