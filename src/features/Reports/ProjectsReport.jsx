import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function ProjectsReport() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock data for statistics cards
  const statsData = [
    {
      title: 'Total Projects',
      value: '12',
      icon: 'fas fa-briefcase',
      color: 'bg-blue-500'
    },
    {
      title: 'Active Projects',
      value: '8',
      icon: 'fas fa-play-circle',
      color: 'bg-green-500'
    },
    {
      title: 'Completed Projects',
      value: '3',
      icon: 'fas fa-check-circle',
      color: 'bg-purple-500'
    },
    {
      title: 'On Hold',
      value: '1',
      icon: 'fas fa-pause-circle',
      color: 'bg-yellow-500'
    }
  ];

  // Mock data for project status chart
  const projectStatusData = {
    labels: ['Active', 'Completed', 'On Hold', 'Cancelled'],
    datasets: [
      {
        data: [8, 3, 1, 0],
        backgroundColor: [
          '#10B981',
          '#8B5CF6',
          '#F59E0B',
          '#EF4444'
        ],
        borderWidth: 0,
      },
    ],
  };

  // Mock data for project overview chart
  const projectOverviewData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active',
        data: [2, 3, 4, 5, 6, 8],
        backgroundColor: '#10B981',
      },
      {
        label: 'Completed',
        data: [0, 1, 1, 2, 2, 3],
        backgroundColor: '#8B5CF6',
      },
      {
        label: 'On Hold',
        data: [1, 1, 0, 1, 1, 1],
        backgroundColor: '#F59E0B',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-0 sm:p-4 lg:p-4">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Projects Report</h1>
            <div className="flex items-center space-x-4">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              >
                {Array.from({ length: 30 }, (_, i) => 2000 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button className="bg-blue-500 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base">
                <i className="fas fa-filter mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline">Filter</span>
                <span className="sm:hidden">Filter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg mr-4`}>
                <i className={`${stat.icon} text-white text-xl`}></i>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Chart */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800">Projects Status</h4>
          </div>
          <div className="p-4 sm:p-6">
            <div className="h-64">
              <Doughnut data={projectStatusData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Project Overview Chart */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800">Projects Overview</h4>
          </div>
          <div className="p-4 sm:p-6">
            <div className="h-64">
              <Bar data={projectOverviewData} options={barChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsReport; 