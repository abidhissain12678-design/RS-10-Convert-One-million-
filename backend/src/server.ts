import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentRoutes';
import adminRoutes from './routes/adminRoutes';
import taskRoutes from './routes/taskRoutes';

const app = express();  // 👈 YE LINE MUST HONA CHAHIYE (top par)

// ✅ Step 1: allowed origins define karo
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "https://rs-10-convert-one-million.vercel.app",
  "https://rs-10-convert-one-million.onrender.com"
];

// ✅ Step 2: CORS middleware with flexible origin checking
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (mobile apps, curl requests)
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
    
    callback(new Error("CORS not allowed"));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'multipart/form-data']
};

app.use(cors(corsOptions));

// ✅ Step 3: OPTIONS fix (IMPORTANT)
app.options('*', cors(corsOptions));

// ✅ Step 4: body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ Step 5: routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);

export default app;