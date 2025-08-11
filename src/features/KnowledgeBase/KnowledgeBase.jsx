import React, { useState } from 'react';

function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  // Mock data for articles
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: 'Project Management Tool',
      groupName: 'Project Management',
      datePublished: '2023-05-01 10:55:48',
      content: 'Complete guide to using our project management tool...',
      author: 'John Smith',
      status: 'Published'
    },
    {
      id: 2,
      title: 'Getting Started with TaskHub',
      groupName: 'User Guide',
      datePublished: '2023-04-15 14:30:22',
      content: 'Step-by-step guide for new users...',
      author: 'Sarah Davis',
      status: 'Published'
    },
    {
      id: 3,
      title: 'Advanced Features Overview',
      groupName: 'Project Management',
      datePublished: '2023-03-20 09:15:10',
      content: 'Learn about advanced project management features...',
      author: 'Michael Brown',
      status: 'Draft'
    }
  ]);

  // Mock data for article groups
  const [articleGroups, setArticleGroups] = useState([
    { id: 1, name: 'Project Management' },
    { id: 2, name: 'User Guide' },
    { id: 3, name: 'Troubleshooting' },
    { id: 4, name: 'API Documentation' }
  ]);

  const handleAddArticle = (articleData) => {
    const newArticle = {
      id: articles.length + 1,
      ...articleData,
      datePublished: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setArticles([...articles, newArticle]);
    setShowAddModal(false);
  };

  const handleEditArticle = (articleData) => {
    setArticles(articles.map(article => 
      article.id === editingArticle.id ? { ...article, ...articleData } : article
    ));
    setEditingArticle(null);
    setShowAddModal(false);
  };

  const handleDeleteArticle = (id) => {
    setArticles(articles.filter(article => article.id !== id));
  };

  const handleAddGroup = (groupData) => {
    const newGroup = {
      id: articleGroups.length + 1,
      ...groupData
    };
    setArticleGroups([...articleGroups, newGroup]);
    setShowAddGroupModal(false);
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.groupName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !selectedGroup || article.groupName === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Knowledge Base</h1>
          <div className="flex space-x-2 sm:space-x-3">
            <button
              onClick={() => setShowAddGroupModal(true)}
              className="bg-blue-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
            >
              <i className="fas fa-list"></i>
              <span className="hidden sm:inline">Article Groups</span>
              <span className="sm:hidden">Groups</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
            >
              <i className="fas fa-plus"></i>
              <span className="hidden sm:inline">Add Article</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Group</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Group</option>
              {articleGroups.map((group) => (
                <option key={group.id} value={group.name}>{group.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Article Due Dates Between</label>
            <input
              type="text"
              placeholder="Select date range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button className="bg-blue-600 text-white px-2 py-1.5 sm:px-6 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Articles Table */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.title}
                    <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">View</a>
                      <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">Edit</a>
                      <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">Duplicate</a>
                      <a href="#" className="text-red-600 hover:text-red-900">Trash</a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.groupName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.datePublished}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(article.status)}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingArticle(article);
                          setShowAddModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
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
          {filteredArticles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No matching records found
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Article Modal */}
      {showAddModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingArticle ? 'Edit Article' : 'Add Article'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingArticle(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const articleData = {
                title: formData.get('title'),
                groupName: formData.get('groupName'),
                content: formData.get('content'),
                author: formData.get('author'),
                status: formData.get('status')
              };

              if (editingArticle) {
                handleEditArticle(articleData);
              } else {
                handleAddArticle(articleData);
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingArticle?.title || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group *</label>
                  <select
                    name="groupName"
                    defaultValue={editingArticle?.groupName || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Group</option>
                    {articleGroups.map((group) => (
                      <option key={group.id} value={group.name}>{group.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    name="author"
                    defaultValue={editingArticle?.author || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    defaultValue={editingArticle?.status || 'Draft'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    name="content"
                    defaultValue={editingArticle?.content || ''}
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingArticle(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingArticle ? 'Update Article' : 'Add Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Article Group Modal */}
      {showAddGroupModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Article Group</h3>
              <button
                onClick={() => setShowAddGroupModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const groupData = {
                name: formData.get('name')
              };
              handleAddGroup(groupData);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Group Name *</label>
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
                  onClick={() => setShowAddGroupModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Article Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default KnowledgeBase; 