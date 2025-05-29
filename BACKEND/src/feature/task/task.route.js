import { Router } from 'express';
import TaskController from './task.controller.js';
// import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

// Apply auth middleware to all task routes
// router.use(authMiddleware);
const taskController = new TaskController();
// Create a new task (supports both natural language and structured input)
router.post('/',(req,res,next)=> taskController.createTask(req,res,next));

// Create multiple tasks at once
router.post('/batch',(req,res,next)=> taskController.createMultipleTasks(req,res,next));

// Get all tasks with optional filtering
router.get('/',(req,res,next)=> taskController.getTasks(req,res,next));

// Get a single task by ID
router.get('/:id', (req,res,next)=> taskController.getTask(req,res,next));

// Update a task
router.put('/:id', (req,res,next)=> taskController.updateTask(req,res,next));

// Delete a task
router.delete('/:id', (req,res,next)=> taskController.deleteTask(req,res,next));

export default router;
