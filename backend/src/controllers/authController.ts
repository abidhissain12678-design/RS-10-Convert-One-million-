
import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// Get current user from token
export const getMe = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Register request body:', req.body);
    const { name, username, phone, email, city, password, referredBy } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      username,
      phone,
      email,
      city,
      password: hashedPassword,
      referredBy,
      activationStatus: 'not_requested',
      referralCount: 0,
      totalNetworkSize: 0,
      networkReferrals: Array.from({ length: 11 }, (_, i) => ({ position: i + 1, referralCode: `${username}-m${i + 1}`, status: 'locked' as 'locked' | 'unlocked' })),
      myReferralCode: username,
      referredUsers: []
    });
    await user.save();

    // Handle referral
    if (referredBy) {
      // Extract username from referral code (format: username-m{position})
      const referrerUsername = referredBy.split('-m')[0]; // Get username part before -m
      const positionMatch = referredBy.match(/-m(\d+)$/); // Extract position number
      const position = positionMatch ? parseInt(positionMatch[1]) : null;

      console.log('Referral processing:', { referredBy, referrerUsername, position, newUser: username });

      const referrer = await User.findOne({ username: referrerUsername });
      if (referrer) {
        console.log('Found referrer:', referrer.username, 'current referralCount:', referrer.referralCount);

        referrer.referralCount += 1;
        referrer.totalNetworkSize += 1;
        referrer.referredUsers.push(username);

        // If position is specified, unlock that specific box
        if (position && position >= 1 && position <= referrer.networkReferrals.length) {
          const boxIndex = position - 1; // Convert to 0-based index
          referrer.networkReferrals[boxIndex].status = 'unlocked';
          referrer.networkReferrals[boxIndex].referralCode = username;
          referrer.networkReferrals[boxIndex].paymentApproved = false;
          console.log(`Unlocked box ${position} (index ${boxIndex}) for user ${referrerUsername} with referral ${username}`);
        } else {
          // Fallback: unlock the next available box based on referralCount
          const nextIndex = referrer.referralCount - 1;
          if (nextIndex < referrer.networkReferrals.length) {
            referrer.networkReferrals[nextIndex].status = 'unlocked';
            referrer.networkReferrals[nextIndex].referralCode = username;
            referrer.networkReferrals[nextIndex].paymentApproved = false;
            console.log(`Fallback: Unlocked box ${nextIndex + 1} for user ${referrerUsername} with referral ${username}`);
          }
        }

        await referrer.save();
        console.log('Referrer updated successfully. New referralCount:', referrer.referralCount);
        console.log('Updated networkReferrals:', referrer.networkReferrals.map((r: any, i: number) => ({ pos: i+1, status: r.status, code: r.referralCode })));
      } else {
        console.log('Referrer not found:', referrerUsername);
      }
    }

    // Generate token for auto-login after registration
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'chain10challenge_secret_key_2024', { expiresIn: '30d' });
    console.log('[register] Token created for user:', user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        city: user.city,
        phone: user.phone,
        isAdmin: user.isAdmin,
        activationStatus: user.activationStatus
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please choose a different ${field}.` });
    }
    res.status(500).json({ message: 'An error occurred during registration. Please try again.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Special admin login
    if (email === 'admin@admin.com' && password === 'admin') {
      const token = jwt.sign({ id: 'admin', isAdmin: true }, process.env.JWT_SECRET || 'chain10challenge_secret_key_2024', { expiresIn: '30d' });
      console.log('[adminLogin] Admin token created');
      res.json({ token, user: { name: 'Admin', email: 'admin@admin.com', isAdmin: true } });
      return;
    }
    
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if user is banned
    if (user.banned) {
      return res.status(403).json({ error: '🚫 Account Banned - Your account has been permanently banned. Please contact support.' });
    }
    
    // Check if user is locked
    if (user.activationStatus === 'locked') {
      return res.status(403).json({ error: '🔒 Account Locked - Your account is locked due to failing the challenge. Please contact support or wait for reactivation.' });
    }
    
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'chain10challenge_secret_key_2024', { expiresIn: '30d' });
    console.log('[login] Token created for user:', user._id);
    res.json({ token, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    if (key === 'Abid786') {
      const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET || 'chain10challenge_secret_key_2024', { expiresIn: '30d' });
      console.log('[verifyOTP] Admin token created');
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid admin key' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(oldPassword, user.password)) {
      return res.status(401).json({ message: 'Invalid old password' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log('Forgot password request for:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    console.log('OTP generated:', otp, 'for user:', email);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
    };

    console.log('Sending email to:', email, 'from:', process.env.EMAIL_USER);
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.json({ message: 'OTP sent to your email' });
  } catch (error: any) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    // OTP verified, now allow password reset
    res.json({ message: 'OTP verified' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const requestActivation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.activationRequest) {
      return res.status(400).json({ message: 'Activation request already pending' });
    }
    user.activationRequest = true;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'User Activation Request',
      text: `User ${user.name} (${user.email}) has requested activation. Username: ${user.username}, Phone: ${user.phone}, City: ${user.city}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Activation request sent to admin' });
  } catch (error: any) {
    console.error('Error in requestActivation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get referred users for current user
export const getReferredUsers = async (req: any, res: any) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const referredUsers = await User.find({ username: { $in: user.referredUsers } });
    res.json(referredUsers);
  } catch (error: any) {
    console.error('Error in getReferredUsers:', error);
    res.status(500).json({ error: error.message });
  }
};