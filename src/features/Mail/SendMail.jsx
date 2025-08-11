import React, { useState } from 'react';

function SendMail() {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Mock mail data
  const mails = [
    {
      id: 1,
      subject: "tetst2",
      status: "Failed",
      dateSent: "2025-05-03 10:33:54"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendMail = () => {
    console.log('Sending mail:', formData);
    // Add send logic here
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    // Add save draft logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-3 sm:p-4">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Send mail</h1>
          </div>
        </div>

        {/* Mail Composition Form */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 sm:p-6">
            <form className="space-y-4">
              {/* To Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To *
                </label>
                <input
                  type="email"
                  name="to"
                  value={formData.to}
                  onChange={handleInputChange}
                  placeholder="To"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Subject"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type your message"
                  rows="6"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  required
                />
              </div>

              {/* Attachments Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
                  <p className="text-gray-600 text-sm">
                    Drop files here and click button below to proceed
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleSendMail}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Send mail
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  Save as draft
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Mail List Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search mails..."
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
                  <i className="fas fa-download"></i>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center">
                        Subject
                        <i className="fas fa-sort ml-1 text-gray-400"></i>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center">
                        Status
                        <i className="fas fa-sort ml-1 text-gray-400"></i>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center">
                        Date Sent
                        <i className="fas fa-sort ml-1 text-gray-400"></i>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mails.map((mail, index) => (
                    <tr key={mail.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {mail.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          {mail.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {mail.dateSent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Info */}
            <div className="mt-4 text-sm text-gray-700">
              Showing 1 to 1 of 1 rows
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendMail; 