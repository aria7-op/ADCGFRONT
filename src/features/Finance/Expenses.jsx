import React, { useState } from 'react';

function Expenses() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const expenses = [
    {
      id: 1,
      title: "250",
      expenseType: "office kitchen",
      note: "for the",
      amount: 2000,
      expenseDate: "2024-10-18 16:42:00"
    },
    {
      id: 2,
      title: "chella",
      expenseType: "Software Subscriptions",
      note: "ff",
      amount: 50000,
      expenseDate: "2024-05-05 02:13:00"
    },
    {
      id: 3,
      title: "CHHGH",
      expenseType: "Marketing",
      note: "",
      amount: 5000,
      expenseDate: "2024-08-24 21:49:00"
    },
    {
      id: 4,
      title: "Digital Marketing Campaign",
      expenseType: "Marketing",
      note: "Paid advertising expenses for a digital marketing campaign.",
      amount: 10000,
      expenseDate: "2024-02-16 15:36:00"
    },
    {
      id: 5,
      title: "Employee Salary Payment",
      expenseType: "Salaries and Wages",
      note: "Monthly salaries for employees.",
      amount: 30000,
      expenseDate: "2024-03-30 15:37:00"
    },
    {
      id: 6,
      title: "ghgj",
      expenseType: "Marketing",
      note: "",
      amount: 6767,
      expenseDate: "2024-06-25 12:21:30"
    },
    {
      id: 7,
      title: "ii",
      expenseType: "office kitchen",
      note: "",
      amount: 99,
      expenseDate: "2024-11-17 09:40:00"
    },
    {
      id: 8,
      title: "internet and Phone Bill",
      expenseType: "Office Supplies",
      note: "Monthly internet and phone service charges.",
      amount: 15000,
      expenseDate: "2024-02-01 15:34:00"
    },
    {
      id: 9,
      title: "jds",
      expenseType: "Marketing",
      note: "",
      amount: 5000,
      expenseDate: "2024-11-20 10:15:00"
    },
    {
      id: 10,
      title: "Office Rent",
      expenseType: "Rent",
      note: "Monthly office rent payment",
      amount: 15000,
      expenseDate: "2024-11-01 10:00:00"
    },
    {
      id: 11,
      title: "Internet Bill",
      expenseType: "Utilities",
      note: "Monthly internet service payment",
      amount: 2500,
      expenseDate: "2024-11-05 14:30:00"
    },
    {
      id: 12,
      title: "Electricity Bill",
      expenseType: "Utilities",
      note: "Monthly electricity payment",
      amount: 3500,
      expenseDate: "2024-11-10 09:15:00"
    }
  ];

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(expense =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.expenseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="p-0 sm:p-4 lg:p-6">
      {/* Section Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Expenses</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="bg-blue-500 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center text-sm sm:text-base">
                <i className="fas fa-list mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline">Expense Types</span>
                <span className="sm:hidden">Types</span>
              </button>
              <button className="bg-blue-500 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center text-sm sm:text-base">
                <i className="fas fa-plus mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline">Add Expense</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          {/* Bootstrap Table Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="relative tooltip-container">
                <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                  <i className="fas fa-sync-alt text-sm sm:text-base"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Refresh
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
              <div className="relative tooltip-container">
                <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded flex items-center">
                  <i className="fas fa-th-list text-sm sm:text-base"></i>
                  <i className="fas fa-chevron-down text-xs ml-0.5 sm:ml-1"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Columns
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
              <div className="relative tooltip-container">
                <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded flex items-center">
                  <i className="fas fa-download text-sm sm:text-base"></i>
                  <i className="fas fa-chevron-down text-xs ml-0.5 sm:ml-1"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Export Data
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-32 sm:w-48 lg:w-64 pl-3 sm:pl-4 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-striped table-bordered table-hover">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center">
                      Title
                      <i className="fas fa-sort-up ml-1 text-blue-500"></i>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center">
                      Expense Type
                      <i className="fas fa-sort ml-1 text-gray-400"></i>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center">
                      Note
                      <i className="fas fa-sort ml-1 text-gray-400"></i>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center">
                      Amount(AF)
                      <i className="fas fa-sort ml-1 text-gray-400"></i>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center">
                      Expense Date
                      <i className="fas fa-sort ml-1 text-gray-400"></i>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentExpenses.map((expense, index) => (
                  <tr key={expense.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.expenseType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.note || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      AF {expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.expenseDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="relative">
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
                          <div className="py-1">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <i className="fas fa-pencil-alt mr-2"></i>
                              Edit
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <i className="far fa-trash-alt mr-2"></i>
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredExpenses.length)} of {filteredExpenses.length} results
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-700">entries</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((pageNumber, index) => (
                    <button
                      key={index}
                      onClick={() => pageNumber !== '...' && handlePageChange(pageNumber)}
                      disabled={pageNumber === '...'}
                      className={`px-3 py-1 text-sm border rounded ${
                        pageNumber === currentPage
                          ? 'bg-blue-500 text-white border-blue-500'
                          : pageNumber === '...'
                          ? 'border-gray-300 text-gray-500 cursor-default'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expenses; 