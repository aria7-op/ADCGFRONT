import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  return (
    <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Projects */}
        <div className="bg-white rounded-lg shadow-md p-0 overflow-hidden">
          <div className="flex items-center h-24">
            <div className="w-20 h-20 bg-[#34395e] rounded-lg flex items-center justify-center ml-4 mr-4">
              <i className="fas fa-briefcase text-white text-2xl"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-500 mb-1">Total Projects</h4>
              <div className="text-xl font-bold text-[#34395e]">12</div>
            </div>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="bg-white rounded-lg shadow-md p-0 overflow-hidden">
          <div className="flex items-center h-24">
            <div className="w-20 h-20 bg-[#34395e] rounded-lg flex items-center justify-center ml-4 mr-4">
              <i className="fas fa-newspaper text-white text-2xl"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-500 mb-1">Total Tasks</h4>
              <div className="text-xl font-bold text-[#34395e]">32</div>
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="bg-white rounded-lg shadow-md p-0 overflow-hidden">
          <div className="flex items-center h-24">
            <div className="w-20 h-20 bg-[#34395e] rounded-lg flex items-center justify-center ml-4 mr-4">
              <i className="fas fa-user text-white text-2xl"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-500 mb-1">Users</h4>
              <div className="text-xl font-bold text-[#34395e]">32</div>
            </div>
          </div>
        </div>

        {/* Clients */}
        <div className="bg-white rounded-lg shadow-md p-0 overflow-hidden">
          <div className="flex items-center h-24">
            <div className="w-20 h-20 bg-[#34395e] rounded-lg flex items-center justify-center ml-4 mr-4">
              <i className="fas fa-sticky-note text-white text-2xl"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-500 mb-1">Clients</h4>
              <div className="text-xl font-bold text-[#34395e]">22</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Projects Status Chart */}
        <div className="bg-white rounded-lg shadow-md p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Projects Status</h3>
          </div>
          <div className="p-6">
            <Bar
              data={{
                labels: ['Waiting for Approval', 'Planning', 'Needs Review', 'Completed'],
                datasets: [
                  {
                    label: 'Projects',
                    data: [3.0, 1.0, 2.0, 3.0],
                    backgroundColor: [
                      'rgba(236, 72, 153, 0.3)', // pink with 60% opacity
                      'rgba(249, 115, 22, 0.3)', // orange
                      'rgba(59, 130, 246, 0.3)', // blue
                      'rgba(107, 114, 128, 0.3)',
                    ],
                    borderColor: [
                     'rgba(236, 72, 153, 1)',
                     'rgba(249, 115, 22, 1)',
                     'rgba(59, 130, 246, 1)',
                     'rgba(107, 114, 128, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 3.5,
                    ticks: {
                      stepSize: 0.5,
                    },
                    grid: {
                      color: '#f3f4f6',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      maxRotation: 45,
                      minRotation: 45,
                    },
                  },
                },
              }}
              height={300}
            />
          </div>
        </div>

        {/* Tasks Overview Chart */}
        <div className="bg-white rounded-lg shadow-md p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Tasks Overview</h3>
          </div>
          <div className="p-6">
            <Bar
              data={{
                labels: ['Waiting for Approval', 'Planning', 'On Hold', 'Delayed', 'Blocked'],
                datasets: [
                  {
                    label: 'Tasks',
                    data: [3.0, 3.0, 1.0, 2.0, 6.0],
                    backgroundColor: [
                      'rgba(236, 72, 153, 0.3)', // pink
                      'rgba(249, 115, 22, 0.3)', // orange
                      'rgba(59, 130, 246, 0.3)', // blue
                      'rgba(6, 182, 212, 0.3)',  // cyan
                      'rgba(107, 114, 128, 0.3)', // gray
                    ],
                    borderColor: [
                      'rgba(236, 72, 153, 1)',
                      'rgba(249, 115, 22, 1)',
                      'rgba(59, 130, 246, 1)',
                      'rgba(6, 182, 212, 1)',
                      'rgba(107, 114, 128, 1)',
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 12,
                    ticks: {
                      stepSize: 2,
                    },
                    grid: {
                      color: '#f3f4f6',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      maxRotation: 45,
                      minRotation: 45,
                    },
                  },
                },
              }}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Recent Activities</h3>
          </div>
                      <div className="space-y-4">
            {/* Activity items */}
            <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-file-alt text-blue-600"></i>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">New project created</p>
                <p className="text-gray-600 text-sm">Project "Website Redesign" was created</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm">2 hours ago</p>
                <i className="fas fa-calendar-alt text-gray-400 text-xs"></i>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-check text-green-600"></i>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">Task completed</p>
                <p className="text-gray-600 text-sm">Task "Design Homepage" was completed</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm">4 hours ago</p>
                <i className="fas fa-calendar-alt text-gray-400 text-xs"></i>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-yellow-600"></i>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">New team member</p>
                <p className="text-gray-600 text-sm">Sarah Johnson joined the team</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm">1 day ago</p>
                <i className="fas fa-calendar-alt text-gray-400 text-xs"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Todos Section */}
        <div className="bg-white rounded-lg shadow-md p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold text-gray-800">Todos</h4>
              <a href="#" className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary-400">
                View All
              </a>
            </div>
          </div>
          
          
          {/* Add Todo Form */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add Todo list"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-primary text-white px-2 py-1.5 sm:px-6 sm:py-2 rounded-lg font-semibold hover:bg-secondary-400 text-sm sm:text-base">
                Add
              </button>
            </div>
          </div>

          {/* Todo List */}
          <div className="space-y-4">
            {/* Todo Item 1 */}
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              <div className="flex-1">
                <p className="text-gray-800 font-medium">Complete project documentation</p>
                <p className="text-blue-600 text-sm">
                  <i className="fas fa-calendar-alt text-gray-400 mr-1"></i>
                  15-07-2025
                </p>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 bg-blue-600 text-white rounded text-xs">
                  <i className="fas fa-pen"></i>
                </button>
                <button className="p-1 bg-red-600 text-white rounded text-xs">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>

            {/* Todo Item 2 */}
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <input type="checkbox" checked className="w-5 h-5 text-blue-600 rounded" />
              <div className="flex-1">
                <p className="text-gray-800 font-medium line-through text-blue-600">Review code changes</p>
                <p className="text-blue-600 text-sm">
                  <i className="fas fa-calendar-alt text-gray-400 mr-1"></i>
                  22-03-2025
                </p>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 bg-blue-600 text-white rounded text-xs">
                  <i className="fas fa-pen"></i>
                </button>
                <button className="p-1 bg-red-600 text-white rounded text-xs">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>

            {/* Todo Item 3 */}
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <input type="checkbox" checked className="w-5 h-5 text-blue-600 rounded" />
              <div className="flex-1">
                <p className="text-gray-800 font-medium line-through text-blue-600">Update user interface</p>
                <p className="text-blue-600 text-sm">
                  <i className="fas fa-calendar-alt text-gray-400 mr-1"></i>
                  02-02-2025
                </p>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 bg-blue-600 text-white rounded text-xs">
                  <i className="fas fa-pen"></i>
                </button>
                <button className="p-1 bg-red-600 text-white rounded text-xs">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Tasks Insights */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-lg font-bold text-gray-800">Tasks Insights</h4>
        </div>
        <div className="p-6">
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <input
                type="text"
                placeholder="Project Name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Status</option>
                <option value="waiting">Waiting for Approval</option>
                <option value="testing">Testing Phase</option>
                <option value="planning">Planning</option>
                <option value="pending">Pending</option>
                <option value="on-hold">On Hold</option>
                <option value="in-progress">In Progress</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Tasks Due Dates Between"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <button className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-secondary-400 transition-colors">
                Filter
              </button>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <div className="relative tooltip-container">
                <button className="px-3 py-2 bg-gray-500 text-white rounded-l-lg hover:bg-gray-600">
                  <i className="fas fa-sync"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Refresh
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
              <div className="relative tooltip-container">
                <button className="px-3 py-2 bg-gray-500 text-white hover:bg-gray-600">
                  <i className="fas fa-th-list"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Columns
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
              <div className="relative tooltip-container">
                <button className="px-3 py-2 bg-gray-500 text-white rounded-r-lg hover:bg-gray-600">
                  <i className="fas fa-download"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Export
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
            </div>
            <div>
              <input
                type="text"
                placeholder="Search"
                className="w-32 sm:w-48 lg:w-64 pl-3 sm:pl-4 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Tasks Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b">Tasks</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b">Project</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b">Priority</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b">Start Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    task: 'Customer Service Training',
                    project: 'Customer Satisfaction Improvement Initiative',
                    priority: 'Low',
                    status: 'Testing Phase',
                    startDate: '2024-10-14',
                    dueDate: '2024-11-13'
                  },
                  {
                    task: 'Customer Service Training',
                    project: 'Customer Satisfaction Improvement Initiative',
                    priority: 'Low',
                    status: 'Waiting for Approval',
                    startDate: '2024-10-14',
                    dueDate: '2024-11-13'
                  },
                  {
                    task: 'Customer Service Training',
                    project: 'Customer Satisfaction Improvement Initiative',
                    priority: 'Low',
                    status: 'Delayed',
                    startDate: '2024-10-14',
                    dueDate: '2024-11-13'
                  },
                  {
                    task: 'Survey Distribution',
                    project: 'Customer Satisfaction Improvement Initiative',
                    priority: 'Low',
                    status: 'Delayed',
                    startDate: '2024-03-06',
                    dueDate: '2024-03-15'
                  },
                  {
                    task: 'Customer Service Training',
                    project: 'Customer Satisfaction Improvement Initiative',
                    priority: 'Low',
                    status: 'On Hold',
                    startDate: '2024-10-14',
                    dueDate: '2024-11-13'
                  }
                ].map((task, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 border-b">
                      <a href="#" className="text-blue-600 hover:underline">{task.task}</a>
                    </td>
                    <td className="px-6 py-4 border-b">
                      <a href="#" className="text-blue-600 hover:underline">{task.project}</a>
                    </td>
                    <td className="px-6 py-4 border-b">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        task.status === 'Completed' ? 'bg-green-500 text-white' :
                        task.status === 'On Hold' ? 'bg-red-500 text-white' :
                        task.status === 'In Progress' ? 'bg-gray-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b">{task.startDate}</td>
                    <td className="px-6 py-4 border-b">{task.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
            <div className="text-xs sm:text-sm text-gray-600">
              Showing 1 to 10 of 32 rows
            </div>
            <div className="flex space-x-1 sm:space-x-2">
              <button className="px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs sm:text-sm">Previous</button>
              <button className="px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-600 text-white rounded text-xs sm:text-sm">1</button>
              <button className="px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs sm:text-sm">2</button>
              <button className="px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs sm:text-sm">3</button>
              <button className="px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs sm:text-sm">Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard; 