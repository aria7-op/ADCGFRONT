import React, { useState } from 'react';

function Notes() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'PC Needs Review',
      content: 'Update All PC Updates gfd',
      category: 'Work',
      tags: ['pc', 'updates'],
      color: 'green',
      isPinned: false,
      createdAt: '12-Jun-2025',
      updatedAt: '12-Jun-2025'
    },
    {
      id: 2,
      title: 'FGTYRT',
      content: 'TYRTY',
      category: 'Personal',
      tags: ['personal'],
      color: 'yellow',
      isPinned: false,
      createdAt: '27-Nov-2024',
      updatedAt: '27-Nov-2024'
    },
    {
      id: 3,
      title: 'PC Needs Review',
      content: 'Update All PC Updates',
      category: 'Work',
      tags: ['pc', 'updates'],
      color: 'green',
      isPinned: false,
      createdAt: '04-Apr-2025',
      updatedAt: '04-Apr-2025'
    },
    {
      id: 4,
      title: 'dsd',
      content: 'sds',
      category: 'Personal',
      tags: ['personal'],
      color: 'yellow',
      isPinned: false,
      createdAt: '09-Apr-2025',
      updatedAt: '09-Apr-2025'
    },
    {
      id: 5,
      title: 'fgdfgdfg',
      content: 'fdgfdgd',
      category: 'Ideas',
      tags: ['ideas'],
      color: 'pink',
      isPinned: false,
      createdAt: '23-Jul-2024',
      updatedAt: '23-Jul-2024'
    },
    {
      id: 6,
      title: 'Notes from a client call.',
      content: 'Detailed notes summarizing key points, discussions, and action items from a recent call with a client, including client requirements, project updates, and follow-up tasks.',
      category: 'Work',
      tags: ['client', 'meeting'],
      color: 'green',
      isPinned: false,
      createdAt: '18-May-2024',
      updatedAt: '18-May-2024'
    },
    {
      id: 7,
      title: 'Notes from a client call.',
      content: 'Detailed notes summarizing key points, discussions, and action items from a recent call with a client, including client',
      category: 'Work',
      tags: ['client', 'meeting'],
      color: 'green',
      isPinned: false,
      createdAt: '18-May-2024',
      updatedAt: '18-May-2024'
    },
    {
      id: 8,
      title: 'demo1',
      content: 'hello',
      category: 'Personal',
      tags: ['demo'],
      color: 'pink',
      isPinned: false,
      createdAt: '30-Mar-2024',
      updatedAt: '30-Mar-2024'
    },
    {
      id: 9,
      title: 'demo1',
      content: 'hello',
      category: 'Personal',
      tags: ['demo'],
      color: 'pink',
      isPinned: false,
      createdAt: '30-Mar-2024',
      updatedAt: '30-Mar-2024'
    }
  ]);

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    color: 'blue'
  });

  const categories = ['Work', 'Personal', 'Ideas', 'Tasks'];
  const colors = ['blue', 'green', 'purple', 'orange', 'red', 'yellow'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddNote = () => {
    const newNoteData = {
      id: notes.length + 1,
      ...newNote,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isPinned: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setNotes([...notes, newNoteData]);
    setNewNote({
      title: '',
      content: '',
      category: '',
      tags: '',
      color: 'blue'
    });
    setShowAddModal(false);
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      orange: 'bg-orange-50 border-orange-200',
      red: 'bg-red-50 border-red-200',
      yellow: 'bg-yellow-50 border-yellow-200'
    };
    return colorMap[color] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="p-0 sm:p-4 lg:p-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notes</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-2 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
        >
          <i className="fas fa-plus"></i>
          <span className="hidden sm:inline">New Note</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Grid - Sticky Note Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
        {filteredNotes.map((note, index) => {
          // Create random rotation for sticky note effect
          const rotation = (index % 3 - 1) * 2; // -2, 0, or 2 degrees
          const colors = ['bg-green-100', 'bg-yellow-100', 'bg-pink-100'];
          const noteColor = colors[index % colors.length];
          
          return (
            <div
              key={note.id}
              className={`${noteColor} p-6 rounded-lg shadow-lg border border-gray-300 transform transition-all duration-200 hover:shadow-xl hover:scale-105`}
              style={{ 
                transform: `rotate(${rotation}deg)`,
                minHeight: '200px',
                position: 'relative'
              }}
            >
              {/* Action Icons */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button className="text-gray-600 hover:text-gray-800 p-1">
                  <i className="fas fa-copy text-sm"></i>
                </button>
                <button className="text-gray-600 hover:text-gray-800 p-1">
                  <i className="fas fa-pencil-alt text-sm"></i>
                </button>
              </div>
              
              {/* Note Content */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
                  {note.title}
                </h3>
                
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {note.content}
                </p>
                
                {/* Created Date */}
                <div className="absolute bottom-4 left-4">
                  <span className="text-blue-600 text-xs font-medium">
                    Created Date: {note.createdAt}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">New Note</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleAddNote(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newNote.title}
                      onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={newNote.content}
                      onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your note content here..."
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newNote.category}
                      onChange={(e) => setNewNote({...newNote, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={newNote.tags}
                      onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="work, important, meeting"
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
                    Create Note
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

export default Notes; 