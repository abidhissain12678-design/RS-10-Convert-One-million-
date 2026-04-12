"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const app = (0, express_1.default)(); // 👈 YE LINE MUST HONA CHAHIYE (top par)
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
    origin: function (origin, callback) {
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
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control']
};
app.use((0, cors_1.default)(corsOptions));
// ✅ Step 3: OPTIONS fix (IMPORTANT)
app.options('*', (0, cors_1.default)(corsOptions));
// ✅ Step 4: body parser
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// ✅ Step 5: routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/payment', paymentRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
exports.default = app;
