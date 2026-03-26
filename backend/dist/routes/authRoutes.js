"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = express_1.default.Router();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/admin-login', authController_1.adminLogin);
router.get('/user/:id', authController_1.getUser);
router.post('/update-password', authController_1.updatePassword);
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/verify-otp', authController_1.verifyOTP);
router.post('/reset-password', authController_1.resetPassword);
// Get current user
router.get('/me', authmiddleware_1.authMiddleware, authController_1.getMe);
// Get referred users
router.get('/referred-users', authmiddleware_1.authMiddleware, authController_1.getReferredUsers);
exports.default = router;
