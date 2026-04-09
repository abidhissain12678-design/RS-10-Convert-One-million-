"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const authmiddleware_1 = require("../middleware/authmiddleware");
const authmiddleware_2 = require("../middleware/authmiddleware");
const router = express_1.default.Router();
router.get('/active', authmiddleware_1.authMiddleware, taskController_1.getActiveTasks);
router.post('/submit-proof', authmiddleware_1.authMiddleware, taskController_1.submitProof);
router.post('/claim-reward', authmiddleware_1.authMiddleware, taskController_1.claimReward);
router.get('/user/submissions', authmiddleware_1.authMiddleware, taskController_1.getUserTaskSubmissions);
router.get('/user/earnings', authmiddleware_1.authMiddleware, taskController_1.getUserTaskEarnings);
// Admin routes
router.get('/all', authmiddleware_1.authMiddleware, authmiddleware_2.adminMiddleware, taskController_1.getAllTasks);
router.put('/:taskId', authmiddleware_1.authMiddleware, authmiddleware_2.adminMiddleware, taskController_1.updateTask);
router.delete('/:taskId', authmiddleware_1.authMiddleware, authmiddleware_2.adminMiddleware, taskController_1.deleteTask);
router.get('/admin/submissions', authmiddleware_1.authMiddleware, authmiddleware_2.adminMiddleware, taskController_1.getUserTaskSubmissions);
router.post('/admin/approve-payment', authmiddleware_1.authMiddleware, authmiddleware_2.adminMiddleware, taskController_1.approveTaskPayment);
router.post('/admin/reject-payment', authmiddleware_1.authMiddleware, authmiddleware_2.adminMiddleware, taskController_1.rejectTaskPayment);
exports.default = router;
