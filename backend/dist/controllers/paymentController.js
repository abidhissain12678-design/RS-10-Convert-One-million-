"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPayments = exports.rejectPayment = exports.getAllPayments = exports.approvePayment = exports.getPendingPayments = exports.requestWithdrawal = exports.requestTaskWithdrawal = exports.requestActivation = void 0;
const Payment_1 = __importDefault(require("../models/Payment"));
const User_1 = __importDefault(require("../models/User"));
const multer_1 = __importDefault(require("multer"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Multer setup (Ensure 'uploads/' folder exists in backend root)
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const requestActivation = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        const userId = req.user?.id;
        console.log('Extracted userId from token:', userId);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized. Please login and try again.' });
        }
        const { transactionId, amountType } = req.body;
        if (!transactionId || !amountType) {
            return res.status(400).json({ error: 'Missing transactionId or amountType' });
        }
        // Find the screenshot file
        const screenshotFile = req.files?.find(file => file.fieldname === 'screenshot');
        const screenshotUrl = screenshotFile ? `/uploads/${screenshotFile.filename}` : undefined;
        console.log('Looking up user with ID:', userId);
        const user = await User_1.default.findById(userId);
        if (!user) {
            console.log('User not found with ID:', userId);
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('Creating payment object...');
        const payment = new Payment_1.default({
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
        }
        catch (emailError) {
            console.error('Error sending email:', emailError);
        }
        res.json({ message: 'Request submitted successfully', status: 'Pending' });
    }
    catch (error) {
        console.error('Error in requestActivation:', error);
        res.status(500).json({ error: error.message || 'Failed to process payment request' });
    }
};
exports.requestActivation = requestActivation;
const requestTaskWithdrawal = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized. Please login and try again.' });
        const { amount, method, accountNumber, accountHolderName } = req.body;
        if (!amount || !method || !accountNumber || !accountHolderName) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        if (parseInt(amount) < 100) {
            return res.status(400).json({ error: 'Minimum withdrawal amount is 100 RS.' });
        }
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Check if user has sufficient balance (assuming balance includes task earnings)
        if (user.balance < parseInt(amount)) {
            return res.status(400).json({ error: 'Insufficient balance.' });
        }
        const payment = new Payment_1.default({
            userId,
            username: user.name,
            email: user.email,
            transactionId: `TW-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            amountType: Number(amount),
            type: 'Task Withdraw',
            status: 'Pending',
            withdrawMethod: method,
            withdrawAccount: accountNumber,
            accountHolderName: accountHolderName
        });
        await payment.save();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Task Earnings Withdrawal Request',
            text: `Task earnings withdraw request from ${user.name} (${user.email}) for Rs. ${amount} via ${method}. Account: ${accountNumber}, Holder: ${accountHolderName}`,
        };
        try {
            await transporter.sendMail(mailOptions);
        }
        catch (e) {
            console.error('Task withdrawal mail send failed', e);
        }
        res.json({ message: 'Task withdrawal request sent, waiting for admin approval.', status: 'Pending' });
    }
    catch (error) {
        console.error('Error in requestTaskWithdrawal:', error);
        res.status(500).json({ error: error.message || 'Failed to process task withdrawal request' });
    }
};
exports.requestTaskWithdrawal = requestTaskWithdrawal;
const requestWithdrawal = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized. Please login and try again.' });
        const { amount, method, account } = req.body;
        if (!amount || !method || !account) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        if (parseInt(amount) < 100) {
            return res.status(400).json({ error: 'Minimum withdrawal amount is 100 RS.' });
        }
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Check if user has sufficient balance
        if (user.balance < parseInt(amount)) {
            return res.status(400).json({ error: 'Insufficient balance.' });
        }
        const payment = new Payment_1.default({
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
        try {
            await transporter.sendMail(mailOptions);
        }
        catch (e) {
            console.error('Withdrawal mail send failed', e);
        }
        res.json({ message: 'Withdrawal request sent, waiting for admin approval.', status: 'Pending' });
    }
    catch (error) {
        console.error('Error in requestWithdrawal:', error);
        res.status(500).json({ error: error.message || 'Failed to process withdrawal request' });
    }
};
exports.requestWithdrawal = requestWithdrawal;
// Admin will use this to see only pending requests
const getPendingPayments = async (req, res) => {
    try {
        const payments = await Payment_1.default.find({ status: 'Pending' }).sort({ createdAt: -1 });
        console.log('[getPendingPayments] count=', payments.length);
        res.json(payments);
    }
    catch (error) {
        console.error('[getPendingPayments] error', error);
        res.status(500).json({ error: error.message });
    }
};
exports.getPendingPayments = getPendingPayments;
// This moves the request to history by changing status
const approvePayment = async (req, res) => {
    try {
        const { paymentId } = req.body;
        const payment = await Payment_1.default.findById(paymentId);
        if (!payment)
            return res.status(404).json({ error: 'Payment not found' });
        payment.status = 'Approved';
        payment.approvedAt = new Date();
        await payment.save();
        const user = await User_1.default.findById(payment.userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
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
            }
            else if (payment.type === '2nd Chance') {
                user.chanceLevel = 2;
            }
            // Note: Referral logic is handled at registration time, not payment approval
            // The referrer's boxes are unlocked when the referred user registers, not when they get approved
        }
        else if (payment.type === 'Withdraw') {
            // Mega withdrawal approved - deduct from network earnings
            console.log('Mega Withdraw approved for user', user.email, 'Amount:', payment.amountType);
            // Deduct from balance
            user.balance = Math.max(0, (user.balance || 0) - payment.amountType);
        }
        else if (payment.type === 'Task Withdraw') {
            // Task earnings withdrawal approved - deduct from taskEarnings and balance
            const withdrawAmount = payment.amountType;
            console.log('Task Withdraw approved for user', user.email, 'Amount:', withdrawAmount);
            // Verify user has sufficient balance
            if (user.taskEarnings >= withdrawAmount) {
                user.taskEarnings -= withdrawAmount;
                user.balance = Math.max(0, (user.balance || 0) - withdrawAmount);
                console.log(`✅ Deducted ${withdrawAmount} from user. Remaining: ${user.taskEarnings}`);
            }
            else {
                console.warn(`⚠️ User insufficient balance. Requested: ${withdrawAmount}, Available: ${user.taskEarnings}`);
            }
        }
        await user.save();
        // Update referrer's networkReferrals paymentApproved if applicable
        if (user.referredBy) {
            const refParts = user.referredBy.split('-');
            const referrerUsername = refParts[0];
            const positionStr = refParts[refParts.length - 1];
            if (positionStr.startsWith('m')) {
                const position = parseInt(positionStr.slice(1));
                const referrer = await User_1.default.findOne({ username: referrerUsername });
                if (referrer && referrer.networkReferrals[position - 1]) {
                    referrer.networkReferrals[position - 1].paymentApproved = true;
                    await referrer.save();
                }
            }
        }
        res.json({ message: 'Payment Approved. User is now Active.' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.approvePayment = approvePayment;
// Admin will use this for the History tab - now shows all payments
const getAllPayments = async (req, res) => {
    try {
        // Fetches all payments: Pending, Approved, Rejected
        const payments = await Payment_1.default.find({}).sort({ createdAt: -1 });
        res.json(payments);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllPayments = getAllPayments;
const rejectPayment = async (req, res) => {
    try {
        const { paymentId } = req.body;
        await Payment_1.default.findByIdAndUpdate(paymentId, { status: 'Rejected' });
        res.json({ message: 'Payment rejected' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.rejectPayment = rejectPayment;
const getUserPayments = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from auth middleware
        const payments = await Payment_1.default.find({ userId }).sort({ createdAt: -1 });
        res.json(payments);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUserPayments = getUserPayments;
