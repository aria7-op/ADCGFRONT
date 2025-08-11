import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function InvoicesReport() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock data for statistics cards
  const statsData = [
    {
      title: 'Total Invoices',
      value: '89',
      icon: 'fas fa-file-invoice',
      color: 'bg-blue-500'
    },
    {
      title: 'Paid Invoices',
      value: '67',
      icon: 'fas fa-check-circle',
      color: 'bg-green-500'
    },
    {
      title: 'Pending Invoices',
      value: '18',
      icon: 'fas fa-clock',
      color: 'bg-yellow-500'
    },
    {
      title: 'Overdue Invoices',
      value: '4',
      icon: 'fas fa-exclamation-triangle',
      color: 'bg-red-500'
    }
  ];

  // Mock data for invoice status chart
  const invoiceStatusData = {
    labels: ['Paid', 'Pending', 'Overdue', 'Cancelled'],
    datasets: [
      {
        data: [67, 18, 4, 0],
        backgroundColor: [
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#6B7280'
        ],
        borderWidth: 0,
      },
    ],
  };

  // Mock data for invoice overview chart
  const invoiceOverviewData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Paid',
        data: [8, 12, 10, 15, 18, 20],
        backgroundColor: '#10B981',
      },
      {
        label: 'Pending',
        data: [3, 5, 4, 6, 8, 10],
        backgroundColor: '#F59E0B',
      },
      {
        label: 'Overdue',
        data: [1, 2, 1, 3, 2, 4],
        backgroundColor: '#EF4444',
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Invoices Report</h1>
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
        {/* Invoice Status Chart */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800">Invoice Status</h4>
          </div>
          <div className="p-4 sm:p-6">
            <div className="h-64">
              <Doughnut data={invoiceStatusData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Invoice Overview Chart */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800">Invoice Overview</h4>
          </div>
          <div className="p-4 sm:p-6">
            <div className="h-64">
              <Bar data={invoiceOverviewData} options={barChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoicesReport; 