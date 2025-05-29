import Joi from 'joi';

export const createTaskSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(100)
    .messages({
      'string.empty': 'Task name is required',
      'string.min': 'Task name must be at least 3 characters long',
      'string.max': 'Task name cannot be longer than 100 characters'
    }),
  description: Joi.string().trim().max(500)
    .messages({
      'string.max': 'Description cannot be longer than 500 characters'
    }),
  assignee: Joi.string().trim().max(50)
    .messages({
      'string.max': 'Assignee name cannot be longer than 50 characters'
    }),
  dueDate: Joi.date().required()
    .messages({
      'date.base': 'Please provide a valid due date',
      'any.required': 'Due date is required'
    }),
  priority: Joi.string().valid('P1', 'P2', 'P3', 'P4').default('P3'),
  status: Joi.string().valid('Todo', 'In Progress', 'Done').default('Todo')
});

export const updateTaskSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100),
  description: Joi.string().trim().max(500),
  assignee: Joi.string().trim().max(50),
  dueDate: Joi.date(),
  priority: Joi.string().valid('P1', 'P2', 'P3', 'P4'),
  status: Joi.string().valid('Todo', 'In Progress', 'Done')
}).min(1);
