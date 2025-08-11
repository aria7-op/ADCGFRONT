import React, { useState, useRef, useEffect } from 'react';

function Chat() {
  const [selectedUser, setSelectedUser] = useState('');
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const messagesEndRef = useRef(null);

  const users = [
    { id: 1, name: 'Main Admin', status: 'online', unread: 0, isYou: true },
    { id: 2, name: 'John Smith', status: 'offline', unread: 0 },
    { id: 5, name: 'Sarah Davis', status: 'offline', unread: 0 },
    { id: 7, name: 'Jessica Martinez', status: 'offline', unread: 0 },
    { id: 23, name: 'James Anderson', status: 'offline', unread: 2 }
  ];

  const groups = [
    { id: 1, name: '465', type: 'group' },
    { id: 2, name: 'Amazon Group', type: 'group' },
    { id: 3, name: 'attendence', type: 'group' },
    { id: 4, name: 'contact new', type: 'group' },
    { id: 5, name: 'jvjl', type: 'group' },
    { id: 6, name: 'Meeting Call', type: 'group' },
    { id: 7, name: 'terget bundle Project', type: 'group' },
    { id: 8, name: 'you', type: 'group' }
  ];

  const sampleMessages = [
    {
      id: 1,
      sender: 'Main Admin',
      message: 'Hello! How are you doing today?',
      time: '10:30 AM',
      isOwn: true
    },
    {
      id: 2,
      sender: 'John Smith',
      message: 'Hi! I\'m doing great, thanks for asking.',
      time: '10:32 AM',
      isOwn: false
    }
  ];

  const [messages, setMessages] = useState(sampleMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'Main Admin',
        message: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    setSelectedChat(users.find(user => user.id === userId));
  };

  const handleGroupSelect = (groupId) => {
    setSelectedUser(groupId);
    setSelectedChat(groups.find(group => group.id === groupId));
  };

  return (
    <div className="p-0 sm:p-4 lg:p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Chat Box</h1>
          <button className="text-gray-600 hover:text-gray-800">
            <i className="fas fa-expand text-xl"></i>
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Contacts */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            {/* User Selection Dropdown */}
            <div className="p-4">
              <select
                value={selectedUser}
                onChange={(e) => handleUserSelect(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Type to search and select users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Personal Chat Section */}
            <div className="border-t border-gray-700">
              <div className="px-4 py-2 bg-gray-800">
                <h4 className="text-gray-300 font-semibold">Personal Chat</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <ul className="space-y-1">
                  {users.map(user => (
                    <li key={user.id}>
                      <button
                        onClick={() => handleUserSelect(user.id)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors ${
                          selectedChat?.id === user.id ? 'bg-gray-800 text-white' : 'text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <i className={`fas fa-circle text-xs ${
                              user.status === 'online' ? 'text-green-500' : 'text-gray-500'
                            }`}></i>
                            <span className="font-medium">{user.name}{user.isYou ? ' (You)' : ''}</span>
                          </div>
                          {user.unread > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {user.unread}
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Group Chat Section */}
            <div className="border-t border-gray-700">
              <div className="px-4 py-2 bg-gray-800 flex items-center justify-between">
                <h4 className="text-gray-300 font-semibold">Group Chat</h4>
                <button className="text-blue-400 hover:text-blue-300">
                  <i className="fas fa-plus-circle"></i>
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <ul className="space-y-1">
                  {groups.map(group => (
                    <li key={group.id}>
                      <button
                        onClick={() => handleGroupSelect(group.id)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors ${
                          selectedChat?.id === group.id ? 'bg-gray-800 text-white' : 'text-gray-300'
                        }`}
                      >
                        <span className="font-medium"># {group.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gray-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {selectedChat ? (selectedChat.name.charAt(0) + selectedChat.name.charAt(1)).toUpperCase() : 'CH'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      {selectedChat ? selectedChat.name : 'Select a chat'}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {selectedChat ? (selectedChat.type === 'group' ? 'Group' : 'Online') : 'No chat selected'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-300 hover:text-white p-2">
                    <i className="fas fa-search"></i>
                  </button>
                  <button className="text-gray-300 hover:text-white p-2">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-96 bg-gray-100 p-4 overflow-y-auto">
              {selectedChat ? (
                <div className="space-y-4">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.isOwn 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}>
                        <div className="text-sm font-medium mb-1">
                          {msg.sender}
                        </div>
                        <div className="text-sm">
                          {msg.message}
                        </div>
                        <div className={`text-xs mt-1 ${
                          msg.isOwn ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <i className="fas fa-comments text-4xl mb-4"></i>
                    <p>Select a chat to start messaging</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            {selectedChat && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="text-gray-500 hover:text-gray-700 p-2">
                    <i className="fas fa-paperclip"></i>
                  </button>
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="2"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat; 