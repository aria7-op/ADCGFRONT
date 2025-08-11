import React, { useState } from 'react';

function FavoriteProjects() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Sample favorite projects data - Empty array to show "No Project Found!"
  const favoriteProjects = [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Needs Review': return 'bg-blue-500';
      case 'In Progress': return 'bg-green-500';
      case 'Completed': return 'bg-purple-500';
      case 'On Hold': return 'bg-yellow-500';
      case 'To Do': return 'bg-gray-500';
      case 'Planning': return 'bg-indigo-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="p-4 sm:p-4 lg:p-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 sm:p-4 lg:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Favorite Projects</h1>
            <div className="flex items-center space-x-4">
              {/* Create Project Button */}
              <button 
                onClick={() => setShowCreateModal(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <i className="fas fa-plus mr-2"></i>
                <span className="hidden sm:inline">Create Project</span>
                <span className="sm:hidden">Create</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {favoriteProjects.length === 0 ? (
          // No Projects Found State
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heart text-gray-400 text-2xl"></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">No Project Found!</h4>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center mx-auto"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Create Your First Project
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Projects Grid
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {favoriteProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">
                          <a href="#" className="hover:underline">{project.title}</a>
                        </h3>
                        <div className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${getStatusColor(project.status)}`}>
                          {project.status}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button className="text-yellow-500 hover:text-yellow-600 transition-colors">
                          <i className="fas fa-heart"></i>
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => {
                              setSelectedProject(project);
                              setShowEditModal(true);
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <i className="fas fa-cog"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Project Description */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Project Stats */}
                    <div className="flex items-center space-x-6 mb-4 text-sm">
                      <span className="flex items-center text-gray-600">
                        <i className="fas fa-tasks text-gray-400 mr-2"></i>
                        <span className="font-semibold">{project.tasks}</span>
                        <a href="#" className="text-blue-600 hover:underline ml-1">Tasks</a>
                      </span>
                      <span className="flex items-center text-gray-600">
                        <i className="fas fa-comments text-gray-400 mr-2"></i>
                        <span className="font-semibold">{project.comments}</span>
                        <a href="#" className="text-blue-600 hover:underline ml-1">Comments</a>
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <span className="flex items-center text-gray-600">
                        <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>
                        <span className="font-semibold">Start Date: </span>
                        <span className="text-blue-600 ml-1">{project.startDate}</span>
                      </span>
                      <span className="flex items-center text-gray-600">
                        <span className="font-semibold">End Date: </span>
                        <span className="text-blue-600 ml-1">{project.endDate}</span>
                      </span>
                    </div>

                    {/* Priority and Deadline */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Priority</span>
                        <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Days till Deadline</span>
                        <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                          project.deadlineMissed ? 'bg-red-500' : 'bg-green-500'
                        }`}>
                          {project.deadlineMissed ? `${project.daysUntilDeadline} Day(s) deadline missed` : `${project.daysUntilDeadline} Day(s) remaining`}
                        </span>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h6 className="text-sm font-semibold text-gray-700 mb-2">Clients</h6>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {project.client.initial}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h6 className="text-sm font-semibold text-gray-700 mb-2">Users</h6>
                        <div className="flex items-center space-x-2">
                          {project.users.map((user, index) => (
                            <div key={index} className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              {user.initial}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Details Button */}
                    <div className="flex justify-end">
                      <a href="#" className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
                        Details <i className="fas fa-chevron-right ml-1"></i>
                      </a>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="px-6 pb-6">
                    <h6 className="text-sm font-semibold text-gray-700 mb-2">Tasks Insights</h6>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      {Object.entries(project.progress).map(([status, percentage], index) => {
                        const getProgressColor = (status) => {
                          switch (status) {
                            case 'completed': return 'bg-green-500';
                            case 'testing': return 'bg-purple-500';
                            case 'inProgress': return 'bg-blue-500';
                            case 'pending': return 'bg-yellow-500';
                            case 'onHold': return 'bg-orange-500';
                            case 'delayed': return 'bg-red-500';
                            case 'waiting': return 'bg-gray-500';
                            case 'planning': return 'bg-indigo-500';
                            default: return 'bg-blue-500';
                          }
                        };
                        
                        return (
                          <div
                            key={status}
                            className={`h-full ${getProgressColor(status)} inline-block`}
                            style={{ width: `${percentage}%` }}
                            title={`${status} (${percentage}%)`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Create New Project</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project title"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Choose Status</option>
                    <option value="waiting">Waiting for Approval</option>
                    <option value="todo">To Do</option>
                    <option value="planning">Planning</option>
                    <option value="onhold">On Hold</option>
                    <option value="review">Needs Review</option>
                    <option value="progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Priority</option>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Budget</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input 
                    type="number" 
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter budget"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter project description"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Project</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProject(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title</label>
                <input 
                  type="text" 
                  defaultValue={selectedProject.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select 
                    defaultValue={selectedProject.status.toLowerCase().replace(' ', '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="waiting">Waiting for Approval</option>
                    <option value="todo">To Do</option>
                    <option value="planning">Planning</option>
                    <option value="onhold">On Hold</option>
                    <option value="review">Needs Review</option>
                    <option value="progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select 
                    defaultValue={selectedProject.priority}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input 
                    type="date" 
                    defaultValue={selectedProject.startDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input 
                    type="date" 
                    defaultValue={selectedProject.endDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                  defaultValue={selectedProject.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FavoriteProjects; 