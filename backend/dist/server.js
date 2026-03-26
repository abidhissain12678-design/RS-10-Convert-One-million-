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
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: ['http://localhost:3000', 'http://localhost:3001'], methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/payment', paymentRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
exports.default = app;
