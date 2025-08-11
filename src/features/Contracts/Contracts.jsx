import React, { useState } from 'react';

function Contracts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [editingType, setEditingType] = useState(null);

  // Mock data for contracts
  const [contracts, setContracts] = useState([
    {
      id: 1,
      title: 'Website Development Contract',
      description: 'Full website development for TechCorp',
      client: 'John Smith',
      project: 'Website Redesign',
      contractType: 'Development',
      value: '$25,000',
      signedStatus: 'Signed',
      startDate: '2024-01-15',
      endDate: '2024-06-15'
    },
    {
      id: 2,
      title: 'Mobile App Development',
      description: 'iOS and Android app development',
      client: 'Sarah Davis',
      project: 'Mobile App Launch',
      contractType: 'Development',
      value: '$45,000',
      signedStatus: 'Pending',
      startDate: '2024-02-01',
      endDate: '2024-08-01'
    },
    {
      id: 3,
      title: 'Consulting Services',
      description: 'Business strategy consulting',
      client: 'Michael Brown',
      project: 'Business Optimization',
      contractType: 'Consulting',
      value: '$15,000',
      signedStatus: 'Signed',
      startDate: '2024-01-01',
      endDate: '2024-03-31'
    }
  ]);

  // Mock data for contract types
  const [contractTypes, setContractTypes] = useState([
    { id: 1, name: 'Development' },
    { id: 2, name: 'Consulting' },
    { id: 3, name: 'Design' },
    { id: 4, name: 'Marketing' }
  ]);

  // Mock data for projects
  const projects = [
    'Website Redesign',
    'Mobile App Launch',
    'Business Optimization',
    'Product Launch Campaign',
    'IT Infrastructure Upgrade'
  ];

  // Mock data for users
  const users = [
    'John Smith',
    'Sarah Davis',
    'Michael Brown',
    'Emily Johnson',
    'Christopher Wilson'
  ];

  const handleAddContract = (contractData) => {
    const newContract = {
      id: contracts.length + 1,
      ...contractData
    };
    setContracts([...contracts, newContract]);
    setShowAddModal(false);
  };

  const handleEditContract = (contractData) => {
    setContracts(contracts.map(contract => 
      contract.id === editingContract.id ? { ...contract, ...contractData } : contract
    ));
    setEditingContract(null);
    setShowAddModal(false);
  };

  const handleDeleteContract = (id) => {
    setContracts(contracts.filter(contract => contract.id !== id));
  };

  const handleAddContractType = (typeData) => {
    const newType = {
      id: contractTypes.length + 1,
      ...typeData
    };
    setContractTypes([...contractTypes, newType]);
    setShowAddTypeModal(false);
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = !selectedProject || contract.project === selectedProject;
    const matchesUser = !selectedUser || contract.client === selectedUser;
    return matchesSearch && matchesProject && matchesUser;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Signed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-0 sm:p-4 lg:p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Contracts</h1>
          <div className="flex space-x-1 sm:space-x-3">
            <button
              onClick={() => setShowAddTypeModal(true)}
              className="bg-blue-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
            >
              <i className="fas fa-list"></i>
              <span className="hidden sm:inline">Add Contracts Type</span>
              <span className="sm:hidden">Add Type</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
            >
              <i className="fas fa-plus"></i>
              <span className="hidden sm:inline">Create Contracts</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Project</option>
              {projects.map((project, index) => (
                <option key={index} value={project}>{project}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Users</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Users</option>
              {users.map((user, index) => (
                <option key={index} value={user}>{user}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-blue-600 text-white px-2 py-1.5 sm:px-6 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex space-x-1 sm:space-x-2">
              <div className="relative tooltip-container">
                <button className="bg-gray-200 text-gray-700 p-1.5 sm:p-2 rounded hover:bg-gray-300 transition-colors text-sm sm:text-base">
                  <i className="fas fa-sync-alt"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Refresh
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
              <div className="relative tooltip-container">
                <button className="bg-gray-200 text-gray-700 p-1.5 sm:p-2 rounded hover:bg-gray-300 transition-colors text-sm sm:text-base">
                  <i className="fas fa-th-list"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Columns
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
              <div className="relative tooltip-container">
                <button className="bg-gray-200 text-gray-700 p-1.5 sm:p-2 rounded hover:bg-gray-300 transition-colors text-sm sm:text-base">
                  <i className="fas fa-download"></i>
                </button>
                <div className="tooltip tooltip-bottom">
                  Export
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center ml-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 lg:w-64 pl-3 sm:pl-4 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signed Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.project}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.contractType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contract.signedStatus)}`}>
                      {contract.signedStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingContract(contract);
                          setShowAddModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteContract(contract.id)}
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
          {filteredContracts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No matching records found
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Contract Modal */}
      {showAddModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingContract ? 'Edit Contracts' : 'Create Contracts'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingContract(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const contractData = {
                title: formData.get('title'),
                description: formData.get('description'),
                client: formData.get('client'),
                project: formData.get('project'),
                contractType: formData.get('contractType'),
                value: formData.get('value'),
                signedStatus: formData.get('signedStatus'),
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate')
              };

              if (editingContract) {
                handleEditContract(contractData);
              } else {
                handleAddContract(contractData);
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingContract?.title || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingContract?.description || ''}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                  <select
                    name="client"
                    defaultValue={editingContract?.client || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Client</option>
                    {users.map((user, index) => (
                      <option key={index} value={user}>{user}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
                  <select
                    name="project"
                    defaultValue={editingContract?.project || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Project</option>
                    {projects.map((project, index) => (
                      <option key={index} value={project}>{project}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contract Type *</label>
                  <select
                    name="contractType"
                    defaultValue={editingContract?.contractType || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose Contracts Type...</option>
                    {contractTypes.map((type) => (
                      <option key={type.id} value={type.name}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value *</label>
                  <input
                    type="text"
                    name="value"
                    defaultValue={editingContract?.value || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Signed Status</label>
                  <select
                    name="signedStatus"
                    defaultValue={editingContract?.signedStatus || 'Pending'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Signed">Signed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={editingContract?.startDate || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={editingContract?.endDate || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingContract(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingContract ? 'Update Contracts' : 'Create Contracts'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Contract Type Modal */}
      {showAddTypeModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Contracts Type</h3>
              <button
                onClick={() => setShowAddTypeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const typeData = {
                name: formData.get('name')
              };
              handleAddContractType(typeData);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Type Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddTypeModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Contracts Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contracts; 