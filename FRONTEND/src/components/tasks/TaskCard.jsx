import React from 'react';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';

const priorityColors = {
  P1: 'bg-red-100 text-red-800',
  P2: 'bg-orange-100 text-orange-800',
  P3: 'bg-blue-100 text-blue-800',
  P4: 'bg-gray-100 text-gray-800',
};

const statusColors = {
  'Todo': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Done': 'bg-green-100 text-green-800',
};

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const handleStatusChange = (e) => {
    onStatusChange(task._id, e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{task.name}</h3>
          {task.description && (
            <p className="mt-1 text-sm text-gray-600">{task.description}</p>
          )}
          <div className="mt-2 flex items-center space-x-2">
            <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
            <Badge className={statusColors[task.status]}>{task.status}</Badge>
          </div>
          {task.dueDate && (
            <div className="mt-2 text-sm text-gray-500">
              Due: {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}
            </div>
          )}
          {task.assignee && (
            <div className="mt-1 text-sm text-gray-500">
              Assignee: {task.assignee}
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="text-xs rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {Object.keys(statusColors).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
