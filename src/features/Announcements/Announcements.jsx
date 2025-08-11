import React, { useState } from 'react';

function Announcements() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock announcements data
  const announcements = [
    {
      id: 1,
      title: "test444",
      status: "Un-pinned",
      author: "You",
      date: "05-Jul-2025 16:34:34"
    },
    {
      id: 2,
      title: "testing lagi",
      status: "Un-pinned",
      author: "John Smith",
      date: "25-Feb-2025 12:50:13"
    },
    {
      id: 3,
      title: "Ini testing",
      status: "Un-pinned",
      author: "You",
      date: "20-Feb-2025 10:30:45"
    },
    {
      id: 4,
      title: "Ggg",
      status: "Un-pinned",
      author: "John Smith",
      date: "18-Feb-2025 14:22:18"
    },
    {
      id: 5,
      title: "leasing",
      status: "Un-pinned",
      author: "You",
      date: "15-Feb-2025 09:15:30"
    },
    {
      id: 6,
      title: "high pority",
      status: "Un-pinned",
      author: "John Smith",
      date: "12-Feb-2025 16:45:22"
    },
    {
      id: 7,
      title: "ádg",
      status: "Un-pinned",
      author: "You",
      date: "10-Feb-2025 11:20:15"
    },
    {
      id: 8,
      title: "Monday off",
      status: "Un-pinned",
      author: "John Smith",
      date: "08-Feb-2025 13:40:33"
    },
    {
      id: 9,
      title: "Fff",
      status: "Un-pinned",
      author: "You",
      date: "05-Feb-2025 08:55:12"
    }
  ];

  const handlePin = (id) => {
    console.log('Pin announcement:', id);
    // Add pin logic here
  };

  const handleDelete = (id) => {
    console.log('Delete announcement:', id);
    // Add delete logic here
  };

  const handleEdit = (id) => {
    console.log('Edit announcement:', id);
    // Add edit logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Announcements</h1>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Left side - Filters */}
              <div className="flex items-center space-x-3">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All</option>
                  <option value="Pinned">Pinned</option>
                  <option value="Un-pinned">Un-pinned</option>
                </select>
                
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm">
                  Filter
                </button>
              </div>

              {/* Right side - Search and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                    <i className="fas fa-th"></i>
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                    <i className="fas fa-list"></i>
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                    <i className="fas fa-download"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

                 {/* Announcements List */}
         <div className="bg-white rounded-lg shadow-sm">
           <div className="p-4 sm:p-6">
             <div className="space-y-3">
               {announcements.map((announcement) => (
                 <div key={announcement.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors space-y-3 sm:space-y-0">
                   {/* Left side - Title and Status */}
                   <div className="flex-1">
                     <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                       <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                         {announcement.title}
                       </h3>
                       <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 w-fit">
                         {announcement.status}
                       </span>
                     </div>
                   </div>

                   {/* Right side - Author, Date, and Actions */}
                   <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                     <div className="text-left sm:text-right">
                       <p className="text-sm text-gray-600">
                         {announcement.author} | {announcement.date}
                       </p>
                     </div>
                     
                     <div className="flex items-center space-x-2">
                       <button
                         onClick={() => handlePin(announcement.id)}
                         className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                         title="Pin announcement"
                       >
                         <i className="fas fa-thumbtack"></i>
                       </button>
                       <button
                         onClick={() => handleDelete(announcement.id)}
                         className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                         title="Delete announcement"
                       >
                         <i className="fas fa-trash"></i>
                       </button>
                       <button
                         onClick={() => handleEdit(announcement.id)}
                         className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50"
                         title="Edit announcement"
                       >
                         <i className="fas fa-edit"></i>
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>

            {/* Pagination Info */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="text-sm text-gray-700">
                Showing 1 to 9 of 9 rows
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Announcements; 