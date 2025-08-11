import React, { useState, useEffect, useCallback } from 'react';
import EventDrivenComponent, { useEventDriven, Workflows } from '../../components/EventDrivenComponent';
import useRBACStore from '../../stores/rbacStore';

const AdvancedAttendance = ({ componentId = 'advanced-attendance' }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [workflowStatus, setWorkflowStatus] = useState({});
  const [permissions, setPermissions] = useState({});
  const [events, setEvents] = useState([]);
  
  const { emitEvent, startWorkflow, hasPermission, getActiveWorkflows } = useEventDriven(componentId);
  const rbacStore = useRBACStore();

  // Initialize component with event-driven capabilities
  useEffect(() => {
    // Check permissions
    const requiredPermissions = [
      ['attendance', 'read'],
      ['attendance', 'create'],
      ['ai', 'read'],
      ['notification', 'read']
    ];

    const permissionStatus = {};
    requiredPermissions.forEach(([resource, action]) => {
      permissionStatus[`${resource}:${action}`] = hasPermission(resource, action);
    });

    setPermissions(permissionStatus);

    // Log component access
    rbacStore.logAccess('component', 'view', true, 'Advanced Attendance Component');
  }, [hasPermission, rbacStore]);

  // Handle attendance check-in with complete workflow
  const handleCheckIn = useCallback(async (checkinData) => {
    try {
      // Check permission first
      if (!hasPermission('attendance', 'create')) {
        throw new Error('Insufficient permissions for attendance check-in');
      }

      // Emit check-in event to trigger workflow
      const event = emitEvent('attendance:checkin:started', {
        userId: rbacStore.context.userId,
        timestamp: new Date().toISOString(),
        location: rbacStore.context.location,
        device: rbacStore.context.device,
        biometric: checkinData.biometric,
        ...checkinData
      });

      // Start the attendance check-in workflow
      const workflowId = startWorkflow('attendance_checkin', {
        userId: rbacStore.context.userId,
        checkinData: {
          timestamp: new Date().toISOString(),
          location: rbacStore.context.location,
          device: rbacStore.context.device,
          biometric: checkinData.biometric,
          ...checkinData
        }
      });

      console.log('Attendance check-in workflow started:', workflowId);

      // Update UI
      setAttendanceData({
        status: 'processing',
        workflowId,
        eventId: event.id,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Check-in failed:', error);
      setAttendanceData({
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }, [emitEvent, startWorkflow, hasPermission, rbacStore]);

  // Handle workflow events
  const handleWorkflowEvent = useCallback((event) => {
    setEvents(prev => [...prev.slice(-9), event]); // Keep last 10 events

    if (event.type === 'workflow:step:completed') {
      console.log('Workflow step completed:', event.data);
    } else if (event.type === 'workflow:completed') {
      console.log('Workflow completed:', event.data);
      setAttendanceData(prev => ({
        ...prev,
        status: 'completed',
        results: event.data.workflow.results
      }));
    } else if (event.type === 'workflow:failed') {
      console.error('Workflow failed:', event.data);
      setAttendanceData(prev => ({
        ...prev,
        status: 'failed',
        error: event.data.error
      }));
    }
  }, []);

  // Handle AI analysis request
  const handleAIAnalysis = useCallback(async (analysisData) => {
    try {
      if (!hasPermission('ai', 'create')) {
        throw new Error('Insufficient permissions for AI analysis');
      }

      // Emit AI analysis event
      const event = emitEvent('ai:analysis:started', {
        userId: rbacStore.context.userId,
        analysisType: 'attendance_pattern',
        data: analysisData,
        context: {
          location: rbacStore.context.location,
          device: rbacStore.context.device,
          riskScore: rbacStore.context.riskScore
        }
      });

      // Start AI analysis workflow
      const workflowId = startWorkflow('ai_analysis', {
        userId: rbacStore.context.userId,
        analysisRequest: {
          type: 'attendance_pattern',
          data: analysisData,
          config: {
            algorithm: 'deep_learning',
            parameters: {
              epochs: 100,
              batchSize: 32,
              learningRate: 0.001
            }
          }
        }
      });

      console.log('AI analysis workflow started:', workflowId);

    } catch (error) {
      console.error('AI analysis failed:', error);
    }
  }, [emitEvent, startWorkflow, hasPermission, rbacStore]);

  // Get active workflows
  const activeWorkflows = getActiveWorkflows();

  return (
    <EventDrivenComponent
      componentId={componentId}
      eventTypes={[
        'workflow:step:completed',
        'workflow:completed',
        'workflow:failed',
        'attendance:checked_in',
        'ai:analysis:completed'
      ]}
      workflows={[Workflows.ATTENDANCE_CHECKIN, Workflows.AI_ANALYSIS]}
      permissions={[
        ['attendance', 'read'],
        ['attendance', 'create'],
        ['ai', 'read'],
        ['ai', 'create']
      ]}
      onEvent={handleWorkflowEvent}
    >
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Advanced Attendance System
        </h2>

        {/* Permission Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Permission Status</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(permissions).map(([permission, granted]) => (
              <div key={permission} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${granted ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">{permission}</span>
                <span className={`text-xs ${granted ? 'text-green-600' : 'text-red-600'}`}>
                  {granted ? 'Granted' : 'Denied'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Check-in */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Attendance Check-in</h3>
          
          {attendanceData?.status === 'processing' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-700">Processing check-in...</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Workflow ID: {attendanceData.workflowId}
              </p>
            </div>
          )}

          {attendanceData?.status === 'completed' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-green-700">Check-in completed successfully!</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Attendance recorded and notifications sent
              </p>
            </div>
          )}

          {attendanceData?.status === 'error' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-red-700">Check-in failed</span>
              </div>
              <p className="text-xs text-red-600 mt-1">{attendanceData.error}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => handleCheckIn({
                biometric: { type: 'fingerprint', data: 'sample_fingerprint_data' },
                location: rbacStore.context.location,
                device: rbacStore.context.device
              })}
              disabled={!permissions['attendance:create'] || attendanceData?.status === 'processing'}
              className={`px-4 py-2 rounded-lg font-medium ${
                permissions['attendance:create'] && attendanceData?.status !== 'processing'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Check In
            </button>

            <button
              onClick={() => handleAIAnalysis({
                dateRange: { start: '2024-01-01', end: '2024-12-31' },
                analysisType: 'attendance_pattern'
              })}
              disabled={!permissions['ai:create']}
              className={`px-4 py-2 rounded-lg font-medium ${
                permissions['ai:create']
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Run AI Analysis
            </button>
          </div>
        </div>

        {/* Active Workflows */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Active Workflows</h3>
          {activeWorkflows.length > 0 ? (
            <div className="space-y-2">
              {activeWorkflows.map(workflow => (
                <div key={workflow.id} className="p-3 bg-gray-50 rounded border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{workflow.name}</p>
                      <p className="text-sm text-gray-600">
                        Step {workflow.currentStep + 1} of {workflow.steps.length}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      workflow.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      workflow.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {workflow.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No active workflows</p>
          )}
        </div>

        {/* Recent Events */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Recent Events</h3>
          {events.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {events.map(event => (
                <div key={event.id} className="p-2 bg-gray-50 rounded text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-800">{event.type}</span>
                    <span className="text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    Source: {event.source}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent events</p>
          )}
        </div>

        {/* Context Information */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Current Context</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">User ID</p>
              <p className="text-gray-600">{rbacStore.context.userId || 'Not set'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Device Type</p>
              <p className="text-gray-600">{rbacStore.context.device?.type || 'Unknown'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Risk Score</p>
              <p className="text-gray-600">{rbacStore.context.riskScore.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Location</p>
              <p className="text-gray-600">
                {rbacStore.context.location 
                  ? `${rbacStore.context.location.lat.toFixed(4)}, ${rbacStore.context.location.lng.toFixed(4)}`
                  : 'Not available'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </EventDrivenComponent>
  );
};

export default AdvancedAttendance; 