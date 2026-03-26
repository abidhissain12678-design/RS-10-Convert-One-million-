"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('[authMiddleware] Token received:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');
    console.log('[authMiddleware] JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET (using default: secret)');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const secret = process.env.JWT_SECRET || 'chain10challenge_secret_key_2024';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        console.log('[authMiddleware] Token verified successfully, userId:', decoded.id);
        req.user = decoded;
        // Check if admin access is required (for admin routes)
        if (req.path.startsWith('/api/admin') && !decoded.isAdmin) {
            return res.status(403).json({ error: 'Admin access required.' });
        }
        next();
    }
    catch (error) {
        console.error('[authMiddleware] JWT verification failed:', error.message);
        res.status(400).json({ error: 'Invalid token. ' + error.message });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(403).json({ error: 'Admin access required.' });
    }
};
exports.adminMiddleware = adminMiddleware;
