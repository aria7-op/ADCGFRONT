import React, { useState } from 'react';

function Statuses() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStatus, setEditingStatus] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [statuses, setStatuses] = useState([
    {
      id: 1,
      type: 'In Progress',
      textColor: 'secondary'
    },
    {
      id: 2,
      type: 'On Hold',
      textColor: 'danger'
    },
    {
      id: 3,
      type: 'Completed',
      textColor: 'success'
    },
    {
      id: 4,
      type: 'Pending',
      textColor: 'warning'
    },
    {
      id: 5,
      type: 'Cancelled',
      textColor: 'info'
    }
  ]);

  const [newStatus, setNewStatus] = useState({
    type: '',
    textColor: 'info'
  });

  const filteredStatuses = statuses.filter(status =>
    status.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStatus = () => {
    const newId = statuses.length > 0 ? Math.max(...statuses.map(status => status.id)) + 1 : 1;
    const statusToAdd = {
      id: newId,
      ...newStatus
    };
    setStatuses([...statuses, statusToAdd]);
    setNewStatus({
      type: '',
      textColor: 'info'
    });
    setShowAddModal(false);
  };

  const handleEditStatus = () => {
    const updatedStatuses = statuses.map(status =>
      status.id === editingStatus.id ? editingStatus : status
    );
    setStatuses(updatedStatuses);
    setEditingStatus(null);
    setShowEditModal(false);
  };

  const handleDeleteStatus = (id) => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      setStatuses(statuses.filter(status => status.id !== id));
    }
  };

  const openEditModal = (status) => {
    setEditingStatus({ ...status });
    setShowEditModal(true);
    setOpenDropdown(null);
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const getBadgeColor = (textColor) => {
    const colorMap = {
      info: 'bg-blue-100 text-blue-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800'
    };
    return colorMap[textColor] || 'bg-gray-100 text-gray-800';
  };

  const getBadgeText = (textColor) => {
    const textMap = {
      info: 'Info',
      secondary: 'Secondary',
      success: 'Success',
      warning: 'Warning',
      danger: 'Danger'
    };
    return textMap[textColor] || 'Info';
  };

  return (
    <div className="p-0 sm:p-4 lg:p-4 space-y-4 sm:space-y-6" onClick={closeDropdown}>
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add Statuses</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-2 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
        >
          <i className="fas fa-plus"></i>
          <span className="hidden sm:inline">Add Statuses</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex space-x-1 sm:space-x-4">
            <div className="relative tooltip-container">
              <button className="p-1.5 sm:p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                <i className="fas fa-sync-alt"></i>
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <div className="tooltip tooltip-bottom">
                Refresh Data
                <div className="tooltip-arrow tooltip-arrow-bottom"></div>
              </div>
            </div>
            <div className="relative tooltip-container">
              <button className="p-1.5 sm:p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                <i className="fas fa-th-list"></i>
                <span className="hidden sm:inline">Columns</span>
                <i className="fas fa-chevron-down"></i>
              </button>
              <div className="tooltip tooltip-bottom">
                Column Settings
                <div className="tooltip-arrow tooltip-arrow-bottom"></div>
              </div>
            </div>
            <div className="relative tooltip-container">
              <button className="p-1.5 sm:p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                <i className="fas fa-download"></i>
                <span className="hidden sm:inline">Export</span>
                <i className="fas fa-chevron-down"></i>
              </button>
              <div className="tooltip tooltip-bottom">
                Export Data
                <div className="tooltip-arrow tooltip-arrow-bottom"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-32 sm:w-48 lg:w-64 pl-3 sm:pl-4 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Statuses Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Text Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStatuses.map(status => (
              <tr key={status.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {status.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(status.textColor)}`}>
                    {getBadgeText(status.textColor)}
                  </span>
                </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   <div className="relative">
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         toggleDropdown(status.id);
                       }}
                       className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                     >
                       <i className="fas fa-ellipsis-v"></i>
                     </button>
                                           {openDropdown === status.id && (
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                         <div className="py-1">
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               openEditModal(status);
                             }}
                             className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                           >
                             <i className="fas fa-pencil-alt"></i>
                             <span>Edit</span>
                           </button>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               handleDeleteStatus(status.id);
                             }}
                             className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                           >
                             <i className="far fa-trash-alt"></i>
                             <span>Delete</span>
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

      {/* Add Status Modal */}
      {showAddModal && (
        <div className="fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Statuses</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleAddStatus(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newStatus.type}
                      onChange={(e) => setNewStatus({...newStatus, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Color <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newStatus.textColor}
                      onChange={(e) => setNewStatus({...newStatus, textColor: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="info">Info</option>
                      <option value="secondary">Secondary</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="danger">Danger</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {showEditModal && editingStatus && (
        <div className="fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Statuses</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleEditStatus(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingStatus.type}
                      onChange={(e) => setEditingStatus({...editingStatus, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Color <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editingStatus.textColor}
                      onChange={(e) => setEditingStatus({...editingStatus, textColor: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="info">Info</option>
                      <option value="secondary">Secondary</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="danger">Danger</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit
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

export default Statuses; 