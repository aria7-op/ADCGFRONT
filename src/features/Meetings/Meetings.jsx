import React, { useState } from 'react';

function Meetings() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showClientsModal, setShowClientsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [editingMeeting, setEditingMeeting] = useState(null);

  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: 'Project Kickoff Meeting',
      createdBy: 'John Smith',
      type: 'Virtual',
      platform: 'Zoom',
      link: 'https://zoom.us/j/123456789',
      venue: 'Conference Room A',
      startDate: '2025-01-20 10:00:00',
      endDate: '2025-01-20 11:00:00',
      status: 'Upcoming',
      users: ['John Smith', 'Jane Doe'],
      clients: ['Client A', 'Client B']
    },
    {
      id: 2,
      title: 'Weekly Team Sync',
      createdBy: 'Jane Doe',
      type: 'Physical',
      platform: 'Microsoft Teams',
      link: '-',
      venue: 'Main Office',
      startDate: '2025-01-22 14:00:00',
      endDate: '2025-01-22 15:00:00',
      status: 'Scheduled',
      users: ['John Smith', 'Jane Doe', 'Mike Johnson'],
      clients: []
    },
    {
      id: 3,
      title: 'Client Presentation',
      createdBy: 'Mike Johnson',
      type: 'Virtual',
      platform: 'Google Meet',
      link: 'https://meet.google.com/abc-defg-hij',
      venue: '-',
      startDate: '2025-01-25 09:00:00',
      endDate: '2025-01-25 10:30:00',
      status: 'Upcoming',
      users: ['Mike Johnson', 'Sarah Wilson'],
      clients: ['Client C', 'Client D']
    }
  ]);

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    type: '',
    platform: '',
    link: '',
    venue: '',
    startDate: '',
    endDate: '',
    users: [],
    clients: []
  });

  const totalMeetings = meetings.length;
  const upcomingMeetings = meetings.filter(meeting => meeting.status === 'Upcoming').length;
  const completedMeetings = meetings.filter(meeting => meeting.status === 'Completed').length;

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddMeeting = () => {
    const newMeetingData = {
      id: meetings.length + 1,
      ...newMeeting,
      createdBy: 'Current User',
      status: 'Scheduled'
    };
    setMeetings([...meetings, newMeetingData]);
    setNewMeeting({
      title: '',
      type: '',
      platform: '',
      link: '',
      venue: '',
      startDate: '',
      endDate: '',
      users: [],
      clients: []
    });
    setShowAddModal(false);
  };

  const handleEditMeeting = () => {
    const updatedMeetings = meetings.map(meeting =>
      meeting.id === editingMeeting.id ? { ...meeting, ...editingMeeting } : meeting
    );
    setMeetings(updatedMeetings);
    setEditingMeeting(null);
    setShowEditModal(false);
  };

  const handleDeleteMeeting = (id) => {
    setMeetings(meetings.filter(meeting => meeting.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-0 sm:p-4 lg:p-4 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Meetings</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-2 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
        >
          <i className="fas fa-plus"></i>
          <span className="hidden sm:inline">Create Meeting</span>
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
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <input
              type="text"
              placeholder="Meeting dates between range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button className="px-2 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base">
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Meetings Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Users
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clients
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Link
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Venue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Starts On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ends On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMeetings.map(meeting => (
              <tr key={meeting.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {meeting.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {meeting.createdBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setShowUsersModal(true)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Click to see meeting users"
                  >
                    <img
                      src="https://ui-avatars.com/api/?name=User&background=random"
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setShowClientsModal(true)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Click to see meeting clients"
                  >
                    <img
                      src="https://ui-avatars.com/api/?name=Client&background=random"
                      alt="Client"
                      className="w-8 h-8 rounded-full"
                    />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {meeting.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {meeting.platform}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {meeting.link !== '-' ? (
                    <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      Meeting link <i className="fas fa-link"></i>
                    </a>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {meeting.venue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(meeting.startDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(meeting.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="relative">
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setEditingMeeting(meeting);
                            setShowEditModal(true);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <i className="fas fa-pencil-alt mr-2"></i>Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <i className="far fa-trash-alt mr-2"></i>Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Meeting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create Meeting</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleAddMeeting(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newMeeting.type}
                      onChange={(e) => setNewMeeting({...newMeeting, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Virtual">Virtual</option>
                      <option value="Physical">Physical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <input
                      type="text"
                      value={newMeeting.platform}
                      onChange={(e) => setNewMeeting({...newMeeting, platform: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                    <input
                      type="url"
                      value={newMeeting.link}
                      onChange={(e) => setNewMeeting({...newMeeting, link: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                    <input
                      type="text"
                      value={newMeeting.venue}
                      onChange={(e) => setNewMeeting({...newMeeting, venue: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="datetime-local"
                      value={newMeeting.startDate}
                      onChange={(e) => setNewMeeting({...newMeeting, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="datetime-local"
                      value={newMeeting.endDate}
                      onChange={(e) => setNewMeeting({...newMeeting, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
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
                    Create Meeting
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Meeting Modal */}
      {showEditModal && editingMeeting && (
        <div className="fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Meeting</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleEditMeeting(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingMeeting.title}
                      onChange={(e) => setEditingMeeting({...editingMeeting, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={editingMeeting.type}
                      onChange={(e) => setEditingMeeting({...editingMeeting, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Virtual">Virtual</option>
                      <option value="Physical">Physical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <input
                      type="text"
                      value={editingMeeting.platform}
                      onChange={(e) => setEditingMeeting({...editingMeeting, platform: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                    <input
                      type="url"
                      value={editingMeeting.link}
                      onChange={(e) => setEditingMeeting({...editingMeeting, link: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                    <input
                      type="text"
                      value={editingMeeting.venue}
                      onChange={(e) => setEditingMeeting({...editingMeeting, venue: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="datetime-local"
                      value={editingMeeting.startDate}
                      onChange={(e) => setEditingMeeting({...editingMeeting, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="datetime-local"
                      value={editingMeeting.endDate}
                      onChange={(e) => setEditingMeeting({...editingMeeting, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update Meeting
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Users Modal */}
      {showUsersModal && (
        <div className="fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Meeting Users</h3>
                <button
                  onClick={() => setShowUsersModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Users participating in this meeting:</p>
                <ul className="space-y-1">
                  <li className="flex items-center space-x-2">
                    <img src="https://ui-avatars.com/api/?name=John+Smith&background=random" alt="User" className="w-6 h-6 rounded-full" />
                    <span className="text-sm">John Smith</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=random" alt="User" className="w-6 h-6 rounded-full" />
                    <span className="text-sm">Jane Doe</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clients Modal */}
      {showClientsModal && (
        <div className="fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Meeting Clients</h3>
                <button
                  onClick={() => setShowClientsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Clients participating in this meeting:</p>
                <ul className="space-y-1">
                  <li className="flex items-center space-x-2">
                    <img src="https://ui-avatars.com/api/?name=Client+A&background=random" alt="Client" className="w-6 h-6 rounded-full" />
                    <span className="text-sm">Client A</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <img src="https://ui-avatars.com/api/?name=Client+B&background=random" alt="Client" className="w-6 h-6 rounded-full" />
                    <span className="text-sm">Client B</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Meetings; 