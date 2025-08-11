import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';

function Task() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced stores integration
  const { 
    tasks, 
    filteredTasks, 
    isLoading: taskLoading, 
    error: taskError,
    loadTasks, 
    createTask, 
    updateTask, 
    deleteTask,
    setFilter,
    initializeRealTimeUpdates,
    cleanup
  } = useTaskStore();

  const { user, hasPermission } = useAuthStore();
  const { sendNotification } = useNotificationStore();

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
    initializeRealTimeUpdates();

    // Cleanup on unmount
    return () => cleanup();
  }, [loadTasks, initializeRealTimeUpdates, cleanup]);

  // Enhanced status colors with more statuses
  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Waiting for Approval':
        return 'bg-orange-100 text-orange-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Delayed':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Enhanced task creation with microservices
  const handleCreateTask = async (newTask) => {
    if (!hasPermission('task:create')) {
      alert('You do not have permission to create tasks');
      return;
    }

    setIsLoading(true);
    try {
      const taskData = {
        title: newTask.task,
        description: newTask.description || '',
        project: newTask.project,
        assigneeId: newTask.assigneeId || user.id,
        priority: newTask.priority || 'medium',
        status: newTask.status || 'Planning',
        dueDate: newTask.dueDate || null,
        tags: newTask.tags || [],
        estimatedHours: newTask.estimatedHours || 0
      };

      const result = await createTask(taskData);
      
      if (result.success) {
        // Send notification
        await sendNotification({
          userId: taskData.assigneeId,
          title: 'New Task Assigned',
          message: `You have been assigned a new task: ${taskData.title}`,
          type: 'task',
          priority: 'medium'
        });

        setShowCreateModal(false);
        // Reload tasks
        await loadTasks();
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced task editing
  const handleEditTask = async (taskId, updates) => {
    if (!hasPermission('task:update')) {
      alert('You do not have permission to update tasks');
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateTask(taskId, updates);
      
      if (result.success) {
        setShowEditModal(false);
        setEditingTask(null);
        await loadTasks();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced task deletion
  const handleDeleteTask = async (taskId) => {
    if (!hasPermission('task:delete')) {
      alert('You do not have permission to delete tasks');
      return;
    }

    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteTask(taskId);
      
      if (result.success) {
        await loadTasks();
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced filtering
  const handleFilter = () => {
    const filters = {};
    if (selectedStatus) filters.status = selectedStatus;
    if (selectedProject) filters.project = selectedProject;
    if (selectedUser) filters.assigneeId = selectedUser;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    
    loadTasks(filters);
  };

  // Enhanced search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setFilter('search', value);
  };

  // Open edit modal
  const openEditModal = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  // Get filtered tasks (combine store filters with local search)
  const displayTasks = filteredTasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tasks</h1>
          {hasPermission('task:create') && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              disabled={isLoading}
            >
              <span className="hidden sm:inline">Create Task</span>
              <span className="sm:hidden">Create</span>
            </button>
          )}
        </div>
        
        {/* Error display */}
        {taskError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {taskError}
          </div>
        )}
      </div>

      {/* Filtering Section */}
      <div className="bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for Approval">Waiting for Approval</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tasks Due Dates Between</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Clients</option>
              <option value="et">ET</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Users</option>
              <option value="mc">MC</option>
              <option value="et">ET</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleFilter}
              className="w-full bg-blue-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              disabled={isLoading}
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <button 
              onClick={() => loadTasks()}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={taskLoading}
            >
              <i className="fas fa-sync-alt text-sm sm:text-base"></i>
            </button>
            <button className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="fas fa-list text-sm sm:text-base"></i>
            </button>
            <button className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="fas fa-filter text-sm sm:text-base"></i>
            </button>
            <button className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="fas fa-download text-sm sm:text-base"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks <i className="fas fa-sort ml-1"></i>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project <i className="fas fa-sort ml-1"></i>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee <i className="fas fa-sort ml-1"></i>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority <i className="fas fa-sort ml-1"></i>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status <i className="fas fa-sort ml-1"></i>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date <i className="fas fa-sort ml-1"></i>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {taskLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading tasks...</span>
                    </div>
                  </td>
                </tr>
              ) : displayTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No tasks found
                  </td>
                </tr>
              ) : (
                displayTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-xs text-gray-500 mt-1">
                          {task.description.substring(0, 50)}...
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                        {task.project}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {task.assignee?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="ml-2 text-sm text-gray-900">
                          {task.assignee?.name || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openEditModal(task)}
                          className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors"
                          title="Edit Task"
                        >
                          <i className="fas fa-edit text-blue-600"></i>
                        </button>
                        {hasPermission('task:delete') && (
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center hover:bg-red-300 transition-colors"
                            title="Delete Task"
                          >
                            <i className="fas fa-trash text-red-600"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleCreateTask({
                  task: formData.get('task'),
                  description: formData.get('description'),
                  project: formData.get('project'),
                  assigneeId: formData.get('assigneeId'),
                  priority: formData.get('priority'),
                  status: formData.get('status'),
                  dueDate: formData.get('dueDate'),
                  estimatedHours: formData.get('estimatedHours')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Task Title</label>
                    <input
                      type="text"
                      name="task"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project</label>
                    <select
                      name="project"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Project</option>
                      <option value="Customer Satisfaction Improvement Initiative">Customer Satisfaction Improvement Initiative</option>
                      <option value="Website Redesign">Website Redesign</option>
                      <option value="New Product Development">New Product Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assignee</label>
                    <select
                      name="assigneeId"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Assignee</option>
                      <option value="1">MC</option>
                      <option value="2">ET</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      name="priority"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting for Approval">Waiting for Approval</option>
                      <option value="Completed">Completed</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Hours</label>
                    <input
                      type="number"
                      name="estimatedHours"
                      min="0"
                      step="0.5"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <div className="fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Task</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleEditTask(editingTask.id, {
                  title: formData.get('task'),
                  description: formData.get('description'),
                  project: formData.get('project'),
                  assigneeId: formData.get('assigneeId'),
                  priority: formData.get('priority'),
                  status: formData.get('status'),
                  dueDate: formData.get('dueDate'),
                  estimatedHours: formData.get('estimatedHours')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Task Title</label>
                    <input
                      type="text"
                      name="task"
                      defaultValue={editingTask.title}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingTask.description}
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project</label>
                    <select
                      name="project"
                      defaultValue={editingTask.project}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Customer Satisfaction Improvement Initiative">Customer Satisfaction Improvement Initiative</option>
                      <option value="Website Redesign">Website Redesign</option>
                      <option value="New Product Development">New Product Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assignee</label>
                    <select
                      name="assigneeId"
                      defaultValue={editingTask.assigneeId}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="1">MC</option>
                      <option value="2">ET</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      name="priority"
                      defaultValue={editingTask.priority}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      defaultValue={editingTask.status}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting for Approval">Waiting for Approval</option>
                      <option value="Completed">Completed</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      defaultValue={editingTask.dueDate ? editingTask.dueDate.split('T')[0] : ''}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Hours</label>
                    <input
                      type="number"
                      name="estimatedHours"
                      defaultValue={editingTask.estimatedHours}
                      min="0"
                      step="0.5"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingTask(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Task; 