import React, { useState, useEffect, useRef } from 'react';

function TimeTracker() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [dateRange, setDateRange] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);

  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock data for time tracking entries
  const [timeEntries, setTimeEntries] = useState([
    {
      id: 1,
      username: 'administrator',
      email: 'admin@gmail.com',
      startTime: '05:35:03',
      endTime: '05:35:31',
      duration: '00:00:28',
      message: '',
      project: 'Customer Satisfaction Improvement Initiative',
      date: '2025-07-28'
    },
    {
      id: 2,
      username: 'administrator',
      email: 'admin@gmail.com',
      startTime: '06:39:54',
      endTime: '06:39:58',
      duration: '00:00:04',
      message: '',
      project: 'Product Packaging Redesign',
      date: '2025-07-25'
    },
    {
      id: 3,
      username: 'john_doe',
      email: 'john@example.com',
      startTime: '09:15:00',
      endTime: '11:30:00',
      duration: '02:15:00',
      message: 'Working on project documentation',
      project: 'New Product Development',
      date: '2025-07-28'
    },
    {
      id: 4,
      username: 'jane_smith',
      email: 'jane@example.com',
      startTime: '13:00:00',
      endTime: '17:00:00',
      duration: '04:00:00',
      message: 'Client meeting and follow-up',
      project: 'Customer Satisfaction Improvement Initiative',
      date: '2025-07-28'
    },
    {
      id: 5,
      username: 'mike_wilson',
      email: 'mike@example.com',
      startTime: '08:30:00',
      endTime: '12:00:00',
      duration: '03:30:00',
      message: 'Code review and testing',
      project: 'Supply Chain Optimization',
      date: '2025-07-27'
    },
    {
      id: 6,
      username: 'sarah_jones',
      email: 'sarah@example.com',
      startTime: '10:00:00',
      endTime: '16:00:00',
      duration: '06:00:00',
      message: 'Design workshop',
      project: 'Product Packaging Redesign',
      date: '2025-07-27'
    },
    {
      id: 7,
      username: 'david_brown',
      email: 'david@example.com',
      startTime: '14:00:00',
      endTime: '18:00:00',
      duration: '04:00:00',
      message: 'Team coordination',
      project: 'Employee Recognition Program',
      date: '2025-07-26'
    },
    {
      id: 8,
      username: 'lisa_garcia',
      email: 'lisa@example.com',
      startTime: '09:00:00',
      endTime: '13:00:00',
      duration: '04:00:00',
      message: 'Research and analysis',
      project: 'New Product Development',
      date: '2025-07-26'
    },
    {
      id: 9,
      username: 'tom_anderson',
      email: 'tom@example.com',
      startTime: '11:00:00',
      endTime: '15:00:00',
      duration: '04:00:00',
      message: 'Budget planning',
      project: 'Supply Chain Optimization',
      date: '2025-07-25'
    },
    {
      id: 10,
      username: 'emma_white',
      email: 'emma@example.com',
      startTime: '08:00:00',
      endTime: '12:00:00',
      duration: '04:00:00',
      message: 'Marketing strategy',
      project: 'Product Packaging Redesign',
      date: '2025-07-25'
    },
    {
      id: 11,
      username: 'alex_taylor',
      email: 'alex@example.com',
      startTime: '13:30:00',
      endTime: '17:30:00',
      duration: '04:00:00',
      message: 'Performance review',
      project: 'Employee Recognition Program',
      date: '2025-07-24'
    },
    {
      id: 12,
      username: 'rachel_martin',
      email: 'rachel@example.com',
      startTime: '10:30:00',
      endTime: '14:30:00',
      duration: '04:00:00',
      message: 'Quality assurance',
      project: 'Customer Satisfaction Improvement Initiative',
      date: '2025-07-24'
    }
  ]);

  const [newEntry, setNewEntry] = useState({
    username: '',
    startTime: '',
    endTime: '',
    message: '',
    project: '',
    date: ''
  });

  // Mock projects data
  const projects = [
    'Customer Satisfaction Improvement Initiative',
    'Product Packaging Redesign',
    'New Product Development',
    'Employee Recognition Program',
    'Supply Chain Optimization'
  ];

  // Calculate statistics
  const totalEntries = timeEntries.length;
  const todayEntries = timeEntries.filter(entry => entry.date === new Date().toISOString().split('T')[0]).length;
  const totalHours = timeEntries.reduce((sum, entry) => {
    const [hours, minutes, seconds] = entry.duration.split(':').map(Number);
    return sum + hours + minutes / 60 + seconds / 3600;
  }, 0);
  const averageHours = totalEntries > 0 ? (totalHours / totalEntries).toFixed(1) : 0;

  // Filter entries
  const filteredEntries = timeEntries.filter(entry => {
    const matchesSearch = entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === '' || entry.project === selectedProject;
    return matchesSearch && matchesProject;
  });

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddEntry = () => {
    if (newEntry.username && newEntry.startTime && newEntry.project) {
      const entry = {
        id: timeEntries.length + 1,
        ...newEntry,
        email: 'admin@gmail.com'
      };
      setTimeEntries([entry, ...timeEntries]);
      setNewEntry({ username: '', startTime: '', endTime: '', message: '', project: '', date: '' });
      setShowAddModal(false);
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setNewEntry({
      username: entry.username,
      startTime: entry.startTime,
      endTime: entry.endTime,
      message: entry.message,
      project: entry.project,
      date: entry.date
    });
    setShowAddModal(true);
  };

  const handleUpdateEntry = () => {
    if (editingEntry && newEntry.username && newEntry.startTime && newEntry.project) {
      const updatedEntries = timeEntries.map(entry => 
        entry.id === editingEntry.id 
          ? { ...entry, ...newEntry }
          : entry
      );
      setTimeEntries(updatedEntries);
      setNewEntry({ username: '', startTime: '', endTime: '', message: '', project: '', date: '' });
      setEditingEntry(null);
      setShowAddModal(false);
    }
  };

  const handleDeleteEntry = (entryId) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      setTimeEntries(timeEntries.filter(entry => entry.id !== entryId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with white card design */}
      <div className="p-0 sm:p-4 lg:p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex justify-between items-center">
          <h1 className="text-gray-900 text-xl font-bold">Time Tracker</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <i className="fas fa-plus"></i>
            <span className="hidden sm:inline">Add Time Sheet</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="p-0 sm:p-4 lg:p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Total Time */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <i className="fas fa-chart-bar text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Total Time</p>
                <p className="text-2xl font-bold text-gray-900">00:00:0</p>
                <p className="text-sm text-gray-500">0</p>
              </div>
            </div>
          </div>

          {/* Week's Total Time */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <i className="fas fa-chart-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Week's Total Time</p>
                <p className="text-2xl font-bold text-gray-900">00:00:0</p>
                <p className="text-sm text-gray-500">0</p>
              </div>
            </div>
          </div>

          {/* Month's Total Time */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                <i className="fas fa-chart-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Month's Total Time</p>
                <p className="text-2xl font-bold text-gray-900">03:37:3</p>
                <p className="text-sm text-gray-500">8</p>
              </div>
            </div>
          </div>

          {/* Year's Total Time */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-cyan-100 text-cyan-600">
                <i className="fas fa-chart-pie text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Year's Total Time</p>
                <p className="text-2xl font-bold text-gray-900">06:14:1</p>
                <p className="text-sm text-gray-500">9</p>
              </div>
            </div>
          </div>
        </div>



        {/* Filters and Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* First Row - Date range, user filter, and filter button */}
          <div className="flex flex-col sm:flex-row gap-4 items-end mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Tracker Dates Between Range</label>
              <input
                type="text"
                placeholder="Select date range..."
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Users</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Users</option>
                <option value="administrator">Administrator</option>
                <option value="user1">User 1</option>
                <option value="user2">User 2</option>
              </select>
            </div>
            <button className="px-2 py-1.5 sm:px-6 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base">
              Filter
            </button>
          </div>

          {/* Second Row - Search and action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-1">
              <div className="relative tooltip-container">
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                  <i className="fas fa-sync-alt"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Refresh
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
              <div className="relative tooltip-container">
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                  <i className="fas fa-th-large"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  View Options
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
              <div className="relative tooltip-container">
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                  <i className="fas fa-download"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Export
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
              <div className="relative tooltip-container">
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                  <i className="fas fa-chevron-down"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  More Options
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Entries Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          {currentEntries.length > 0 ? (
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8">
                          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-xs">
                            {entry.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{entry.username}</div>
                          <div className="text-xs text-gray-500 truncate">{entry.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      {entry.startTime}
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      {entry.endTime}
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      {entry.duration}
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      <div className="truncate max-w-24 sm:max-w-xs" title={entry.message}>
                        {entry.message}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      <div className="truncate max-w-20 sm:max-w-32" title={entry.project}>
                        {entry.project}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">
                      {entry.date}
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium">
                      <div className="relative" ref={dropdownRef}>
                        <button 
                          onClick={() => setOpenDropdown(openDropdown === entry.id ? null : entry.id)}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                        >
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                        {openDropdown === entry.id && (
                          <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  handleEditEntry(entry);
                                  setOpenDropdown(null);
                                }}
                                className="block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                              >
                                <i className="fas fa-pencil-alt"></i>
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteEntry(entry.id);
                                  setOpenDropdown(null);
                                }}
                                className="block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                              >
                                <i className="far fa-trash-alt"></i>
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-clock text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No time entries found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredEntries.length)} of {filteredEntries.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === number
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      

      

      {/* Add/Edit Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingEntry ? 'Edit Time Entry' : 'Add Time Entry'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingEntry(null);
                  setNewEntry({ username: '', startTime: '', endTime: '', message: '', project: '', date: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={newEntry.username}
                  onChange={(e) => setNewEntry({...newEntry, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={newEntry.startTime}
                  onChange={(e) => setNewEntry({...newEntry, startTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={newEntry.endTime}
                  onChange={(e) => setNewEntry({...newEntry, endTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <select
                  value={newEntry.project}
                  onChange={(e) => setNewEntry({...newEntry, project: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={newEntry.message}
                  onChange={(e) => setNewEntry({...newEntry, message: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter message"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingEntry(null);
                  setNewEntry({ username: '', startTime: '', endTime: '', message: '', project: '', date: '' });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingEntry ? handleUpdateEntry : handleAddEntry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingEntry ? 'Update' : 'Add'} Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeTracker; 