"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const adminController_1 = require("./controllers/adminController");
dotenv_1.default.config();
// Set consistent JWT_SECRET if not in environment
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'chain10challenge_secret_key_2024';
    console.log('JWT_SECRET not found in environment, using default');
}
else {
    console.log('JWT_SECRET found in environment');
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Create uploads folder if it doesn't exist
if (!fs_1.default.existsSync('uploads')) {
    fs_1.default.mkdirSync('uploads', { recursive: true });
}
// Ye sab se zaroori line hai connection ke liye
app.use((0, cors_1.default)({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'https://rs-10-convert-one-million.vercel.app'], credentials: true }));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
// Routes connect karna
app.use('/api/auth', authRoutes_1.default);
app.use('/api/payment', paymentRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chain10challenge')
    .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    // Periodic background enforcement: lock overdue accounts every minute.
    setInterval(async () => {
        try {
            const processed = await (0, adminController_1.expireOverdueUsersInternal)();
            if (processed > 0)
                console.log(`[expireOverdueUsersInternal] updated ${processed} overdue accounts`);
        }
        catch (err) {
            console.error('Error running overdue-expiry sweep:', err);
        }
    }, 60 * 1000);
})
    .catch(err => console.log('❌ DB Error:', err));
