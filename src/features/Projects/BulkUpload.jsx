import React, { useState } from 'react';

function BulkUpload() {
  const [uploadType, setUploadType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Upload Type:', uploadType);
    console.log('Selected File:', selectedFile);
  };

  return (
    <div className="p-0 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Bulk Upload</h1>
      </div>

      {/* Instructions Alert */}
      <div className="mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <ul className="space-y-1 text-sm">
            <li>• Read and follow instructions carefully while preparing data</li>
            <li>• Download and save the sample file to reduce errors</li>
            <li>• For adding bulk products file should be .csv format</li>
            <li>• Make sure you entered valid data as per instructions before proceed</li>
          </ul>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
                         <div className="space-y-6 mb-6">
               {/* Type Selection */}
               <div className="form-group">
                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                   Type <small className="text-xs">[Uploaded/Updated]</small> <span className="text-red-500">*</span>
                 </label>
                 <select
                   value={uploadType}
                   onChange={(e) => setUploadType(e.target.value)}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                   required
                 >
                   <option value="">Select</option>
                   <option value="upload">Uploaded</option>
                   <option value="update">Updated</option>
                 </select>
               </div>

               {/* File Upload */}
               <div className="form-group">
                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                   File <span className="text-red-500">*</span>
                 </label>
                 <input
                   type="file"
                   accept=".csv"
                   onChange={handleFileChange}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                   required
                 />
               </div>
             </div>

                         {/* Submit Button */}
             <div className="flex justify-start mb-8">
               <button
                 type="submit"
                 className="bg-blue-500 text-white px-2 py-1.5 sm:px-6 sm:py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md text-sm sm:text-base"
               >
                 Submit
               </button>
             </div>
          </form>

          {/* Download Buttons */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 transition-colors shadow-md flex items-center space-x-2"
              >
                <i className="fas fa-download"></i>
                <span>Bulk Upload sample file</span>
              </a>
              
              <a
                href="#"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md flex items-center space-x-2"
              >
                <i className="fas fa-download"></i>
                <span>Bulk Upload Instructions</span>
              </a>
              
              <a
                href="#"
                className="bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 transition-colors shadow-md flex items-center space-x-2"
              >
                <i className="fas fa-download"></i>
                <span>Bulk Update sample file</span>
              </a>
              
              <a
                href="#"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md flex items-center space-x-2"
              >
                <i className="fas fa-download"></i>
                <span>Bulk Update Instructions</span>
              </a>
              
              <a
                href="#"
                className="bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 transition-colors shadow-md flex items-center space-x-2"
              >
                <i className="fas fa-download"></i>
                <span>Bulk Download Data</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkUpload; 