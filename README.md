# Natural Language Task Manager

A modern task management application with natural language processing capabilities and AI-powered meeting minutes parsing.

## Features

- **Natural Language Task Creation**: Create tasks using natural language input
- **AI Meeting Minutes Parser**: Extract tasks from meeting transcripts automatically
- **Task Management**: Create, view, edit, and delete tasks
- **Priority Levels**: Assign P1-P4 priority levels to tasks
- **Status Tracking**: Track task status (Todo, In Progress, Done)
- **Due Dates**: Set and manage task deadlines
- **Assignees**: Assign tasks to team members

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Google Gemini AI API

### Frontend
- React
- Tailwind CSS
- React Router
- Context API for state management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas connection)
- Google Gemini API key

## Installation

### Clone the repository

```bash
git clone <your-repository-url>
cd natural-lang
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd BACKEND
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the BACKEND directory with the following variables:
```
PORT=8000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

4. Start the backend server:
```bash
npm start
```

The backend server will run on http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd FRONTEND
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the FRONTEND directory with the following variables:
```
VITE_BACKEND_URL=http://localhost:8000
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173 (or another port if 5173 is in use)

## Usage

### Task Management

1. **Create a Task**: Click "Add New Task" and fill out the form or use natural language input
2. **View Tasks**: All tasks are displayed in the main dashboard
3. **Edit a Task**: Click the "Edit" button on any task card
4. **Delete a Task**: Click the "Delete" button on any task card
5. **Change Status**: Use the dropdown on any task card to change its status

### AI Meeting Minutes Parser

1. Click on the "AI Meeting Minutes Parser" section
2. Paste your meeting transcript in the text area
3. Click "Extract Tasks" to process the transcript
4. Review and edit the extracted tasks
5. Click "Create All Tasks" to add them to your task list

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `POST /api/tasks/batch` - Create multiple tasks
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Transcript Parsing

- `POST /api/transcripts/parse` - Parse meeting transcript and extract tasks

## Environment Variables

### Backend

- `PORT` - Port for the backend server (default: 8000)
- `DB_URL` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT authentication
- `GEMINI_API_KEY` - Google Gemini API key for AI features

### Frontend

- `VITE_BACKEND_URL` - URL for the backend API (default: http://localhost:8000)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Google Gemini AI for natural language processing
- MongoDB Atlas for database hosting
- React and Tailwind CSS for the frontend UI
