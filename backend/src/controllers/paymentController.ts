import { Request, Response } from 'express';
import Payment from '../models/Payment';
import User from '../models/User';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Multer setup (Ensure 'uploads/' folder exists in backend root)
const upload = multer({ dest: 'uploads/' });

export const requestActivation = async (req: Request, res: Response) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    const userId = (req as any).user?.id;
    console.log('Extracted userId from token:', userId);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. Please login and try again.' });
    }
    const { transactionId, amountType } = req.body;
    
    if (!transactionId || !amountType) {
      return res.status(400).json({ error: 'Missing transactionId or amountType' });
    }

    // Find the screenshot file
    const screenshotFile = (req.files as any[])?.find(file => file.fieldname === 'screenshot');
    const screenshotUrl = screenshotFile ? `/uploads/${screenshotFile.filename}` : undefined;
    
    console.log('Looking up user with ID:', userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Creating payment object...');
    const payment = new Payment({
      userId,
      username: user.name,
      email: user.email,
      transactionId,
      screenshotUrl,
      amountType: Number(amountType),
      type: Number(amountType) === 10 ? 'Activation' : Number(amountType) === 50 ? '1st Chance' : '2nd Chance',
      status: 'Pending'
    });

    console.log('Saving payment...');
    await payment.save();
    console.log('Payment saved successfully:', payment._id);

    // Set user status to pending
    user.activationStatus = 'pending';
    console.log('Updating user activation status to pending...');
    await user.save();
    console.log('User updated successfully');

    // Send email to admin
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Payment Request',
      text: `New payment request from ${user.name} (${user.email}). Amount: ${amountType} rupees, Type: ${payment.type}, Transaction ID: ${transactionId}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Payment request email sent to admin');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    res.json({ message: 'Request submitted successfully', status: 'Pending' });
  } catch (error: any) {
    console.error('Error in requestActivation:', error);
    res.status(500).json({ error: error.message || 'Failed to process payment request' });
  }
};

export const requestWithdrawal = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized. Please login and try again.' });

    const { amount, method, account } = req.body;
    if (!amount || !method || !account) {
      return res.status(400).json({ error: 'amount, method, and account are required.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const payment = new Payment({
      userId,
      username: user.name,
      email: user.email,
      transactionId: `W-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      amountType: Number(amount),
      type: 'Withdraw',
      status: 'Pending',
      withdrawMethod: method,
      withdrawAccount: account
    });

    await payment.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Withdrawal Request',
      text: `Withdraw request from ${user.name} (${user.email}) for Rs. ${amount} via ${method}. Account: ${account}`,
    };
    try { await transporter.sendMail(mailOptions); } catch(e) { console.error('Withdrawal mail send failed', e); }

    res.json({ message: 'Withdrawal request sent, waiting for admin approval.', status: 'Pending' });
  } catch (error: any) {
    console.error('Error in requestWithdrawal:', error);
    res.status(500).json({ error: error.message || 'Failed to process withdrawal request' });
  }
};

// Admin will use this to see only pending requests
export const getPendingPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({ status: 'Pending' }).sort({ createdAt: -1 });
    console.log('[getPendingPayments] count=', payments.length);
    res.json(payments);
  } catch (error: any) {
    console.error('[getPendingPayments] error', error);
    res.status(500).json({ error: error.message });
  }
};

// This moves the request to history by changing status
export const approvePayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    payment.status = 'Approved';
    payment.approvedAt = new Date();
    await payment.save();

    const user = await User.findById(payment.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Activation Logic
    if (payment.type === 'Activation' || payment.type === '1st Chance' || payment.type === '2nd Chance') {
      user.activationStatus = 'approved';
      user.status = 'active';
      user.activationTime = new Date();
      // Setting 2-hour timer
      user.timerEndTime = new Date(Date.now() + 2 * 60 * 60 * 1000); 

      // Set chance level if applicable
      if (payment.type === '1st Chance') {
        user.chanceLevel = 1;
      } else if (payment.type === '2nd Chance') {
        user.chanceLevel = 2;
      }

      // Note: Referral logic is handled at registration time, not payment approval
      // The referrer's boxes are unlocked when the referred user registers, not when they get approved
    } else if (payment.type === 'Withdraw') {
      // Withdrawal approved; keep user activation as is
      console.log('Withdraw approved for user', user.email);
      // optionally track success/settlement metadata in Payment model (not required)
      
      // do not alter activation/chance fields for withdraw
    }

    await user.save();

    // Update referrer's networkReferrals paymentApproved if applicable
    if (user.referredBy) {
      const refParts = user.referredBy.split('-');
      const referrerUsername = refParts[0];
      const positionStr = refParts[refParts.length - 1];
      if (positionStr.startsWith('m')) {
        const position = parseInt(positionStr.slice(1));
        const referrer = await User.findOne({ username: referrerUsername });
        if (referrer && referrer.networkReferrals[position - 1]) {
          referrer.networkReferrals[position - 1].paymentApproved = true;
          await referrer.save();
        }
      }
    }

    res.json({ message: 'Payment Approved. User is now Active.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Admin will use this for the History tab - now shows all payments
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    // Fetches all payments: Pending, Approved, Rejected
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.body;
    await Payment.findByIdAndUpdate(paymentId, { status: 'Rejected' });
    res.json({ message: 'Payment rejected' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // Get user ID from auth middleware
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};