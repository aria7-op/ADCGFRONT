import React, { useState } from 'react';

function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Mock data for clients
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Solutions Inc.',
      status: 'Active',
      projects: 5,
      totalRevenue: '$125,000',
      joinDate: '2024-01-15',
      avatar: 'JS'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@enterprise.com',
      phone: '+1 (555) 234-5678',
      company: 'Enterprise Corp',
      status: 'Active',
      projects: 3,
      totalRevenue: '$89,500',
      joinDate: '2024-02-20',
      avatar: 'SJ'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@startup.com',
      phone: '+1 (555) 345-6789',
      company: 'Startup Ventures',
      status: 'Inactive',
      projects: 1,
      totalRevenue: '$45,000',
      joinDate: '2024-03-10',
      avatar: 'MB'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@consulting.com',
      phone: '+1 (555) 456-7890',
      company: 'Consulting Partners',
      status: 'Active',
      projects: 7,
      totalRevenue: '$210,000',
      joinDate: '2023-11-05',
      avatar: 'ED'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@retail.com',
      phone: '+1 (555) 567-8901',
      company: 'Retail Solutions',
      status: 'Pending',
      projects: 0,
      totalRevenue: '$0',
      joinDate: '2024-04-01',
      avatar: 'DW'
    }
  ]);

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Active'
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '' || client.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const activeClients = clients.filter(client => client.status === 'Active').length;
  const totalRevenue = clients.reduce((sum, client) => {
    const revenue = parseFloat(client.totalRevenue.replace(/[$,]/g, ''));
    return sum + revenue;
  }, 0);

  const handleAddClient = () => {
    if (newClient.name && newClient.email && newClient.company) {
      const client = {
        id: clients.length + 1,
        ...newClient,
        projects: 0,
        totalRevenue: '$0',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: newClient.name.split(' ').map(n => n[0]).join('').toUpperCase()
      };
      setClients([...clients, client]);
      setNewClient({ name: '', email: '', phone: '', company: '', status: 'Active' });
      setShowAddModal(false);
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setNewClient({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      status: client.status
    });
    setShowAddModal(true);
  };

  const handleUpdateClient = () => {
    if (editingClient && newClient.name && newClient.email && newClient.company) {
      const updatedClients = clients.map(client => 
        client.id === editingClient.id 
          ? { ...client, ...newClient }
          : client
      );
      setClients(updatedClients);
      setNewClient({ name: '', email: '', phone: '', company: '', status: 'Active' });
      setEditingClient(null);
      setShowAddModal(false);
    }
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with white card design */}
      <div className="p-0 sm:p-4 lg:p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex justify-between items-center">
          <h1 className="text-gray-900 text-xl font-bold">Clients</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <i className="fas fa-plus"></i>
            <span className="hidden sm:inline">Add Client</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="p-0 sm:p-4 lg:p-6">

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Clients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <i className="fas fa-users text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
          </div>
        </div>

        {/* Active Clients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="fas fa-user-check text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">{activeClients}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <i className="fas fa-dollar-sign text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Average Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <i className="fas fa-project-diagram text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Projects</p>
              <p className="text-2xl font-bold text-gray-900">
                {clients.length > 0 ? (clients.reduce((sum, client) => sum + client.projects, 0) / clients.length).toFixed(1) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

             {/* Filters */}
       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
         <div className="flex flex-col sm:flex-row gap-4">
           {/* Search */}
           <div className="flex-1">
             <input
               type="text"
               placeholder="Search clients..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             />
           </div>

           {/* Status Filter */}
           <div className="sm:w-48">
             <select
               value={selectedStatus}
               onChange={(e) => setSelectedStatus(e.target.value)}
               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             >
               <option value="">All Status</option>
               <option value="Active">Active</option>
               <option value="Inactive">Inactive</option>
               <option value="Pending">Pending</option>
             </select>
           </div>
         </div>
       </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                          {client.avatar}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.projects}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.totalRevenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(client.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClient(client)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
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

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No clients found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={newClient.company}
                  onChange={(e) => setNewClient({...newClient, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newClient.status}
                  onChange={(e) => setNewClient({...newClient, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingClient(null);
                  setNewClient({ name: '', email: '', phone: '', company: '', status: 'Active' });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingClient ? handleUpdateClient : handleAddClient}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingClient ? 'Update' : 'Add'} Client
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Clients; 