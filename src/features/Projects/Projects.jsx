import React, { useState } from 'react';

function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest-desc');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "Customer Satisfaction Improvement Initiative",
      description: "Implement strategies to enhance customer satisfaction and loyalty.",
      status: "Needs Review",
      priority: "medium",
      startDate: "15-Nov-2024",
      endDate: "31-May-2025",
      tasks: 2,
      comments: 7,
      progress: {
        delayed: 33,
        onHold: 17,
        pending: 17,
        testing: 17,
        waiting: 17
      },
      client: { name: "Emily", initial: "ET" },
      users: [
        { name: "Main", initial: "MA" },
        { name: "John", initial: "JS" },
        { name: "Brandon", initial: "BL" }
      ],
      isFavorite: false,
      daysUntilDeadline: 63,
      deadlineMissed: true
    },
    {
      id: 2,
      title: "Website Redesign Project",
      description: "Complete redesign of company website with modern UI/UX.",
      status: "In Progress",
      priority: "high",
      startDate: "01-Dec-2024",
      endDate: "28-Feb-2025",
      tasks: 5,
      comments: 12,
      progress: {
        completed: 50,
        delayed: 25,
        pending: 25
      },
      client: { name: "Sarah", initial: "SM" },
      users: [
        { name: "Main", initial: "MA" },
        { name: "John", initial: "JS" }
      ],
      isFavorite: true,
      daysUntilDeadline: 45,
      deadlineMissed: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Needs Review': return 'bg-blue-500';
      case 'In Progress': return 'bg-green-500';
      case 'Completed': return 'bg-purple-500';
      case 'On Hold': return 'bg-yellow-500';
      case 'To Do': return 'bg-gray-500';
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
    <div className="p-0 sm:p-4 lg:p-6">
             {/* Header Section */}
       <div className="bg-white rounded-lg shadow-sm mb-6">
         <div className="p-4 sm:p-4 lg:p-6 border-b border-gray-100">
           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
             <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Projects</h1>
             <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                             {/* View Toggle */}
               <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
                 <button 
                   onClick={() => setViewMode('grid')}
                   className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-colors ${
                     viewMode === 'grid' 
                       ? 'bg-blue-500 text-white' 
                       : 'text-gray-600 hover:text-gray-800'
                   }`}
                 >
                   <i className="fas fa-th-large mr-1 sm:mr-2"></i>
                   <span className="hidden sm:inline">Grid View</span>
                   <span className="sm:hidden">Grid</span>
                 </button>
                 <button 
                   onClick={() => setViewMode('list')}
                   className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-colors ${
                     viewMode === 'list' 
                       ? 'bg-blue-500 text-white' 
                       : 'text-gray-600 hover:text-gray-800'
                   }`}
                 >
                   <i className="fas fa-list mr-1 sm:mr-2"></i>
                   <span className="hidden sm:inline">List View</span>
                   <span className="sm:hidden">List</span>
                 </button>
               </div>
              
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

             {/* Filters and Stats */}
       <div className="bg-white rounded-lg shadow-sm mb-6">
         <div className="p-4 sm:p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-4">
            <div className="text-sm text-gray-600">
              Showing 1 to {projects.length} Projects From {projects.length}
            </div>
            
                         {/* Status Filters */}
             <div className="flex flex-wrap gap-2">
               <button 
                 onClick={() => setActiveFilter('All')}
                 className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                   activeFilter === 'All' 
                     ? 'bg-blue-500 text-white' 
                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                 }`}
               >
                 All
               </button>
               <button 
                 onClick={() => setActiveFilter('Waiting for Approval')}
                 className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                   activeFilter === 'Waiting for Approval' 
                     ? 'bg-blue-500 text-white' 
                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                 }`}
               >
                 <span className="hidden sm:inline">Waiting for Approval</span>
                 <span className="sm:hidden">Waiting</span>
               </button>
               <button 
                 onClick={() => setActiveFilter('To Do')}
                 className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                   activeFilter === 'To Do' 
                     ? 'bg-blue-500 text-white' 
                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                 }`}
               >
                 To Do
               </button>
               <button 
                 onClick={() => setActiveFilter('Planning')}
                 className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                   activeFilter === 'Planning' 
                     ? 'bg-blue-500 text-white' 
                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                 }`}
               >
                 Planning
               </button>
               <button 
                 onClick={() => setActiveFilter('On Hold')}
                 className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                   activeFilter === 'On Hold' 
                     ? 'bg-blue-500 text-white' 
                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                 }`}
               >
                 On Hold
               </button>
               <button 
                 onClick={() => setActiveFilter('Needs Review')}
                 className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                   activeFilter === 'Needs Review' 
                     ? 'bg-blue-500 text-white' 
                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                 }`}
               >
                 <span className="hidden sm:inline">Needs Review</span>
                 <span className="sm:hidden">Review</span>
               </button>
               <button 
                 onClick={() => setActiveFilter('In Progress')}
                 className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                   activeFilter === 'In Progress' 
                     ? 'bg-blue-500 text-white' 
                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                 }`}
               >
                 <span className="hidden sm:inline">In Progress</span>
                 <span className="sm:hidden">Progress</span>
               </button>
               <button 
                 onClick={() => setActiveFilter('Completed')}
                 className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                   activeFilter === 'Completed' 
                     ? 'bg-blue-500 text-white' 
                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                 }`}
               >
                 Completed
               </button>
             </div>
          </div>
          
                     {/* Sort Dropdown */}
           <div className="flex justify-end">
             <select 
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value)}
               className="px-4 sm:px-5 py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
             >
               <option value="newest-desc">Newest First</option>
               <option value="oldest-asc">Oldest First</option>
               <option value="recently-asc">Most Recently Update</option>
               <option value="recently-desc">Least Recently Update</option>
             </select>
           </div>
        </div>
      </div>

             {/* Projects Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 px-4 sm:px-0">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
                  <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                    <i className={`far fa-star ${project.isFavorite ? 'text-yellow-500' : ''}`}></i>
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
                 <a href="#" className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center">
                   <span className="hidden sm:inline">Details</span>
                   <span className="sm:hidden">View</span>
                   <i className="fas fa-chevron-right ml-1 sm:ml-2"></i>
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

             {/* Additional Cards Section */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 px-4 sm:px-0">
        {/* Project Statistics Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Project Statistics</h3>
            <i className="fas fa-chart-bar text-blue-500 text-xl"></i>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Projects</span>
              <span className="text-lg font-bold text-blue-600">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Projects</span>
              <span className="text-lg font-bold text-green-600">18</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-lg font-bold text-purple-600">6</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">On Hold</span>
              <span className="text-lg font-bold text-yellow-600">3</span>
            </div>
          </div>
        </div>

        {/* Recent Activities Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
            <i className="fas fa-clock text-orange-500 text-xl"></i>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">New project "Website Redesign" created</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">Project "Mobile App" status updated</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">Task completed in "E-commerce" project</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">New team member added to "CRM" project</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Performance Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Team Performance</h3>
            <i className="fas fa-users text-green-500 text-xl"></i>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  MA
                </div>
                <span className="text-sm text-gray-700">Main Admin</span>
              </div>
              <span className="text-sm font-semibold text-green-600">95%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  JS
                </div>
                <span className="text-sm text-gray-700">John Smith</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">87%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  BL
                </div>
                <span className="text-sm text-gray-700">Brandon Lee</span>
              </div>
              <span className="text-sm font-semibold text-yellow-600">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  SM
                </div>
                <span className="text-sm text-gray-700">Sarah Miller</span>
              </div>
              <span className="text-sm font-semibold text-red-600">65%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-600 text-center sm:text-left">
            Showing 1 to 10 of 24 results
          </div>
                     <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2">
             <button className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
               <i className="fas fa-chevron-left"></i>
             </button>
             <button className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm bg-blue-500 text-white border border-blue-500 rounded-lg">
               1
             </button>
             <button className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
               2
             </button>
             <button className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
               3
             </button>
             <span className="px-2 sm:px-3 text-xs sm:text-sm text-gray-500">...</span>
             <button className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
               10
             </button>
             <button className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
               <i className="fas fa-chevron-right"></i>
             </button>
           </div>
        </div>
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
              
                             <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                 <button 
                   type="button"
                   onClick={() => setShowCreateModal(false)}
                   className="w-full sm:w-auto px-5 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="w-full sm:w-auto px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
              
                             <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                 <button 
                   type="button"
                   onClick={() => {
                     setShowEditModal(false);
                     setSelectedProject(null);
                   }}
                   className="w-full sm:w-auto px-5 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="w-full sm:w-auto px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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

export default Projects; 