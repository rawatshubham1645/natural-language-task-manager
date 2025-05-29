# Natural Language Task Manager - Product Requirements Document (PRD)

## 1. Overview
A web application that allows users to create and manage tasks using natural language input, making task management more intuitive and efficient.

## 2. Objectives
- Simplify task creation through natural language processing
- Provide a clean, user-friendly interface for task management
- Support team collaboration through task assignment
- Enable efficient task prioritization and tracking

## 3. User Stories

### 3.1 Task Creation
- As a user, I want to add tasks using natural language so that I can quickly capture my thoughts
- Example: "Call client Rajeev tomorrow 5pm"

### 3.2 Task Management
- As a user, I want to view all my tasks in a clean, organized list/board
- As a user, I want to edit task details directly in the UI
- As a user, I want to mark tasks as complete

### 3.3 Task Assignment
- As a user, I want to assign tasks to team members
- As a user, I want to see tasks assigned to me

## 4. Functional Requirements

### 4.1 Natural Language Processing
- Parse natural language input to extract:
  - Task name/description
  - Assignee (if mentioned)
  - Due date and time
  - Priority level (default: P3)

### 4.2 Task Attributes
- Task ID (auto-generated)
- Task Name (required)
- Assignee (optional)
- Due Date/Time (required)
- Priority (P1, P2, P3, P4) - default: P3
- Status (Todo, In Progress, Done)
- Created At (timestamp)
- Updated At (timestamp)

### 4.3 User Interface
- Input field for natural language task entry
- Task list/board view with sorting and filtering options
- Task detail/edit modal
- Responsive design for mobile and desktop

## 5. Technical Requirements

### 5.1 Frontend
- Framework: React
- Styling: Tailwind CSS
- State Management: React Context or Redux
- Date Handling: date-fns
- Build Tool: Vite

### 5.2 Backend
- Runtime: Node.js with Express
- Database: MongoDB (with Mongoose)
- Date Parsing: chrono-node
- API: RESTful endpoints

### 5.3 API Endpoints
- `POST /api/tasks` - Create new task
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 6. Data Model

```typescript
interface Task {
  _id: string;
  name: string;
  description?: string;
  assignee?: string;
  dueDate: Date;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'Todo' | 'In Progress' | 'Done';
  createdAt: Date;
  updatedAt: Date;
}
```

## 7. Success Metrics
- Task creation time
- User engagement (tasks created per user)
- Task completion rate
- User satisfaction (via feedback)

## 8. Future Enhancements
- Recurring tasks
- Task categories/tags
- Due date reminders
- Task dependencies
- User authentication and authorization
- Team workspaces
- Task export/import

## 9. Out of Scope
- Real-time collaboration
- File attachments
- Time tracking
- Advanced reporting

## 10. Timeline
1. Week 1: Setup & Basic Task Creation
2. Week 2: Task Management & UI Polish
3. Week 3: Testing & Bug Fixes
4. Week 4: Deployment & Documentation

## 11. Dependencies
- Node.js v16+
- MongoDB
- npm/yarn

## 12. Open Questions
- Should we support task categories from the start?
- Do we need user authentication in the MVP?
- What's the expected scale of tasks per user?

## 13. Risks & Mitigation
- **NLP Accuracy**: Use well-tested libraries and provide clear input examples
- **Performance with Many Tasks**: Implement pagination and efficient queries
- **Browser Compatibility**: Test on major browsers and mobile devices
