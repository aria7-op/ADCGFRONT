import React, { useState } from 'react';

function Leads() {
  const [leads, setLeads] = useState([
    {
      id: 1,
      title: 'Est soluta repellend',
      company: 'Deserunt voluptate a',
      status: 'qualified',
      date: '1992-04-25 07:45:00',
      assignedTo: 'MA',
      email: 'lead1@company.com',
      phone: '+1 (555) 123-4567',
      value: '$25,000'
    },
    {
      id: 2,
      title: 'Video Graphics',
      company: 'aaaaaaaa',
      status: 'discussion',
      date: '2025-03-20 15:21:00',
      assignedTo: 'MA',
      email: 'lead2@company.com',
      phone: '+1 (555) 234-5678',
      value: '$15,000'
    },
    {
      id: 3,
      title: 's',
      company: 's',
      status: 'new',
      date: '2025-03-20 15:21:00',
      assignedTo: 'MA',
      email: 'lead3@company.com',
      phone: '+1 (555) 345-6789',
      value: '$10,000'
    },
    {
      id: 4,
      title: 'Web Development',
      company: 'TechCorp',
      status: 'won',
      date: '2025-03-19 10:30:00',
      assignedTo: 'JD',
      email: 'lead4@company.com',
      phone: '+1 (555) 456-7890',
      value: '$50,000'
    },
    {
      id: 5,
      title: 'Mobile App',
      company: 'AppStudio',
      status: 'lost',
      date: '2025-03-18 14:15:00',
      assignedTo: 'SM',
      email: 'lead5@company.com',
      phone: '+1 (555) 567-8901',
      value: '$30,000'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [draggedLead, setDraggedLead] = useState(null);

  // Status configurations
  const statusConfig = {
    new: { label: 'New', color: 'bg-blue-500', count: 0 },
    qualified: { label: 'Qualified', color: 'bg-yellow-500', count: 0 },
    discussion: { label: 'Discussion', color: 'bg-purple-500', count: 0 },
    won: { label: 'Won', color: 'bg-green-500', count: 0 },
    lost: { label: 'Lost', color: 'bg-red-500', count: 0 }
  };

  // Filter leads based on search and status
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Group leads by status
  const leadsByStatus = filteredLeads.reduce((acc, lead) => {
    if (!acc[lead.status]) {
      acc[lead.status] = [];
    }
    acc[lead.status].push(lead);
    return acc;
  }, {});

  // Update status counts
  Object.keys(statusConfig).forEach(status => {
    statusConfig[status].count = leadsByStatus[status]?.length || 0;
  });

  // Drag and drop handlers
  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (draggedLead && draggedLead.status !== targetStatus) {
      const updatedLeads = leads.map(lead => 
        lead.id === draggedLead.id 
          ? { ...lead, status: targetStatus }
          : lead
      );
      setLeads(updatedLeads);
    }
    setDraggedLead(null);
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
  };

  // Add new lead
  const handleAddLead = (newLead) => {
    setLeads([...leads, { ...newLead, id: Date.now() }]);
    setShowAddModal(false);
  };

  // Edit lead
  const handleEditLead = (updatedLead) => {
    setLeads(leads.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    setEditingLead(null);
  };

  // Delete lead
  const handleDeleteLead = (leadId) => {
    setLeads(leads.filter(lead => lead.id !== leadId));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Leads</h1>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i className={`fas fa-${viewMode === 'grid' ? 'list' : 'th-large'} mr-2`}></i>
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Lead
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setSearchTerm(''); setSelectedStatus(''); }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Grid View - Kanban Board */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div
              key={status}
              className={`bg-gray-50 rounded-lg p-4 transition-all duration-200 ${
                draggedLead && draggedLead.status !== status ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                  <h3 className="font-semibold text-gray-900">{config.label}</h3>
                </div>
                <span className="bg-white text-gray-600 text-sm font-medium px-2 py-1 rounded-full">
                  {config.count}
                </span>
              </div>
              
              <div className="space-y-3">
                {leadsByStatus[status]?.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all duration-200 ${
                      draggedLead?.id === lead.id ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{lead.title}</h4>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingLead(lead)}
                          className="text-gray-400 hover:text-blue-600 p-1"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{lead.company}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(lead.date)}</span>
                      <span className="font-medium text-green-600">{lead.value}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{lead.assignedTo}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        <i className="fas fa-envelope mr-1"></i>
                        {lead.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.title}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        statusConfig[lead.status]?.color === 'bg-blue-500' ? 'bg-blue-100 text-blue-800' :
                        statusConfig[lead.status]?.color === 'bg-yellow-500' ? 'bg-yellow-100 text-yellow-800' :
                        statusConfig[lead.status]?.color === 'bg-purple-500' ? 'bg-purple-100 text-purple-800' :
                        statusConfig[lead.status]?.color === 'bg-green-500' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {statusConfig[lead.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{lead.assignedTo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {lead.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lead.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingLead(lead)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="text-red-600 hover:text-red-900"
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
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Lead</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleAddLead({
                  title: formData.get('title'),
                  company: formData.get('company'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  status: formData.get('status'),
                  value: formData.get('value'),
                  assignedTo: formData.get('assignedTo'),
                  date: new Date().toISOString()
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      name="company"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Value</label>
                    <input
                      type="text"
                      name="value"
                      placeholder="$0"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                    <input
                      type="text"
                      name="assignedTo"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Lead</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleEditLead({
                  ...editingLead,
                  title: formData.get('title'),
                  company: formData.get('company'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  status: formData.get('status'),
                  value: formData.get('value'),
                  assignedTo: formData.get('assignedTo')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingLead.title}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      name="company"
                      defaultValue={editingLead.company}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingLead.email}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={editingLead.phone}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      defaultValue={editingLead.status}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Value</label>
                    <input
                      type="text"
                      name="value"
                      defaultValue={editingLead.value}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                    <input
                      type="text"
                      name="assignedTo"
                      defaultValue={editingLead.assignedTo}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingLead(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update Lead
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

export default Leads; 