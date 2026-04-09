import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentRoutes';
import adminRoutes from './routes/adminRoutes';
import taskRoutes from './routes/taskRoutes';

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://rs-10-convert-one-million.vercel.app"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);

export default app;