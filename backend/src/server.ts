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
  "https://rs-10-convert-one-million.vercel.app"
];

// ✅ Step 2: CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Step 3: OPTIONS fix (IMPORTANT)
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Step 4: body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ Step 5: routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);

export default app;