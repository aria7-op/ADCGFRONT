import React, { useEffect, useRef, useState, useCallback } from 'react';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import useRBACStore from '../stores/rbacStore';

// Event-driven component store
const useEventStore = create((set, get) => ({
  events: new Map(),
  workflows: new Map(),
  activeWorkflows: new Map(),
  eventHistory: [],
  listeners: new Map(),
  
  // Register event listener
  addEventListener: (eventType, callback, componentId) => {
    const { listeners } = get();
    if (!listeners.has(eventType)) {
      listeners.set(eventType, new Map());
    }
    listeners.get(eventType).set(componentId, callback);
  },
  
  // Remove event listener
  removeEventListener: (eventType, componentId) => {
    const { listeners } = get();
    if (listeners.has(eventType)) {
      listeners.get(eventType).delete(componentId);
    }
  },
  
  // Emit event
  emitEvent: (eventType, data, source) => {
    const { listeners, eventHistory } = get();
    const event = {
      id: uuidv4(),
      type: eventType,
      data,
      source,
      timestamp: new Date().toISOString(),
      processed: false
    };
    
    // Add to history
    set((state) => {
      state.eventHistory.push(event);
      if (state.eventHistory.length > 1000) {
        state.eventHistory = state.eventHistory.slice(-1000);
      }
    });
    
    // Notify listeners
    if (listeners.has(eventType)) {
      listeners.get(eventType).forEach((callback, componentId) => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }
    
    // Trigger workflows
    get().triggerWorkflows(event);
    
    return event;
  },
  
  // Register workflow
  registerWorkflow: (name, steps, conditions = {}) => {
    set((state) => {
      state.workflows.set(name, { steps, conditions });
    });
  },
  
  // Trigger workflows based on event
  triggerWorkflows: (event) => {
    const { workflows, activeWorkflows } = get();
    
    workflows.forEach((workflow, name) => {
      if (get().shouldTriggerWorkflow(workflow, event)) {
        const workflowId = uuidv4();
        const workflowInstance = {
          id: workflowId,
          name,
          steps: workflow.steps,
          currentStep: 0,
          status: 'running',
          data: event.data,
          context: event,
          results: {},
          startTime: new Date().toISOString()
        };
        
        set((state) => {
          state.activeWorkflows.set(workflowId, workflowInstance);
        });
        
        get().executeWorkflow(workflowId);
      }
    });
  },
  
  // Check if workflow should be triggered
  shouldTriggerWorkflow: (workflow, event) => {
    const { conditions } = workflow;
    
    if (!conditions.eventType && !conditions.eventSource) {
      return true;
    }
    
    if (conditions.eventType && conditions.eventType !== event.type) {
      return false;
    }
    
    if (conditions.eventSource && conditions.eventSource !== event.source) {
      return false;
    }
    
    if (conditions.customCondition) {
      return conditions.customCondition(event);
    }
    
    return true;
  },
  
  // Execute workflow
  executeWorkflow: async (workflowId) => {
    const { activeWorkflows } = get();
    const workflow = activeWorkflows.get(workflowId);
    
    if (!workflow) return;
    
    try {
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        
        // Update current step
        set((state) => {
          state.activeWorkflows.get(workflowId).currentStep = i;
        });
        
        // Execute step
        const result = await get().executeWorkflowStep(step, workflow);
        
        // Store result
        set((state) => {
          state.activeWorkflows.get(workflowId).results[step.id] = result;
        });
        
        // Check if workflow should continue
        if (step.condition && !step.condition(result)) {
          break;
        }
        
        // Emit step completion event
        get().emitEvent('workflow:step:completed', {
          workflowId,
          stepId: step.id,
          result
        }, 'workflow-engine');
      }
      
      // Mark workflow as completed
      set((state) => {
        state.activeWorkflows.get(workflowId).status = 'completed';
        state.activeWorkflows.get(workflowId).endTime = new Date().toISOString();
      });
      
      // Emit workflow completion event
      get().emitEvent('workflow:completed', {
        workflowId,
        workflow: activeWorkflows.get(workflowId)
      }, 'workflow-engine');
      
    } catch (error) {
      // Mark workflow as failed
      set((state) => {
        state.activeWorkflows.get(workflowId).status = 'failed';
        state.activeWorkflows.get(workflowId).error = error.message;
        state.activeWorkflows.get(workflowId).endTime = new Date().toISOString();
      });
      
      // Emit workflow failure event
      get().emitEvent('workflow:failed', {
        workflowId,
        error: error.message,
        workflow: activeWorkflows.get(workflowId)
      }, 'workflow-engine');
    }
  },
  
  // Execute workflow step
  executeWorkflowStep: async (step, workflow) => {
    switch (step.type) {
      case 'api_call':
        return await get().executeAPICall(step, workflow);
      case 'ui_action':
        return await get().executeUIAction(step, workflow);
      case 'condition_check':
        return await get().executeConditionCheck(step, workflow);
      case 'event_emit':
        return await get().executeEventEmit(step, workflow);
      case 'permission_check':
        return await get().executePermissionCheck(step, workflow);
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  },
  
  // Execute API call step
  executeAPICall: async (step, workflow) => {
    const { url, method, headers, body, transform } = step;
    
    const requestBody = body ? 
      (typeof body === 'function' ? body(workflow.data, workflow.context) : body) : 
      undefined;
    
    const response = await fetch(url, {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...headers
      },
      body: requestBody ? JSON.stringify(requestBody) : undefined
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return transform ? transform(data, workflow) : data;
  },
  
  // Execute UI action step
  executeUIAction: async (step, workflow) => {
    const { action, target, data } = step;
    
    // Emit UI action event
    get().emitEvent('ui:action', {
      action,
      target,
      data: data ? (typeof data === 'function' ? data(workflow.data, workflow.context) : data) : workflow.data
    }, 'workflow-engine');
    
    return { success: true, action, target };
  },
  
  // Execute condition check step
  executeConditionCheck: async (step, workflow) => {
    const { condition } = step;
    
    if (typeof condition === 'function') {
      return condition(workflow.data, workflow.context, workflow.results);
    }
    
    return { result: true };
  },
  
  // Execute event emit step
  executeEventEmit: async (step, workflow) => {
    const { eventType, eventData } = step;
    
    const data = eventData ? 
      (typeof eventData === 'function' ? eventData(workflow.data, workflow.context) : eventData) : 
      workflow.data;
    
    get().emitEvent(eventType, data, 'workflow-engine');
    
    return { success: true, eventType };
  },
  
  // Execute permission check step
  executePermissionCheck: async (step, workflow) => {
    const { resource, action, context } = step;
    
    const rbacStore = useRBACStore.getState();
    const hasPermission = rbacStore.checkPermission(resource, action, context);
    
    return { hasPermission, resource, action };
  },
  
  // Get active workflows
  getActiveWorkflows: () => {
    return Array.from(get().activeWorkflows.values());
  },
  
  // Get workflow by ID
  getWorkflow: (workflowId) => {
    return get().activeWorkflows.get(workflowId);
  },
  
  // Get event history
  getEventHistory: (eventType = null) => {
    const { eventHistory } = get();
    if (eventType) {
      return eventHistory.filter(event => event.type === eventType);
    }
    return eventHistory;
  }
}));

// Event-driven component wrapper
const EventDrivenComponent = ({ 
  children, 
  componentId, 
  eventTypes = [], 
  workflows = [],
  permissions = [],
  onEvent,
  onWorkflowStart,
  onWorkflowComplete,
  onWorkflowError,
  ...props 
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState({});
  const eventStore = useEventStore();
  const rbacStore = useRBACStore();
  const componentRef = useRef(null);
  
  // Initialize component
  useEffect(() => {
    const initComponent = async () => {
      // Register event listeners
      eventTypes.forEach(eventType => {
        eventStore.addEventListener(eventType, handleEvent, componentId);
      });
      
      // Register workflows
      workflows.forEach(workflow => {
        eventStore.registerWorkflow(workflow.name, workflow.steps, workflow.conditions);
      });
      
      // Check permissions
      if (permissions.length > 0) {
        const hasAllPermissions = permissions.every(([resource, action]) => 
          rbacStore.checkPermission(resource, action)
        );
        
        if (!hasAllPermissions) {
          console.warn(`Component ${componentId} missing required permissions`);
        }
      }
      
      // Listen for workflow events
      eventStore.addEventListener('workflow:started', handleWorkflowStart, componentId);
      eventStore.addEventListener('workflow:completed', handleWorkflowComplete, componentId);
      eventStore.addEventListener('workflow:failed', handleWorkflowError, componentId);
      
      setIsInitialized(true);
    };
    
    initComponent();
    
    return () => {
      // Cleanup event listeners
      eventTypes.forEach(eventType => {
        eventStore.removeEventListener(eventType, componentId);
      });
      
      eventStore.removeEventListener('workflow:started', componentId);
      eventStore.removeEventListener('workflow:completed', componentId);
      eventStore.removeEventListener('workflow:failed', componentId);
    };
  }, [componentId, eventTypes, workflows, permissions]);
  
  // Handle incoming events
  const handleEvent = useCallback((event) => {
    if (onEvent) {
      onEvent(event);
    }
    
    // Log access attempt
    rbacStore.logAccess('component', 'event_received', true, `Event: ${event.type}`);
  }, [onEvent, rbacStore]);
  
  // Handle workflow start
  const handleWorkflowStart = useCallback((event) => {
    setWorkflowStatus(prev => ({
      ...prev,
      [event.data.workflowId]: { status: 'running', startTime: event.data.startTime }
    }));
    
    if (onWorkflowStart) {
      onWorkflowStart(event.data);
    }
  }, [onWorkflowStart]);
  
  // Handle workflow completion
  const handleWorkflowComplete = useCallback((event) => {
    setWorkflowStatus(prev => ({
      ...prev,
      [event.data.workflowId]: { 
        status: 'completed', 
        endTime: event.data.workflow.endTime,
        results: event.data.workflow.results
      }
    }));
    
    if (onWorkflowComplete) {
      onWorkflowComplete(event.data);
    }
  }, [onWorkflowComplete]);
  
  // Handle workflow error
  const handleWorkflowError = useCallback((event) => {
    setWorkflowStatus(prev => ({
      ...prev,
      [event.data.workflowId]: { 
        status: 'failed', 
        error: event.data.error,
        endTime: event.data.workflow.endTime
      }
    }));
    
    if (onWorkflowError) {
      onWorkflowError(event.data);
    }
  }, [onWorkflowError]);
  
  // Emit event from component
  const emitEvent = useCallback((eventType, data) => {
    return eventStore.emitEvent(eventType, data, componentId);
  }, [eventStore, componentId]);
  
  // Start workflow from component
  const startWorkflow = useCallback((workflowName, data) => {
    const workflow = eventStore.workflows.get(workflowName);
    if (workflow) {
      const workflowId = uuidv4();
      const workflowInstance = {
        id: workflowId,
        name: workflowName,
        steps: workflow.steps,
        currentStep: 0,
        status: 'running',
        data,
        context: { source: componentId },
        results: {},
        startTime: new Date().toISOString()
      };
      
      eventStore.activeWorkflows.set(workflowId, workflowInstance);
      eventStore.executeWorkflow(workflowId);
      
      return workflowId;
    }
    
    throw new Error(`Workflow ${workflowName} not found`);
  }, [eventStore, componentId]);
  
  // Check if component has permission
  const hasPermission = useCallback((resource, action) => {
    return rbacStore.checkPermission(resource, action);
  }, [rbacStore]);
  
  if (!isInitialized) {
    return <div>Initializing component...</div>;
  }
  
  // Render children with additional props
  return React.cloneElement(children, {
    ...props,
    ref: componentRef,
    emitEvent,
    startWorkflow,
    hasPermission,
    workflowStatus,
    componentId
  });
};

// Hook for using event-driven functionality
export const useEventDriven = (componentId) => {
  const eventStore = useEventStore();
  const rbacStore = useRBACStore();
  
  const emitEvent = useCallback((eventType, data) => {
    return eventStore.emitEvent(eventType, data, componentId);
  }, [eventStore, componentId]);
  
  const startWorkflow = useCallback((workflowName, data) => {
    const workflow = eventStore.workflows.get(workflowName);
    if (workflow) {
      const workflowId = uuidv4();
      const workflowInstance = {
        id: workflowId,
        name: workflowName,
        steps: workflow.steps,
        currentStep: 0,
        status: 'running',
        data,
        context: { source: componentId },
        results: {},
        startTime: new Date().toISOString()
      };
      
      eventStore.activeWorkflows.set(workflowId, workflowInstance);
      eventStore.executeWorkflow(workflowId);
      
      return workflowId;
    }
    
    throw new Error(`Workflow ${workflowName} not found`);
  }, [eventStore, componentId]);
  
  const hasPermission = useCallback((resource, action) => {
    return rbacStore.checkPermission(resource, action);
  }, [rbacStore]);
  
  const getActiveWorkflows = useCallback(() => {
    return eventStore.getActiveWorkflows();
  }, [eventStore]);
  
  const getWorkflow = useCallback((workflowId) => {
    return eventStore.getWorkflow(workflowId);
  }, [eventStore]);
  
  const getEventHistory = useCallback((eventType) => {
    return eventStore.getEventHistory(eventType);
  }, [eventStore]);
  
  return {
    emitEvent,
    startWorkflow,
    hasPermission,
    getActiveWorkflows,
    getWorkflow,
    getEventHistory
  };
};

// Predefined workflows
export const Workflows = {
  // User registration workflow
  USER_REGISTRATION: {
    name: 'user_registration',
    steps: [
      {
        id: 'validate_user',
        type: 'api_call',
        url: '/api/v1/user/validate',
        method: 'POST',
        body: (data) => ({ userData: data })
      },
      {
        id: 'create_user',
        type: 'api_call',
        url: '/api/v1/user/create',
        method: 'POST',
        body: (data, context) => ({ userData: data, validationResult: context.results.validate_user })
      },
      {
        id: 'assign_role',
        type: 'api_call',
        url: '/api/v1/rbac/assign_role',
        method: 'POST',
        body: (data, context) => ({ 
          userId: context.results.create_user.id, 
          roleId: data.defaultRoleId 
        })
      },
      {
        id: 'send_welcome_email',
        type: 'api_call',
        url: '/api/v1/notification/send_email',
        method: 'POST',
        body: (data, context) => ({ 
          userId: context.results.create_user.id,
          template: 'welcome',
          data: context.results.create_user
        })
      },
      {
        id: 'log_registration',
        type: 'event_emit',
        eventType: 'user:registered',
        eventData: (data, context) => ({
          userId: context.results.create_user.id,
          registrationData: data
        })
      }
    ],
    conditions: {
      eventType: 'user:registration:started'
    }
  },
  
  // Attendance check-in workflow
  ATTENDANCE_CHECKIN: {
    name: 'attendance_checkin',
    steps: [
      {
        id: 'validate_checkin',
        type: 'api_call',
        url: '/api/v1/attendance/validate_checkin',
        method: 'POST',
        body: (data) => ({ checkinData: data })
      },
      {
        id: 'verify_biometric',
        type: 'api_call',
        url: '/api/v1/ai/verify_biometric',
        method: 'POST',
        body: (data, context) => ({ 
          biometricData: data.biometric,
          validationResult: context.results.validate_checkin
        })
      },
      {
        id: 'record_attendance',
        type: 'api_call',
        url: '/api/v1/attendance/record',
        method: 'POST',
        body: (data, context) => ({ 
          attendanceData: data,
          verificationResult: context.results.verify_biometric
        })
      },
      {
        id: 'update_statistics',
        type: 'api_call',
        url: '/api/v1/analytics/update_stats',
        method: 'POST',
        body: (data, context) => ({ 
          attendanceId: context.results.record_attendance.id,
          statsType: 'attendance'
        })
      },
      {
        id: 'send_notification',
        type: 'api_call',
        url: '/api/v1/notification/send_checkin_confirm',
        method: 'POST',
        body: (data, context) => ({ 
          userId: data.userId,
          attendanceId: context.results.record_attendance.id
        })
      },
      {
        id: 'log_checkin',
        type: 'event_emit',
        eventType: 'attendance:checked_in',
        eventData: (data, context) => ({
          attendanceId: context.results.record_attendance.id,
          checkinData: data
        })
      }
    ],
    conditions: {
      eventType: 'attendance:checkin:started'
    }
  },
  
  // AI analysis workflow
  AI_ANALYSIS: {
    name: 'ai_analysis',
    steps: [
      {
        id: 'collect_data',
        type: 'api_call',
        url: '/api/v1/data/collect',
        method: 'POST',
        body: (data) => ({ analysisRequest: data })
      },
      {
        id: 'preprocess_data',
        type: 'api_call',
        url: '/api/v1/ai/preprocess',
        method: 'POST',
        body: (data, context) => ({ 
          rawData: context.results.collect_data,
          preprocessingConfig: data.config
        })
      },
      {
        id: 'run_analysis',
        type: 'api_call',
        url: '/api/v1/ai/analyze',
        method: 'POST',
        body: (data, context) => ({ 
          preprocessedData: context.results.preprocess_data,
          analysisConfig: data.config
        })
      },
      {
        id: 'generate_insights',
        type: 'api_call',
        url: '/api/v1/ai/generate_insights',
        method: 'POST',
        body: (data, context) => ({ 
          analysisResult: context.results.run_analysis,
          insightConfig: data.config
        })
      },
      {
        id: 'store_results',
        type: 'api_call',
        url: '/api/v1/data/store_results',
        method: 'POST',
        body: (data, context) => ({ 
          insights: context.results.generate_insights,
          analysisResult: context.results.run_analysis
        })
      },
      {
        id: 'send_notifications',
        type: 'api_call',
        url: '/api/v1/notification/send_ai_results',
        method: 'POST',
        body: (data, context) => ({ 
          insights: context.results.generate_insights,
          recipients: data.recipients
        })
      },
      {
        id: 'log_analysis',
        type: 'event_emit',
        eventType: 'ai:analysis:completed',
        eventData: (data, context) => ({
          analysisId: context.results.store_results.id,
          insights: context.results.generate_insights
        })
      }
    ],
    conditions: {
      eventType: 'ai:analysis:started'
    }
  }
};

export default EventDrivenComponent; 