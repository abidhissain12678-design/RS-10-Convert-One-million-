import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import dns from 'dns';
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentRoutes';
import adminRoutes from './routes/adminRoutes';
import taskRoutes from './routes/taskRoutes';
import { expireOverdueUsersInternal } from './controllers/adminController';

// ✅ Configure DNS for MongoDB Atlas connection
dns.setServers(['1.1.1.1', '8.8.8.8']);

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
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'https://rs-10-convert-one-million.vercel.app',
  'https://rs-10-convert-one-million.onrender.com'
];

// CORS configuration with flexible origin checking
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in whitelist
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow localhost origins in development
    if (process.env.NODE_ENV !== 'production' && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return callback(null, true);
    }
    
    callback(new Error('CORS not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'multipart/form-data']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes connect karna
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);

// Get MongoDB URI - use local for development, require MONGO_URI for production
const mongoUri = process.env.MONGO_URI || 
  (process.env.NODE_ENV === 'production' 
    ? (() => { throw new Error('MONGO_URI environment variable is required for production'); })()
    : 'mongodb://127.0.0.1:27017/chain10challenge');

// Log connection details (hide password)
const displayUri = mongoUri.includes('mongodb+srv') 
  ? mongoUri.replace(/:[^@]*@/, ':****@') 
  : mongoUri;
console.log('🔄 Connecting to MongoDB:', displayUri);
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('⏰ Connection time:', new Date().toISOString());

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Connected to database:', mongoose.connection.db?.databaseName || 'unknown');
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