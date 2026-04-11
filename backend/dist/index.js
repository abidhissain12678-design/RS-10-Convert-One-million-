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
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
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
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'https://rs-10-convert-one-million.vercel.app',
    'https://rs-10-convert-one-million.onrender.com'
];
// CORS configuration with flexible origin checking
const corsOptions = {
    origin: function (origin, callback) {
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
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
// Routes connect karna
app.use('/api/auth', authRoutes_1.default);
app.use('/api/payment', paymentRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
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
mongoose_1.default.connect(mongoUri)
    .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Connected to database:', mongoose_1.default.connection.db?.databaseName || 'unknown');
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
