import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'], methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

export default app;