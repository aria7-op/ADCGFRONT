import React, { useState } from 'react';

function SystemRegistration() {
  const [purchaseCode, setPurchaseCode] = useState('');

  const handleReset = () => {
    setPurchaseCode('');
  };

  const handleRegister = () => {
    if (!purchaseCode.trim()) {
      alert('Please enter a purchase code');
      return;
    }
    // Handle registration logic here
    alert('Registration successful!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with white card design */}
      <div className="p-0 sm:p-4 lg:p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-gray-900 text-xl sm:text-2xl font-bold">System Registration</h1>
        </div>
      </div>

      {/* Main content area - positioned below header on the left */}
      <div className="p-0 sm:p-4 lg:p-6 w-full">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 w-full">
          <div className="space-y-6">
            {/* Purchase Code Input */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-gray-700 font-medium text-sm sm:text-base">
                TaskHub Purchase Code*
              </label>
              <input
                type="text"
                value={purchaseCode}
                onChange={(e) => setPurchaseCode(e.target.value)}
                placeholder="Enter your purchase code here"
                className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 sm:space-x-4 pt-4">
              <button
                onClick={handleReset}
                className="px-2 py-1.5 sm:px-6 sm:py-2 bg-[#ff7a22] text-white font-bold rounded-md hover:bg-orange-600 transition-colors text-sm sm:text-base"
              >
                Reset
              </button>
              <button
                onClick={handleRegister}
                className="px-2 py-1.5 sm:px-6 sm:py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemRegistration; 