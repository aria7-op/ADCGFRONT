import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function LeadsReport() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock data for statistics cards
  const statsData = [
    {
      title: 'Total Leads',
      value: '245',
      icon: 'fas fa-users',
      color: 'bg-blue-500'
    },
    {
      title: 'New Leads',
      value: '89',
      icon: 'fas fa-user-plus',
      color: 'bg-green-500'
    },
    {
      title: 'Qualified Leads',
      value: '156',
      icon: 'fas fa-user-check',
      color: 'bg-purple-500'
    },
    {
      title: 'Converted',
      value: '67',
      icon: 'fas fa-user-tie',
      color: 'bg-indigo-500'
    }
  ];

  // Mock data for leads status chart
  const leadsStatusData = {
    labels: ['New', 'Qualified', 'Contacted', 'Converted', 'Lost'],
    datasets: [
      {
        data: [89, 156, 78, 67, 34],
        backgroundColor: [
          '#10B981',
          '#8B5CF6',
          '#3B82F6',
          '#6366F1',
          '#EF4444'
        ],
        borderWidth: 0,
      },
    ],
  };

  // Mock data for leads overview chart
  const leadsOverviewData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Leads',
        data: [15, 22, 18, 25, 30, 35],
        backgroundColor: '#10B981',
      },
      {
        label: 'Qualified',
        data: [12, 18, 15, 20, 25, 28],
        backgroundColor: '#8B5CF6',
      },
      {
        label: 'Converted',
        data: [5, 8, 6, 10, 12, 15],
        backgroundColor: '#6366F1',
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Leads Report</h1>
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
        {/* Leads Status Chart */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800">Leads Status</h4>
          </div>
          <div className="p-4 sm:p-6">
            <div className="h-64">
              <Doughnut data={leadsStatusData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Leads Overview Chart */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800">Leads Overview</h4>
          </div>
          <div className="p-4 sm:p-6">
            <div className="h-64">
              <Bar data={leadsOverviewData} options={barChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadsReport; 