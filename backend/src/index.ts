import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentRoutes';
import adminRoutes from './routes/adminRoutes';
import taskRoutes from './routes/taskRoutes';
import { expireOverdueUsersInternal } from './controllers/adminController';

dotenv.config();

// Set consistent JWT_SECRET if not in environment
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'chain10challenge_secret_key_2024';
  console.log('JWT_SECRET not found in environment, using default');
} else {
  console.log('JWT_SECRET found in environment');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads folder if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

// Ye sab se zaroori line hai connection ke liye
const allowedOrigins = ['http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.options('*', cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes connect karna
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chain10challenge')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    // Periodic background enforcement: lock overdue accounts every minute.
    setInterval(async () => {
      try {
        const processed = await expireOverdueUsersInternal();
        if (processed > 0) console.log(`[expireOverdueUsersInternal] updated ${processed} overdue accounts`);
      } catch (err: any) {
        console.error('Error running overdue-expiry sweep:', err);
      }
    }, 60 * 1000);
  })
  .catch(err => console.log('❌ DB Error:', err));