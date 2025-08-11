import React, { useState } from 'react';

function Payslip() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [payslips, setPayslips] = useState([
    {
      id: 37,
      username: 'John Smith',
      payslipMonth: 'August 2025',
      basicSalary: 0,
      totalEarnings: 0,
      totalDeductions: 0,
      netPay: 0,
      paymentDate: '03 August 2025',
      paymentMethod: '-',
      status: 'unpaid'
    },
    {
      id: 36,
      username: 'Ryo Kaito',
      payslipMonth: 'July 2025',
      basicSalary: 1600,
      totalEarnings: 1173.33,
      totalDeductions: 0,
      netPay: 1173.33,
      paymentDate: '05 July 2025',
      paymentMethod: 'Strip',
      status: 'unpaid'
    },
    {
      id: 35,
      username: 'Emily Johnson',
      payslipMonth: 'July 2025',
      basicSalary: 10000,
      totalEarnings: 47750,
      totalDeductions: 0,
      netPay: 47750,
      paymentDate: '03 July 2025',
      paymentMethod: 'Bkash',
      status: 'unpaid'
    },
    {
      id: 34,
      username: 'Emily Johnson',
      payslipMonth: 'June 2025',
      basicSalary: 0,
      totalEarnings: 0,
      totalDeductions: 0,
      netPay: 0,
      paymentDate: '03 June 2025',
      paymentMethod: '-',
      status: 'unpaid'
    },
    {
      id: 33,
      username: 'Main Admin',
      payslipMonth: 'April 2025',
      basicSalary: 45000,
      totalEarnings: 45035,
      totalDeductions: 0,
      netPay: 45035,
      paymentDate: '04 April 2025',
      paymentMethod: 'Strip',
      status: 'paid'
    }
  ]);

  const [newPayslip, setNewPayslip] = useState({
    username: '',
    payslipMonth: '',
    basicSalary: '',
    totalEarnings: '',
    totalDeductions: '',
    paymentDate: '',
    paymentMethod: '',
    status: 'unpaid'
  });

  const filteredPayslips = payslips.filter(payslip => {
    const matchesSearch = payslip.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payslip.payslipMonth.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '' || payslip.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddPayslip = () => {
    const newPayslipData = {
      id: payslips.length > 0 ? Math.max(...payslips.map(p => p.id)) + 1 : 1,
      ...newPayslip,
      netPay: parseFloat(newPayslip.totalEarnings || 0) - parseFloat(newPayslip.totalDeductions || 0)
    };
    setPayslips([...payslips, newPayslipData]);
    setNewPayslip({
      username: '',
      payslipMonth: '',
      basicSalary: '',
      totalEarnings: '',
      totalDeductions: '',
      paymentDate: '',
      paymentMethod: '',
      status: 'unpaid'
    });
    setShowAddModal(false);
  };

  const handleDeletePayslip = (id) => {
    if (window.confirm('Are you sure you want to delete this payslip?')) {
      setPayslips(payslips.filter(payslip => payslip.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-blue-600 text-white';
      case 'unpaid': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-0 sm:p-4 lg:p-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payslip</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-2 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
        >
          <i className="fas fa-plus"></i>
          <span className="hidden sm:inline">Create Payslip</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name or month..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <div className="relative tooltip-container">
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2">
                <i className="fas fa-sync"></i>
                <span>Refresh</span>
              </button>
              <div className="tooltip tooltip-bottom">
                Refresh Data
                <div className="tooltip-arrow tooltip-arrow-bottom"></div>
              </div>
            </div>
            <div className="relative tooltip-container">
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2">
                <i className="fas fa-download"></i>
                <span>Export</span>
              </button>
              <div className="tooltip tooltip-bottom">
                Export Data
                <div className="tooltip-arrow tooltip-arrow-bottom"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payslips Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payslip
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payslip Month
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Basic Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Earnings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Deductions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Pay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayslips.map(payslip => (
              <tr key={payslip.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                      Payslip-{payslip.id}
                    </a>
                    <div className="text-xs text-gray-500 mt-1 opacity-0 hover:opacity-100 transition-opacity">
                      <span className="mx-1">•</span>
                      <a href="#" className="text-gray-600 hover:text-gray-800">Edit</a>
                      <span className="mx-1">•</span>
                      <a href="#" className="text-gray-600 hover:text-gray-800">Duplicate</a>
                      <span className="mx-1">•</span>
                      <button 
                        onClick={() => handleDeletePayslip(payslip.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Trash
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payslip.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payslip.payslipMonth}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payslip.basicSalary}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payslip.totalEarnings}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payslip.totalDeductions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payslip.netPay}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payslip.paymentDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payslip.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payslip.status)}`}>
                    {payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Payslip Modal */}
      {showAddModal && (
        <div className="fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Payslip</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleAddPayslip(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={newPayslip.username}
                      onChange={(e) => setNewPayslip({...newPayslip, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payslip Month</label>
                    <input
                      type="text"
                      value={newPayslip.payslipMonth}
                      onChange={(e) => setNewPayslip({...newPayslip, payslipMonth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., August 2025"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                    <input
                      type="number"
                      value={newPayslip.basicSalary}
                      onChange={(e) => setNewPayslip({...newPayslip, basicSalary: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Earnings</label>
                    <input
                      type="number"
                      value={newPayslip.totalEarnings}
                      onChange={(e) => setNewPayslip({...newPayslip, totalEarnings: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Deductions</label>
                    <input
                      type="number"
                      value={newPayslip.totalDeductions}
                      onChange={(e) => setNewPayslip({...newPayslip, totalDeductions: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                    <input
                      type="date"
                      value={newPayslip.paymentDate}
                      onChange={(e) => setNewPayslip({...newPayslip, paymentDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      value={newPayslip.paymentMethod}
                      onChange={(e) => setNewPayslip({...newPayslip, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Payment Method</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                      <option value="Check">Check</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Stripe">Stripe</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Payslip
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

export default Payslip; 