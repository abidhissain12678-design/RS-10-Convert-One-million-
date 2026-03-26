"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const authmiddleware_1 = require("../middleware/authmiddleware");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const router = express_1.default.Router();
router.post('/request-activation', authmiddleware_1.authMiddleware, upload.any(), paymentController_1.requestActivation);
router.post('/test-upload', upload.single('screenshot'), (req, res) => {
    console.log('Test upload - Body:', req.body);
    console.log('Test upload - File:', req.file);
    res.json({ body: req.body, file: req.file });
});
router.get('/pending-payments', paymentController_1.getPendingPayments);
router.post('/approve-payment', paymentController_1.approvePayment);
router.get('/user-payments', authmiddleware_1.authMiddleware, paymentController_1.getUserPayments);
exports.default = router;
