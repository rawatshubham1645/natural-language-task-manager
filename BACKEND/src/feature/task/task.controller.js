import TaskRepository from './task.repository.js';
import { createTaskSchema, updateTaskSchema } from './task.validator.js';
import ValidationError from '../../utils/CustomError.js';


export default class TaskController {
  constructor() {
    this.taskRepository = new TaskRepository();
  }
  
  async createMultipleTasks(req, res, next) {
    try {
      const { tasks } = req.body;
      
      if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Tasks array is required'
        });
      }
      
      const createdTasks = [];
      const errors = [];
      
      // For demo purposes, we'll use a default user ID
      const defaultUserId = '65d1a8f1a3b4c2e1f0a1b2c3';
      
      for (const taskData of tasks) {
        try {
          // Validate input
          const { error } = createTaskSchema.validate(taskData);
          if (error) {
            errors.push({
              task: taskData,
              error: error.details[0].message
            });
            continue;
          }
          
          // Add user ID
          taskData.createdBy = defaultUserId;
          
          // Create the task
          const task = await this.taskRepository.createTask(taskData);
          createdTasks.push(task);
        } catch (error) {
          errors.push({
            task: taskData,
            error: error.message
          });
        }
      }
      
      res.status(201).json({
        success: true,
        message: `Created ${createdTasks.length} tasks successfully${errors.length > 0 ? ` with ${errors.length} errors` : ''}`,
        data: createdTasks,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (error) {
      next(error);
    }
  }
   async createTask(req, res, next) {
    try {
      // For natural language input
      let taskData = req.body;
      
      if (req.body.text) {
        // Parse natural language
        taskData = await this.taskRepository.parseNaturalLanguage(req.body.text);
        // Merge with any other provided fields
        taskData = { ...taskData, ...req.body };
        delete taskData.text;
      }
      
      // Validate input
      const { error } = createTaskSchema.validate(taskData);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      // For demo purposes, we'll use a default user ID
      // In a real app, this would come from the authenticated user
      taskData.createdBy = '65d1a8f1a3b4c2e1f0a1b2c3'; // Default user ID
      
      const task = await this.taskRepository.createTask(taskData);
      
      res.status(201).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

   async getTasks(req, res, next) {
    console.log("getTasks",req);
    try {
      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        sortBy: req.query.sortBy
      };
      
      // Use default user ID for demo purposes
      const tasks = await this.taskRepository.getTasks('65d1a8f1a3b4c2e1f0a1b2c3', filters);
      
      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  }

   async getTask(req, res, next) {
    try {
      const task = await this.taskRepository.getTaskById(req.params.id, '65d1a8f1a3b4c2e1f0a1b2c3');
      
      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

   async updateTask(req, res, next) {
    try {
      // Validate input
      const { error } = updateTaskSchema.validate(req.body);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      const task = await this.taskRepository.updateTask(
        req.params.id,
        '65d1a8f1a3b4c2e1f0a1b2c3',
        req.body
      );
      
      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

   async deleteTask(req, res, next) {
    try {
      await this.taskRepository.deleteTask(req.params.id, '65d1a8f1a3b4c2e1f0a1b2c3');
      
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      next(error);
    }
  }
}
