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
    "https://rs-10-convert-one-million.vercel.app"
];
// ✅ Step 2: CORS middleware
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("CORS not allowed"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// ✅ Step 3: OPTIONS fix (IMPORTANT)
app.options('*', (0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
// ✅ Step 4: body parser
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// ✅ Step 5: routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/payment', paymentRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
exports.default = app;
