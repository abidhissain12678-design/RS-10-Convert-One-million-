"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    password: { type: String, required: true },
    referredBy: { type: String },
    isAdmin: { type: Boolean, default: false },
    activationStatus: { type: String, default: 'not_requested', enum: ['not_requested', 'pending', 'approved', 'expired', 'pending_chance', 'locked', 'completed'] },
    banned: { type: Boolean, default: false },
    myReferralCode: { type: String },
    referralCount: { type: Number, default: 0 },
    totalNetworkSize: { type: Number, default: 0 },
    timerEndTime: { type: Date },
    networkReferrals: [{ position: Number, referralCode: String, status: { type: String, enum: ['locked', 'unlocked'], default: 'locked' }, paymentApproved: { type: Boolean, default: false } }],
    referredUsers: [{ type: String }], // Array of usernames
    otp: { type: String },
    otpExpiry: { type: Date },
    activationRequest: { type: Boolean, default: false },
    chanceLevel: { type: Number, default: 0 },
    taskEarnings: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = mongoose_1.default.models.User || mongoose_1.default.model('User', UserSchema);
