import express from 'express';
import { requestActivation, requestWithdrawal, requestTaskWithdrawal, getPendingPayments, approvePayment, rejectPayment, getUserPayments } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/authmiddleware';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/request-activation', authMiddleware, upload.any(), requestActivation);
router.post('/request-withdrawal', authMiddleware, requestWithdrawal);
router.post('/request-task-withdrawal', authMiddleware, requestTaskWithdrawal);
router.post('/test-upload', upload.single('screenshot'), (req, res) => {
  console.log('Test upload - Body:', req.body);
  console.log('Test upload - File:', req.file);
  res.json({ body: req.body, file: req.file });
});
router.get('/pending-payments', getPendingPayments);
router.post('/approve-payment', approvePayment);
router.post('/reject-payment', rejectPayment);
router.get('/user-payments', authMiddleware, getUserPayments);
router.get('/my-withdrawals', authMiddleware, getMyWithdrawals);

export default router;