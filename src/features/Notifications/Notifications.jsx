import React, { useState } from 'react';

function Notifications() {
  const [selectedType, setSelectedType] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Notifications');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      message: "John Smith created event - Fgh ID #65",
      date: "12-Jul-2025 08:33:47",
      type: "event"
    },
    {
      id: 2,
      message: "Main Admin posted announcement - test444 ID #15",
      date: "05-Jul-2025 16:34:34",
      type: "announcement"
    },
    {
      id: 3,
      message: "Main Admin updated event - etststwet ID #33",
      date: "12-Jun-2025 05:00:34",
      type: "event"
    },
    {
      id: 4,
      message: "Main Admin updated event - ;\\'lkjhg ID #",
      date: "30-May-2025 14:52:27",
      type: "event"
    }
  ];

  const handleViewNotification = (id) => {
    console.log('View notification:', id);
    // Add view logic here
  };

  const handleDeleteNotification = (id) => {
    console.log('Delete notification:', id);
    // Add delete logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Notifications</h1>
          </div>
        </div>

                 {/* Filter and Search Section */}
         <div className="bg-white rounded-lg shadow-sm mb-6">
           <div className="p-4 sm:p-6">
             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
               {/* Left side - Filters */}
               <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">
                 <div className="flex items-center space-x-2">
                   <select
                     value={selectedType}
                     onChange={(e) => setSelectedType(e.target.value)}
                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   >
                     <option value="">Select Type</option>
                     <option value="event">Event</option>
                     <option value="announcement">Announcement</option>
                     <option value="user">User</option>
                     <option value="project">Project</option>
                   </select>
                   
                   <select
                     value={selectedFilter}
                     onChange={(e) => setSelectedFilter(e.target.value)}
                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   >
                     <option value="All Notifications">All Notifications</option>
                     <option value="Unread">Unread</option>
                     <option value="Read">Read</option>
                     <option value="Today">Today</option>
                     <option value="This Week">This Week</option>
                   </select>
                 </div>
                 
                 <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                   Filter
                 </button>
               </div>

               {/* Right side - Search and Actions */}
               <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">
                 <div className="relative">
                   <input
                     type="text"
                     placeholder="Search"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="border border-gray-300 rounded-lg pl-8 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                   <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                 </div>
                 
                 <div className="flex items-center space-x-2">
                   <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                     <i className="fas fa-sync-alt"></i>
                   </button>
                   <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                     <i className="fas fa-list"></i>
                   </button>
                   <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                     <i className="fas fa-filter"></i>
                   </button>
                   <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                     <i className="fas fa-download"></i>
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>

        {/* Notifications Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notification
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center justify-center">
                      Date
                      <i className="fas fa-sort ml-1 text-gray-400"></i>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notifications.map((notification, index) => (
                  <tr key={notification.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                        {notification.message}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {notification.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications; 