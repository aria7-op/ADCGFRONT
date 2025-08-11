import React, { useState } from 'react';

function Invoices() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);

  const invoices = [
    {
      id: 1,
      invoiceNumber: "INV-001",
      client: "Tech Solutions Inc",
      amount: 25000,
      status: "Paid",
      dueDate: "2024-11-20 10:30:00"
    },
    {
      id: 2,
      invoiceNumber: "INV-002",
      client: "StartupXYZ",
      amount: 45000,
      status: "Pending",
      dueDate: "2024-11-18 14:15:00"
    },
    {
      id: 3,
      invoiceNumber: "INV-003",
      client: "Design Studio",
      amount: 15000,
      status: "Overdue",
      dueDate: "2024-11-15 09:45:00"
    },
    {
      id: 4,
      invoiceNumber: "INV-004",
      client: "Retail Solutions",
      amount: 35000,
      status: "Draft",
      dueDate: "2024-11-12 16:20:00"
    },
    {
      id: 5,
      invoiceNumber: "INV-005",
      client: "Marketing Pro",
      amount: 12000,
      status: "Paid",
      dueDate: "2024-11-10 11:30:00"
    },
    {
      id: 6,
      invoiceNumber: "INV-006",
      client: "Local Business",
      amount: 8000,
      status: "Pending",
      dueDate: "2024-11-08 13:45:00"
    },
    {
      id: 7,
      invoiceNumber: "INV-007",
      client: "Publishing House",
      amount: 28000,
      status: "Overdue",
      dueDate: "2024-11-05 15:10:00"
    },
    {
      id: 8,
      invoiceNumber: "INV-008",
      client: "FinTech Solutions",
      amount: 18000,
      status: "Draft",
      dueDate: "2024-11-03 10:25:00"
    }
  ];

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Overdue': return 'bg-red-500';
      case 'Draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.relative')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Invoices</h1>
              <div className="flex items-center space-x-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                  <i className="fas fa-plus mr-2"></i>
                  Add Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Toolbar Section */}
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1"></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative tooltip-container">
                    <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                      <i className="fas fa-sync-alt"></i>
                    </button>
                    <div className="tooltip tooltip-bottom">
                      Refresh
                      <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                    </div>
                  </div>
                  <div className="relative tooltip-container">
                    <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                      <i className="fas fa-th-large"></i>
                    </button>
                    <div className="tooltip tooltip-bottom">
                      View Options
                      <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                    </div>
                  </div>
                  <div className="relative tooltip-container">
                    <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded flex items-center">
                      <i className="fas fa-filter"></i>
                      <i className="fas fa-chevron-down text-xs ml-1"></i>
                    </button>
                    <div className="tooltip tooltip-bottom">
                      Filter
                      <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                    </div>
                  </div>
                  <div className="relative tooltip-container">
                    <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded flex items-center">
                      <i className="fas fa-download"></i>
                      <i className="fas fa-chevron-down text-xs ml-1"></i>
                    </button>
                    <div className="tooltip tooltip-bottom">
                      Export Data
                      <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full table-striped table-hover">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center">
                      <span className="hidden sm:inline">Invoice Number</span>
                      <span className="sm:hidden">Invoice #</span>
                      <i className="fas fa-sort-up ml-1 text-blue-500"></i>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center">
                      <span className="hidden sm:inline">Client</span>
                      <span className="sm:hidden">Client</span>
                      <i className="fas fa-sort ml-1 text-gray-400"></i>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center">
                      <span className="hidden sm:inline">Amount(AF)</span>
                      <span className="sm:hidden">Amount</span>
                      <i className="fas fa-sort ml-1 text-gray-400"></i>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center">
                      <span className="hidden sm:inline">Status</span>
                      <span className="sm:hidden">Status</span>
                      <i className="fas fa-sort ml-1 text-gray-400"></i>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center">
                      <span className="hidden sm:inline">Due Date</span>
                      <span className="sm:hidden">Due</span>
                      <i className="fas fa-sort ml-1 text-gray-400"></i>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="hidden sm:inline">Action</span>
                    <span className="sm:hidden">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentInvoices.map((invoice, index) => (
                  <tr key={invoice.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.client}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      AF {invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.dueDate}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="relative">
                        <button 
                          onClick={() => toggleDropdown(invoice.id)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded"
                        >
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                        {openDropdown === invoice.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                <i className="fas fa-pencil-alt mr-2"></i>
                                Edit
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                <i className="far fa-trash-alt mr-2"></i>
                                Delete
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
          </div>

          {/* Pagination Section */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-sm text-gray-700 text-center sm:text-left">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredInvoices.length)} of {filteredInvoices.length} entries
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-auto"
                >
                  <option value={5}>5 entries</option>
                  <option value={10}>10 entries</option>
                  <option value={25}>25 entries</option>
                  <option value={50}>50 entries</option>
                </select>
              </div>
              
              <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded ${
                        currentPage === pageNumber
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-1 sm:px-2 text-xs sm:text-sm text-gray-500">...</span>
                )}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                )}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoices; 