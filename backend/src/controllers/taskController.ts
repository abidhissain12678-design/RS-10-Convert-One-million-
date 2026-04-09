import { Request, Response } from 'express';
import Task from '../models/Task';
import User from '../models/User';
import UserTask from '../models/UserTask';
import multer from 'multer';
import { storage } from '../utils/cloudinary';

const upload = multer({ storage });

export const getActiveTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({
      active: true,
      $expr: { $lt: ['$completedQuantity', '$totalQuantity'] }
    }).select('+completedBy');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const submitProof = [
  upload.array('proofs', 3), // Allow up to 3 files
  async (req: Request, res: Response) => {
    try {
      const { taskId } = req.body;
      const userId = (req as any).user.id;
      const files = req.files as Express.Multer.File[];
      
      console.log('submitProof called:', { taskId, userId, filesCount: files?.length });
      
      if (!taskId || !files || files.length === 0) {
        return res.status(400).json({ error: 'Task ID and at least one proof file required' });
      }

      if (files.length > 3) {
        return res.status(400).json({ error: 'Maximum 3 proof files allowed' });
      }

      const proofUrls = files.map(file => (file as any).path); // Cloudinary returns secure_url in path property

      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      if (!task.active || task.completedQuantity >= task.totalQuantity) {
        return res.status(400).json({ error: 'Task is no longer available' });
      }

      task.completedBy = task.completedBy || [];
      if (task.completedBy.includes(userId)) {
        return res.status(400).json({ error: 'You have already completed this task' });
      }

      let userTask = await UserTask.findOne({ userId, taskId });
      if (!userTask) {
        userTask = new UserTask({ userId, taskId });
      }

      userTask.proofSubmitted = true;
      userTask.proofUrls = proofUrls;
      userTask.status = 'Pending';
      userTask.completed = false;
      await userTask.save();

      // Add user to completedBy array to prevent further submissions
      task.completedBy.push(userId);
      await task.save();

      console.log('UserTask saved:', userTask._id, 'User added to completedBy');

      res.status(200).json({ message: 'Proof submitted successfully' });
    } catch (error) {
      console.error('submitProof error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
];

export const claimReward = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.body;
    const userId = (req as any).user.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if task is still active and has available slots
    if (!task.active || task.completedQuantity >= task.totalQuantity) {
      return res.status(400).json({ error: 'Task is no longer available' });
    }

    // Check if user already completed this task
    const existingUserTask = await UserTask.findOne({ userId, taskId, completed: true });
    if (existingUserTask) {
      return res.status(400).json({ error: 'You have already completed this task' });
    }

    const userTask = await UserTask.findOne({ userId, taskId });
    if (task.requiresProof && (!userTask || !userTask.proofSubmitted)) {
      return res.status(400).json({ error: 'Proof required before claiming reward' });
    }

    // Update user balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.balance += parseFloat(task.reward);
    await user.save();

    // Update task completedQuantity
    task.completedQuantity += 1;

    // Track completedBy for duplicate prevention
    task.completedBy = task.completedBy || [];
    if (!task.completedBy.includes(userId)) {
      task.completedBy.push(userId);
    }
    
    // Auto-disable if quantity reached
    if (task.completedQuantity >= task.totalQuantity) {
      task.active = false;
    }
    
    await task.save();

    // Mark userTask as completed
    if (userTask) {
      userTask.completed = true;
      await userTask.save();
    } else {
      // Create if not exists
      const newUserTask = new UserTask({ userId, taskId, completed: true });
      await newUserTask.save();
    }

    res.status(200).json({ message: 'Reward claimed successfully', newBalance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;
    
    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    
    await Task.findByIdAndDelete(taskId);
    await UserTask.deleteMany({ taskId });
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserTaskSubmissions = async (req: Request, res: Response) => {
  try {
    const userTasks = await UserTask.find({ proofSubmitted: true })
      .populate('userId', 'name username email')
      .populate('taskId', 'title taskType reward')
      .sort({ updatedAt: -1 });
    
    console.log('getUserTaskSubmissions found:', userTasks.length, 'submissions');
    
    res.status(200).json(userTasks);
  } catch (error) {
    console.error('getUserTaskSubmissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveTaskPayment = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.body;

    const userTask = await UserTask.findById(submissionId).populate('userId').populate('taskId');
    if (!userTask) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (userTask.completed) {
      return res.status(400).json({ error: 'Payment already approved' });
    }

    // Update user balance
    const user = await User.findById(userTask.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.balance += parseFloat(userTask.taskId.reward);
    await user.save();

    // Mark task as completed
    userTask.completed = true;
    await userTask.save();

    // Update task completedQuantity
    const task = await Task.findById(userTask.taskId);
    if (task) {
      task.completedQuantity += 1;
      task.completedBy = task.completedBy || [];
      if (!task.completedBy.includes(userTask.userId.toString())) {
        task.completedBy.push(userTask.userId.toString());
      }
      if (task.completedQuantity >= task.totalQuantity) {
        task.active = false;
      }
      await task.save();
    }

    res.status(200).json({ message: 'Payment approved successfully', newBalance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectTaskPayment = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.body;

    const userTask = await UserTask.findById(submissionId);
    if (!userTask) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (userTask.completed) {
      return res.status(400).json({ error: 'Cannot reject an already approved payment' });
    }

    // Reset the userTask to allow re-submission
    userTask.proofSubmitted = false;
    userTask.proofUrls = [];
    userTask.status = 'Rejected';
    await userTask.save();

    // If this was previously approved and then rejected, we need to handle that
    // But since we check !userTask.completed above, this shouldn't happen

    res.status(200).json({ message: 'Payment rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserTaskEarnings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const completedTasks = await UserTask.find({ userId, completed: true }).populate('taskId', 'reward');
    const totalEarnings = completedTasks.reduce((sum, task) => sum + parseFloat(task.taskId.reward), 0);

    res.status(200).json({ taskEarnings: totalEarnings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};