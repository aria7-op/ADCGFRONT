import React, { useState } from 'react';

function ActivityLogs() {
  const [activityType, setActivityType] = useState('');
  const [activity, setActivity] = useState('');

  // Sample activity logs data
  const activityLogs = [
    {
      id: 1,
      user: 'You',
      activity: 'Uploaded',
      type: 'Project File',
      project: 'Customer Satisfaction Improvement Initiative',
      task: '-',
      comment: '-',
      file: '0',
      milestone: '-',
      date: '23-Jul-2025 23:31:01'
    },
    {
      id: 2,
      user: 'You',
      activity: 'Updated',
      type: 'Task Status',
      project: 'Customer Satisfaction Improvement Initiative',
      task: 'Customer Service Training',
      comment: '-',
      file: '-',
      milestone: '-',
      date: '20-Jul-2025 03:09:04'
    },
    {
      id: 3,
      user: 'You',
      activity: 'Updated',
      type: 'Task Status',
      project: 'Product Packaging Redesign',
      task: 'Prototype Testing',
      comment: '-',
      file: '-',
      milestone: '-',
      date: '19-Jul-2025 06:48:39'
    },
    {
      id: 4,
      user: 'You',
      activity: 'Updated',
      type: 'Task Status',
      project: 'Product Packaging Redesign',
      task: 'Prototype Testing',
      comment: '-',
      file: '-',
      milestone: '-',
      date: '19-Jul-2025 06:48:34'
    },
    {
      id: 5,
      user: 'You',
      activity: 'Deleted',
      type: 'Project File',
      project: 'Customer Satisfaction Improvement Initiative',
      task: '-',
      comment: '-',
      file: '06efb92a-0bc8-4b4a-9cc6-f851bb182d7c.png',
      milestone: '-',
      date: '15-Jul-2025 14:26:55'
    },
    {
      id: 6,
      user: 'You',
      activity: 'Deleted',
      type: 'Project File',
      project: 'Customer Satisfaction Improvement Initiative',
      task: '-',
      comment: '-',
      file: 'TerracottaPotterySemiautomatic.pdf',
      milestone: '-',
      date: '15-Jul-2025 14:26:52'
    },
    {
      id: 7,
      user: 'You',
      activity: 'Updated',
      type: 'Task Status',
      project: 'Customer Satisfaction Improvement Initiative',
      task: 'Survey Distribution',
      comment: '-',
      file: '-',
      milestone: '-',
      date: '15-Jul-2025 14:26:21'
    },
    {
      id: 8,
      user: 'You',
      activity: 'Created',
      type: 'Comment',
      project: 'Customer Satisfaction Improvement Initiative',
      task: 'Survey Distribution',
      comment: 'test',
      file: '-',
      milestone: '-',
      date: '11-Jul-2025 15:08:26'
    },
    {
      id: 9,
      user: 'You',
      activity: 'Updated',
      type: 'Task Status',
      project: 'Customer Satisfaction Improvement Initiative',
      task: 'Customer Service Training',
      comment: '-',
      file: '-',
      milestone: '-',
      date: '11-Jul-2025 15:07:49'
    }
  ];

  const getActivityBadgeColor = (activity) => {
    switch (activity) {
      case 'Created':
        return 'bg-green-500';
      case 'Updated':
        return 'bg-blue-500';
      case 'Deleted':
        return 'bg-red-500';
      case 'Uploaded':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleFilter = () => {
    // Handle filter logic here
    console.log('Filtering by:', { activityType, activity });
  };

  return (
    <div className="p-0 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Activity Log</h1>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="form-group">
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              >
                <option value="">Select Type</option>
                <option value="Project">Projects</option>
                <option value="Project File">Project File</option>
                <option value="Project Milestone">Project Milestone</option>
                <option value="Task">Tasks</option>
                <option value="Comment">Comments</option>
                <option value="Task Status">Tasks Status</option>
              </select>
            </div>

            <div className="form-group">
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              >
                <option value="">Select Activity</option>
                <option value="Created">Created</option>
                <option value="Updated">Updated</option>
                <option value="Deleted">Deleted</option>
                <option value="Uploaded">Uploaded</option>
              </select>
            </div>

            <div className="form-group">
              <button
                onClick={handleFilter}
                className="w-full px-2 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm sm:text-base"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Table Toolbar */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-1 sm:space-x-2">
              <div className="relative tooltip-container">
                <button className="p-1.5 sm:p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base">
                  <i className="fas fa-sync-alt"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Refresh
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
              <div className="relative tooltip-container">
                <button className="p-1.5 sm:p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base">
                  <i className="fas fa-th-list"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Columns
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
              <div className="relative tooltip-container">
                <button className="p-1.5 sm:p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base">
                  <i className="fas fa-download"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Export
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
            </div>
            <div className="flex-1 max-w-xs ml-4">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>

          {/* Activity Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Milestone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activityLogs.map((log, index) => (
                  <tr key={log.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white ${getActivityBadgeColor(log.activity)}`}>
                        {log.activity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.project}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.task}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.comment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.file}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.milestone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-red-500 hover:text-red-700">
                        <i className="far fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-2 sm:space-y-0">
            <div className="text-xs sm:text-sm text-gray-600">
              Showing 1 to 10 of 376 rows
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                ‹
              </button>
              <button className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-blue-500 text-white border border-blue-500 rounded-lg">
                1
              </button>
              <button className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                2
              </button>
              <button className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                3
              </button>
              <button className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                4
              </button>
              <button className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                5
              </button>
              <span className="px-1 sm:px-2 text-xs sm:text-sm text-gray-500">...</span>
              <button className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                38
              </button>
              <button className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs; 