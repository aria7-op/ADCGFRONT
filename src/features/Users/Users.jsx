import React, { useState, useEffect, useRef } from 'react';

function Users() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Administrator',
      status: 'Active',
      department: 'IT',
      phone: '+1 (555) 123-4567',
      joinDate: '2024-01-15',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Manager',
      status: 'Active',
      department: 'Marketing',
      phone: '+1 (555) 234-5678',
      joinDate: '2024-02-20',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
    }
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active',
    department: '',
    phone: '',
    joinDate: ''
  });

  const roles = ['Administrator', 'Manager', 'Developer', 'Designer', 'Analyst'];
  const departments = ['IT', 'Marketing', 'Design', 'Finance', 'HR', 'Sales'];
  const statuses = ['Active', 'Inactive'];

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'Active').length;
  const inactiveUsers = users.filter(user => user.status === 'Inactive').length;
  const newUsersThisMonth = users.filter(user => {
    const joinDate = new Date(user.joinDate);
    const currentDate = new Date();
    return joinDate.getMonth() === currentDate.getMonth() && 
           joinDate.getFullYear() === currentDate.getFullYear();
  }).length;

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === '' || user.role === selectedRole;
    const matchesStatus = selectedStatus === '' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      const user = {
        id: users.length + 1,
        ...newUser,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=random`
      };
      setUsers([user, ...users]);
      setNewUser({ name: '', email: '', role: '', status: 'Active', department: '', phone: '', joinDate: '' });
      setShowAddModal(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      department: user.department,
      phone: user.phone,
      joinDate: user.joinDate
    });
    setShowAddModal(true);
  };

  const handleUpdateUser = () => {
    if (editingUser && newUser.name && newUser.email && newUser.role) {
      const updatedUsers = users.map(user => 
        user.id === editingUser.id ? { ...user, ...newUser } : user
      );
      setUsers(updatedUsers);
      setNewUser({ name: '', email: '', role: '', status: 'Active', department: '', phone: '', joinDate: '' });
      setEditingUser(null);
      setShowAddModal(false);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-0 sm:p-4 lg:p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex justify-between items-center">
          <h1 className="text-gray-900 text-xl sm:text-2xl font-bold">Users</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <i className="fas fa-plus"></i>
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="p-0 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <i className="fas fa-users text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                <p className="text-sm text-gray-500">All users</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <i className="fas fa-user-check text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
                <p className="text-sm text-gray-500">Currently active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <i className="fas fa-user-times text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-gray-900">{inactiveUsers}</p>
                <p className="text-sm text-gray-500">Suspended accounts</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <i className="fas fa-user-plus text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">{newUsersThisMonth}</p>
                <p className="text-sm text-gray-500">Recently joined</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-32 sm:w-48 lg:w-64 pl-3 sm:pl-4 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                />
              </div>
              <div className="flex gap-1">
                <div className="relative tooltip-container">
                  <button className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors text-sm sm:text-base">
                    <i className="fas fa-sync-alt"></i>
                  </button>
                  <div className="tooltip tooltip-bottom">
                    Refresh
                    <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                  </div>
                </div>
                <div className="relative tooltip-container">
                  <button className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors text-sm sm:text-base">
                    <i className="fas fa-th-large"></i>
                  </button>
                  <div className="tooltip tooltip-bottom">
                    View Options
                    <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                  </div>
                </div>
                <div className="relative tooltip-container">
                  <button className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors text-sm sm:text-base">
                    <i className="fas fa-download"></i>
                  </button>
                  <div className="tooltip tooltip-bottom">
                    Export
                    <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                  </div>
                </div>
                <div className="relative tooltip-container">
                  <button className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors text-sm sm:text-base">
                    <i className="fas fa-chevron-down"></i>
                  </button>
                  <div className="tooltip tooltip-bottom">
                    More Options
                    <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          {currentUsers.length > 0 ? (
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                          <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" src={user.avatar} alt={user.name} />
                        </div>
                        <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{user.name}</div>
                          <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{user.role}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{user.department}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      <div className="truncate max-w-24 sm:max-w-32" title={user.phone}>{user.phone}</div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">{user.joinDate}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium">
                      <div className="relative" ref={dropdownRef}>
                        <button 
                          onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                        >
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                        {openDropdown === user.id && (
                          <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  handleEditUser(user);
                                  setOpenDropdown(null);
                                }}
                                className="block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                              >
                                <i className="fas fa-pencil-alt"></i>
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteUser(user.id);
                                  setOpenDropdown(null);
                                }}
                                className="block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
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
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-700">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1.5 sm:px-3 sm:py-1 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-2 py-1.5 sm:px-3 sm:py-1 text-xs sm:text-sm border rounded-md ${
                      currentPage === number
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1.5 sm:px-3 sm:py-1 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingUser ? 'Edit User' : 'Add User'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                  setNewUser({ name: '', email: '', role: '', status: 'Active', department: '', phone: '', joinDate: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <input
                  type="date"
                  value={newUser.joinDate}
                  onChange={(e) => setNewUser({...newUser, joinDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                  setNewUser({ name: '', email: '', role: '', status: 'Active', department: '', phone: '', joinDate: '' });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingUser ? handleUpdateUser : handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingUser ? 'Update' : 'Add'} User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users; 