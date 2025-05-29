import React, { useState } from 'react';
import useMutation from '../../hooks/useMutation';
import { format } from 'date-fns';

const TranscriptParser = ({ onTasksCreated }) => {
  const [transcript, setTranscript] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState([]);
  const [showExtractedTasks, setShowExtractedTasks] = useState(false);
  const { mutate: parseTranscript, loading: parseLoading } = useMutation();
  const { mutate: createTasks, loading: createLoading } = useMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!transcript.trim()) return;
    
    try {
      const response = await parseTranscript({
        url: 'api/transcripts/parse',
        method: 'POST',
        data: { transcript }
      });
      
      console.log('Full response:', response);
      
      // The response structure can vary depending on how apiHandler returns data
      // It could be response.data.data, response.data, or just response
      let extractedTasksData = [];
      
      if (response && response.data && Array.isArray(response.data)) {
        extractedTasksData = response.data;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        extractedTasksData = response.data.data;
      } else if (Array.isArray(response)) {
        extractedTasksData = response;
      }
      
      console.log('Extracted tasks data:', extractedTasksData);
      
      if (extractedTasksData.length > 0) {
        setExtractedTasks(extractedTasksData);
        setShowExtractedTasks(true);
      } else {
        console.error('No tasks were extracted or invalid response format');
        alert('No tasks could be extracted from the transcript. Please try a different transcript or format.');
      }
    } catch (error) {
      console.error('Error parsing transcript:', error);
      alert('An error occurred while parsing the transcript. Please try again.');
    }
  };
  
  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...extractedTasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setExtractedTasks(updatedTasks);
  };
  
  const handleCreateTasks = async () => {
    if (!extractedTasks || extractedTasks.length === 0) {
      alert('No tasks to create. Please extract tasks first.');
      return;
    }
    
    try {
      console.log('Creating tasks:', extractedTasks);
      
      const response = await createTasks({
        url: 'api/tasks/batch',
        method: 'POST',
        data: { tasks: extractedTasks }
      });
      
      console.log('Create tasks response:', response);
      
      // Check if the response indicates success
      if (response && (response.success || response.status === 201)) {
        // Clear the form and extracted tasks
        setTranscript('');
        setExtractedTasks([]);
        setShowExtractedTasks(false);
        setIsExpanded(false);
        
        // Notify parent component that tasks were created
        if (onTasksCreated) {
          onTasksCreated();
        }
        
        // Show success message
        alert('Tasks created successfully!');
      } else {
        console.error('Failed to create tasks:', response);
        alert('Failed to create tasks. Please try again.');
      }
    } catch (error) {
      console.error('Error creating tasks:', error);
      alert('An error occurred while creating tasks. Please try again.');
    }
  };
  
  const handleRemoveTask = (index) => {
    const updatedTasks = [...extractedTasks];
    updatedTasks.splice(index, 1);
    setExtractedTasks(updatedTasks);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
      <div 
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => !showExtractedTasks && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 text-blue-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">
            AI Meeting Minutes Parser
          </h3>
        </div>
        {!showExtractedTasks && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
      
      {isExpanded && !showExtractedTasks && (
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paste meeting transcript
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Example: Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={5}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                The AI will extract tasks, assignees, and deadlines from the transcript.
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={parseLoading || !transcript.trim()}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {parseLoading ? 'Processing...' : 'Extract Tasks'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {showExtractedTasks && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Review Extracted Tasks</h3>
          
          {extractedTasks.length === 0 ? (
            <p className="text-gray-500">No tasks were extracted. Try a different transcript.</p>
          ) : (
            <div className="space-y-6">
              {extractedTasks.map((task, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">Task {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Name *
                      </label>
                      <input
                        type="text"
                        value={task.name}
                        onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assignee
                      </label>
                      <input
                        type="text"
                        value={task.assignee || ''}
                        onChange={(e) => handleTaskChange(index, 'assignee', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="datetime-local"
                        value={task.dueDate ? task.dueDate.substring(0, 16) : ''}
                        onChange={(e) => handleTaskChange(index, 'dueDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={task.priority || 'P3'}
                        onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="P1">P1 - High</option>
                        <option value="P2">P2 - Medium-High</option>
                        <option value="P3">P3 - Medium</option>
                        <option value="P4">P4 - Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setShowExtractedTasks(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateTasks}
                  disabled={createLoading || extractedTasks.length === 0}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create All Tasks'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TranscriptParser;
