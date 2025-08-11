import React, { useState, useEffect } from 'react';
import { apiClients } from '../services/apiGateway.js';

const NetworkTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);

  const testEndpoints = [
    { name: 'API Gateway Health', endpoint: '/health', service: 'gateway' },
    { name: 'Auth Service', endpoint: '/login', service: 'auth' },
    { name: 'User Service', endpoint: '/profile', service: 'user' },
    { name: 'Task Service', endpoint: '/list', service: 'task' },
    { name: 'Attendance Service', endpoint: '/history', service: 'attendance' },
    { name: 'RBAC Service', endpoint: '/roles', service: 'rbac' },
    { name: 'Notification Service', endpoint: '/list', service: 'notification' },
    { name: 'AI Service', endpoint: '/analyze', service: 'ai' },
    { name: 'Report Service', endpoint: '/generate', service: 'report' },
    { name: 'Monitoring Service', endpoint: '/metrics', service: 'monitoring' }
  ];

  const runNetworkTest = async () => {
    setIsTesting(true);
    const results = {};

    for (const test of testEndpoints) {
      try {
        console.log(`🧪 Testing ${test.name}...`);
        
        let response;
        if (test.service === 'gateway') {
          response = await fetch('http://192.168.0.7:4000/health');
        } else {
          const client = apiClients[test.service];
          if (client) {
            response = await client.get(test.endpoint);
            results[test.name] = { status: 'success', data: response };
          } else {
            results[test.name] = { status: 'error', error: 'Client not found' };
          }
          continue;
        }

        if (response.ok) {
          const data = await response.json();
          results[test.name] = { status: 'success', data };
        } else {
          results[test.name] = { status: 'error', error: `HTTP ${response.status}` };
        }
      } catch (error) {
        console.error(`❌ Error testing ${test.name}:`, error);
        results[test.name] = { status: 'error', error: error.message };
      }
    }

    setTestResults(results);
    setIsTesting(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🌐 Network Connectivity Test</h2>
      <p className="text-gray-600 mb-4">
        Testing connection to backend microservices through the intelligent API Gateway
      </p>
      
      <button
        onClick={runNetworkTest}
        disabled={isTesting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {isTesting ? '🧪 Testing...' : '🧪 Run Network Test'}
      </button>

      <div className="space-y-3">
        {testEndpoints.map((test) => {
          const result = testResults[test.name];
          return (
            <div key={test.name} className="flex items-center justify-between p-3 border rounded">
              <div>
                <span className="font-medium">{test.name}</span>
                <span className="text-sm text-gray-500 ml-2">({test.endpoint})</span>
              </div>
              <div className="flex items-center space-x-2">
                {result ? (
                  <>
                    <span className={getStatusColor(result.status)}>
                      {getStatusIcon(result.status)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {result.status === 'success' ? 'Connected' : result.error}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">Not tested</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Test Summary:</h3>
          <div className="text-sm text-gray-600">
            <p>✅ Successful connections: {Object.values(testResults).filter(r => r.status === 'success').length}</p>
            <p>❌ Failed connections: {Object.values(testResults).filter(r => r.status === 'error').length}</p>
            <p>🌐 API Gateway: http://192.168.0.7:4000</p>
            <p>🔌 WebSocket (Tasks): ws://192.168.0.7:4008/ws/tasks</p>
            <p>🔔 WebSocket (Notifications): ws://192.168.0.7:4006/ws/notifications</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkTest; 