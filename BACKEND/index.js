import express from "express";
import companyRouter from "./src/feature/company/company.route.js";
import taskRouter from "./src/feature/task/task.route.js";
import transcriptRouter from "./src/feature/transcript/transcript.route.js";
import cors from "cors";
import "dotenv/config";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use("/api/companies", companyRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/transcripts", transcriptRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log the error for debugging
  console.error(`[${new Date().toISOString()}] Error:`, err);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
});

export default app;
