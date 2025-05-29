import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import TasksPage from "./TasksPage";

function TaskRoutes() {
  return (
    <Routes>
      <Route path="" element={<TasksPage />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
}

export default TaskRoutes;
