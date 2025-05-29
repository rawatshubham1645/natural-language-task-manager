import Task from './task.schema.js';
import NotFoundError from '../../utils/CustomError.js';

export default class TaskRepository {
  constructor() {
    this.Task = Task;
  }

  async createTask(taskData) {
    const task = await this.Task.create(taskData);
    return task;
  }

  async getTasks(userId, filters = {}) {
    const { status, priority, sortBy } = filters;
    
    const query = { createdBy: userId };
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }

    let sortOptions = { dueDate: 1 }; // Default sort by due date ascending
    
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      const sortOrder = order === 'desc' ? -1 : 1;
      sortOptions = { [field]: sortOrder };
    }

    const tasks = await this.Task.find(query).sort(sortOptions);
    return tasks;
  }

  async getTaskById(taskId, userId) {
    const task = await this.Task.findOne({ _id: taskId, createdBy: userId });
    
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    
    return task;
  }

  async updateTask(taskId, userId, updateData) {
    const task = await this.Task.findOneAndUpdate(
      { _id: taskId, createdBy: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new NotFoundError('Task not found or not authorized');
    }

    return task;
  }

  async deleteTask(taskId, userId) {
    const task = await this.Task.findOneAndDelete({ _id: taskId, createdBy: userId });
    
    if (!task) {
      throw new NotFoundError('Task not found or not authorized');
    }
    
    return task;
  }

  async parseNaturalLanguage(text) {
    const { parse, format, addDays, isToday, isTomorrow, isThisWeek, nextDay, parseISO } = await import('date-fns');
    
    const result = {
      name: '',
      assignee: null,
      dueDate: null,
      priority: 'P3',
    };

    // Convert to lowercase for case-insensitive matching
    const lowerText = text.toLowerCase();
    
    // 1. Extract priority (P1, P2, P3, P4)
    const priorityMatch = lowerText.match(/\b(p[1-4])\b/);
    if (priorityMatch) {
      result.priority = priorityMatch[1].toUpperCase();
      text = text.replace(new RegExp(priorityMatch[0], 'i'), '').trim();
    }

    // 2. Extract assignee (name after "to" or "for" or before "by")
    const assigneePatterns = [
      /(?:to|for)\s+([a-z]+)(?:\s|$)/i,           // "to John" or "for John"
      /([a-z]+)(?:\s+(?:by|at|on|before|due))?\s+/i, // "John by" or "John at"
    ];


    for (const pattern of assigneePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        // Skip common words that might be mistaken for names
        const commonWords = ['me', 'you', 'us', 'them', 'today', 'tomorrow', 'next'];
        if (!commonWords.includes(match[1].toLowerCase())) {
          result.assignee = match[1].charAt(0).toUpperCase() + match[1].slice(1);
          text = text.replace(match[0], '').trim();
          break;
        }
      }
    }

    // 3. Extract and parse dates
    const datePatterns = [
      // Today/tomorrow
      { pattern: /(today|tonight)\b/i, handler: () => new Date() },
      { pattern: /tomorrow\b/i, handler: () => addDays(new Date(), 1) },
      
      // Days of the week
      { pattern: /(mon|monday)\b/i, handler: () => nextDay(new Date(), 1) },
      { pattern: /(tue|tuesday)\b/i, handler: () => nextDay(new Date(), 2) },
      { pattern: /(wed|wednesday)\b/i, handler: () => nextDay(new Date(), 3) },
      { pattern: /(thu|thursday)\b/i, handler: () => nextDay(new Date(), 4) },
      { pattern: /(fri|friday)\b/i, handler: () => nextDay(new Date(), 5) },
      { pattern: /(sat|saturday)\b/i, handler: () => nextDay(new Date(), 6) },
      { pattern: /(sun|sunday)\b/i, handler: () => nextDay(new Date(), 0) },
      
      // Relative days
      { pattern: /next\s+week\b/i, handler: () => addDays(new Date(), 7) },
      
      // Specific dates (MM/DD/YYYY, DD-MM-YYYY, etc.)
      { 
        pattern: /(\d{1,2}[\/\-\.]\d{1,2}(?:[\/\-\.]\d{2,4})?)/,
        handler: (match) => {
          try {
            // Try parsing various date formats
            const formats = ['MM/dd/yyyy', 'dd-MM-yyyy', 'MM.dd.yyyy', 'yyyy-MM-dd'];
            for (const fmt of formats) {
              try {
                return parse(match[1], fmt, new Date());
              } catch (e) { /* Try next format */ }
            }
            return null;
          } catch (e) {
            return null;
          }
        }
      },
      
      // Time patterns
      { 
        pattern: /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i, 
        handler: (match) => {
          const now = new Date();
          let hours = parseInt(match[1]);
          const minutes = match[2] ? parseInt(match[2]) : 0;
          const period = match[3] ? match[3].toLowerCase() : null;
          
          // Convert to 24-hour format
          if (period === 'pm' && hours < 12) hours += 12;
          if (period === 'am' && hours === 12) hours = 0;
          
          now.setHours(hours, minutes, 0, 0);
          return now;
        }
      }
    ];

    // Apply date patterns
    for (const { pattern, handler } of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        const date = handler(match);
        if (date && !isNaN(date)) {
          result.dueDate = date;
          // Remove the matched date string from the text
          text = text.replace(match[0], '').trim();
          // If we found a date, don't look for more
          break;
        }
      }
    }

    // If no specific date found but we have "today" or "tomorrow" in the text
    if (!result.dueDate) {
      if (text.toLowerCase().includes('today')) {
        result.dueDate = new Date();
        text = text.replace(/today/gi, '').trim();
      } else if (text.toLowerCase().includes('tomorrow')) {
        result.dueDate = addDays(new Date(), 1);
        text = text.replace(/tomorrow/gi, '').trim();
      }
    }

    // Default to end of today if no date specified
    if (!result.dueDate) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      result.dueDate = today;
    }

    // Clean up the remaining text for the task name
    // Remove any remaining date/time related words
    const dateTimeWords = [
      'at', 'by', 'on', 'before', 'after', 'due', 'tonight',
      'morning', 'afternoon', 'evening', 'night', 'noon', 'midnight'
    ];
    
    result.name = text
      .split(' ')
      .filter(word => {
        const lowerWord = word.toLowerCase();
        return !dateTimeWords.includes(lowerWord) && 
               !/^\d{1,2}:?\d{0,2}\s*(?:am|pm)?$/i.test(lowerWord);
      })
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/^\s*[,\-]\s*|\s*[,\-]\s*$/g, '')
      .trim();

    // If we have an assignee but no name, use the first part of the text as the name
    if (result.assignee && !result.name) {
      result.name = text.split(' ')[0];
    }

    // If we still don't have a name, use a default
    if (!result.name) {
      result.name = 'New Task';
    }

    return result;
  }


}
