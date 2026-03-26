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
const SettingsSchema = new mongoose_1.Schema({
    jazzcash: { type: String, default: '0300-1234567' },
    easypaisa: { type: String, default: '0345-1234567' },
    bank: { type: String, default: 'HBL - 1234567890123456' },
    withdrawLimit: { type: String, default: '500' },
    ytLink: { type: String, default: '' },
    ytSlogan: { type: String, default: 'Subscribe for Updates' },
    ttLink: { type: String, default: '' },
    ttSlogan: { type: String, default: 'Follow for Fun' },
    twLink: { type: String, default: '' },
    twSlogan: { type: String, default: 'Latest Updates' },
    fbLink: { type: String, default: '' },
    fbSlogan: { type: String, default: 'Join Our Community' },
    liLink: { type: String, default: '' },
    liSlogan: { type: String, default: 'Professional Network' },
    waLink: { type: String, default: '' },
    waSlogan: { type: String, default: 'Get Alerts on WhatsApp' },
    igLink: { type: String, default: '' },
    igSlogan: { type: String, default: 'See Our Stories' },
    notice: { type: String, default: '' },
}, { timestamps: true });
exports.default = mongoose_1.default.models.Settings || mongoose_1.default.model('Settings', SettingsSchema);
