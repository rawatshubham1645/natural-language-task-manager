import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { format } from 'date-fns';

const TaskList = ({ tasks = [], onEdit, onDelete, onStatusChange, loading = false }) => {
  const [filter, setFilter] = useState({
    status: '',
    priority: '',
    sortBy: 'dueDate:asc'
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters and sorting
  // console.log(tasks);
  const filteredTasks = tasks
  console.log(filteredTasks);

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const [field, order] = filter.sortBy.split(':');
    const multiplier = order === 'desc' ? -1 : 1;

    if (field === 'dueDate') {
      return multiplier * (new Date(a.dueDate) - new Date(b.dueDate));
    }
    
    if (field === 'priority') {
      // P1 is highest, P4 is lowest
      const priorityValues = { P1: 4, P2: 3, P3: 2, P4: 1 };
      return multiplier * (priorityValues[a.priority] - priorityValues[b.priority]);
    }
    
    if (field === 'name') {
      return multiplier * a.name.localeCompare(b.name);
    }
    
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={filter.priority}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="P1">P1 - High</option>
              <option value="P2">P2 - Medium-High</option>
              <option value="P3">P3 - Medium</option>
              <option value="P4">P4 - Low</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              name="sortBy"
              value={filter.sortBy}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="dueDate:asc">Due Date (Earliest First)</option>
              <option value="dueDate:desc">Due Date (Latest First)</option>
              <option value="priority:desc">Priority (Highest First)</option>
              <option value="priority:asc">Priority (Lowest First)</option>
              <option value="name:asc">Name (A-Z)</option>
              <option value="name:desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Tasks ({sortedTasks.length})
          </h2>
          <div className="text-sm text-gray-500">
            {loading ? 'Loading...' : `Showing ${sortedTasks.length} of ${tasks.length} tasks`}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              {tasks.length === 0 
                ? 'No tasks found. Create your first task!' 
                : 'No tasks match your filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
