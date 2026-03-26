import express from 'express';
import { requestActivation, requestWithdrawal, getPendingPayments, approvePayment, getUserPayments } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/authmiddleware';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/request-activation', authMiddleware, upload.any(), requestActivation);
router.post('/request-withdrawal', authMiddleware, requestWithdrawal);
router.post('/test-upload', upload.single('screenshot'), (req, res) => {
  console.log('Test upload - Body:', req.body);
  console.log('Test upload - File:', req.file);
  res.json({ body: req.body, file: req.file });
});
router.get('/pending-payments', getPendingPayments);
router.post('/approve-payment', approvePayment);
router.get('/user-payments', authMiddleware, getUserPayments);

export default router;