import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const TaskForm = ({ initialData, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'P3',
    status: 'Todo',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    assignee: '',
    text: ''
  });
  // Always show both input methods, but track which one is active
  const [activeInput, setActiveInput] = useState('natural'); // 'natural' or 'structured'

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        priority: initialData.priority || 'P3',
        status: initialData.status || 'Todo',
        dueDate: initialData.dueDate 
          ? format(new Date(initialData.dueDate), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
        assignee: initialData.assignee || '',
        text: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = activeInput === 'natural'
      ? { text: formData.text }
      : {
          name: formData.name,
          description: formData.description,
          priority: formData.priority,
          status: formData.status,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
          assignee: formData.assignee || null
        };
    
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input Method Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          type="button"
          onClick={() => setActiveInput('natural')}
          className={`py-2 px-4 font-medium text-sm ${activeInput === 'natural' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Natural Language
        </button>
        <button
          type="button"
          onClick={() => setActiveInput('structured')}
          className={`py-2 px-4 font-medium text-sm ${activeInput === 'structured' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Structured Form
        </button>
      </div>

      {/* Natural Language Input - Always visible but conditionally required */}
      <div className={activeInput === 'natural' ? 'block' : 'hidden'}>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-800 mb-2">
            Enter your task in natural language
          </label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="e.g., Call John tomorrow at 2pm P2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            required={activeInput === 'natural'}
          />
          <p className="mt-2 text-sm text-gray-600">
            Examples:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>"Call John tomorrow at 2pm P2"</li>
              <li>"Review PR by EOD tomorrow P1"</li>
              <li>"Send email to team about meeting next Monday"</li>
            </ul>
          </p>
        </div>
      </div>

      {/* Structured Form - Always visible but conditionally required */}
      <div className={activeInput === 'structured' ? 'block' : 'hidden'}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required={activeInput === 'structured'}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="P1">P1 - High</option>
              <option value="P2">P2 - Medium-High</option>
              <option value="P3">P3 - Medium</option>
              <option value="P4">P4 - Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignee (optional)
            </label>
            <input
              type="text"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              placeholder="Name or email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
