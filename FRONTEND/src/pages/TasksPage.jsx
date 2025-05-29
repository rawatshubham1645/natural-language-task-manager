import React, { useState, useEffect } from 'react';
import useQuery from '../hooks/useQuery';
import useMutation from '../hooks/useMutation';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import TranscriptParser from '../components/tasks/TranscriptParser';
import Modal from '../components/ui/Modal';

const TasksPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Fetch tasks
  const { data: tasksData, loading: tasksLoading, error: tasksError, refetch: refetchTasks } = 
    useQuery('api/tasks', {skip: false});
  
  // Create task mutation
  const { mutate: createTask, loading: createLoading } = useMutation();
  
  // Update task mutation
  const { mutate: updateTask, loading: updateLoading } = useMutation();
  
  // Delete task mutation
  const { mutate: deleteTask, loading: deleteLoading } = useMutation();

  // Handle task creation
  const handleCreateTask = async (taskData) => {
    try {
      await createTask({
        url: 'api/tasks',
        method: 'POST',
        data: taskData
      });
      
      setShowForm(false);
      refetchTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // Handle task update
  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask({
        url: `api/tasks/${editingTask._id}`,
        method: 'PUT',
        data: taskData
      });
      
      setEditingTask(null);
      refetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask({
        url: `api/tasks/${taskId}`,
        method: 'DELETE'
      });
      
      refetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Handle task status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask({
        url: `api/tasks/${taskId}`,
        method: 'PUT',
        data: { status: newStatus }
      });
      
      refetchTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  // Handle edit button click
  const handleEditClick = (task) => {
    setEditingTask(task);
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Handle form submit
  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
        
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add New Task
        </button>
      </div>

      {/* Transcript Parser Component */}
      <TranscriptParser onTasksCreated={refetchTasks} />

      {/* Task Form Modal */}
      <Modal 
        isOpen={showForm || editingTask !== null} 
        onClose={handleFormCancel}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          initialData={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={createLoading || updateLoading}
        />
      </Modal>

      {tasksError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          Error loading tasks: {tasksError.message || 'Unknown error'}
        </div>
      )}

      <TaskList
        tasks={tasksData?.data?.data || []}
        loading={tasksLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default TasksPage;
