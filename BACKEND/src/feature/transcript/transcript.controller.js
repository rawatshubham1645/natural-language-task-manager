import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import TaskRepository from '../task/task.repository.js';

class TranscriptController {
  constructor() {
    this.taskRepository = new TaskRepository();
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async parseTranscript(req, res, next) {
    try {
      const { transcript } = req.body;
      
      if (!transcript || transcript.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Transcript is required'
        });
      }

      // Process the transcript with Gemini API
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
        Extract tasks from the following meeting transcript. For each task, identify:
        1. Task description
        2. Assignee (person responsible)
        3. Deadline (date and/or time)
        4. Priority (default to P3 if not specified)

        Format the response as a JSON array of task objects with the following properties:
        - name: The task description
        - assignee: The person assigned to the task
        - dueDate: The deadline in ISO format if possible, or a descriptive string
        - priority: P1, P2, P3, or P4

        Transcript:
        ${transcript}

        Only return the JSON array, nothing else.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      let tasks = [];
      try {
        // Find JSON in the text (it might be surrounded by markdown code blocks or other text)
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          tasks = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in the response');
        }
      } catch (error) {
        console.error('Error parsing AI response:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to parse AI response'
        });
      }

      // Process and enhance the tasks with proper date formatting
      const processedTasks = [];
      
      for (const task of tasks) {
        // Process the due date if it's a string
        if (typeof task.dueDate === 'string' && !task.dueDate.match(/^\d{4}-\d{2}-\d{2}/)) {
          try {
            // Let the natural language parser handle the date
            const parsedTask = await this.taskRepository.parseNaturalLanguage(
              `${task.name} by ${task.dueDate} ${task.priority || 'P3'}`
            );
            task.dueDate = parsedTask.dueDate;
          } catch (error) {
            console.error('Error parsing date:', error);
            // Keep the original string if parsing fails
          }
        }

        // Prepare the task data
        const taskData = {
          name: task.name,
          description: task.description || '',
          assignee: task.assignee,
          dueDate: task.dueDate,
          priority: task.priority || 'P3',
          status: 'Todo'
        };

        processedTasks.push(taskData);
      }

      res.status(200).json({
        success: true,
        message: `Successfully extracted ${processedTasks.length} tasks`,
        data: processedTasks
      });
    } catch (error) {
      console.error('Error processing transcript:', error);
      next(error);
    }
  }
}

export default TranscriptController;
