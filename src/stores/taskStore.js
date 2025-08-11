import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useAuthStore } from './authStore';
import { apiClients } from '../services/apiGateway.js';

// Use the intelligent task API client
const taskAPI = apiClients.task;

export const useTaskStore = create(
  immer((set, get) => ({
    // State
    tasks: [],
    filteredTasks: [],
    currentTask: null,
    isLoading: false,
    error: null,
    filters: {
      status: 'all',
      priority: 'all',
      assignee: 'all',
      dueDate: 'all',
      search: ''
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0
    },
    realTimeUpdates: true,
    websocket: null,
    websocketConnected: false,
    websocketError: null,
    pingInterval: null,

    // Actions
    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    // Advanced Task Creation with RBAC
    createTask: async (taskData) => {
      const { hasPermission } = useAuthStore.getState();
      
      if (!hasPermission('task:create')) {
        throw new Error('Insufficient permissions to create tasks');
      }

      set({ isLoading: true, error: null });
      
      try {
        const response = await taskAPI.post('/create', {
          ...taskData,
          createdBy: useAuthStore.getState().user?.id,
          createdAt: new Date().toISOString()
        });

        if (!response.success) {
          throw new Error(response.message || 'Task creation failed');
        }

        const newTask = response.data;
        
        set((state) => {
          state.tasks.unshift(newTask);
          state.filteredTasks = get().applyFilters(state.tasks);
        });

        // Trigger real-time update
        get().notifyTaskUpdate('created', newTask);

        return { success: true, task: newTask };
      } catch (error) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Advanced Task Update with Validation
    updateTask: async (taskId, updates) => {
      const { hasPermission } = useAuthStore.getState();
      const currentTask = get().tasks.find(t => t.id === taskId);
      
      if (!currentTask) {
        throw new Error('Task not found');
      }

      // Check permissions based on task ownership and role
      const canUpdate = hasPermission('task:update') || 
                       currentTask.assigneeId === useAuthStore.getState().user?.id ||
                       currentTask.createdBy === useAuthStore.getState().user?.id;

      if (!canUpdate) {
        throw new Error('Insufficient permissions to update this task');
      }

      set({ isLoading: true, error: null });
      
      try {
        const response = await taskAPI.put(`/${taskId}/update`, {
          ...updates,
          updatedBy: useAuthStore.getState().user?.id,
          updatedAt: new Date().toISOString()
        });

        if (!response.success) {
          throw new Error(response.message || 'Task update failed');
        }

        const updatedTask = response.data;
        
        set((state) => {
          const taskIndex = state.tasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updatedTask };
          }
          state.filteredTasks = get().applyFilters(state.tasks);
          
          if (state.currentTask?.id === taskId) {
            state.currentTask = { ...state.currentTask, ...updatedTask };
          }
        });

        // Trigger real-time update
        get().notifyTaskUpdate('updated', updatedTask);

        return { success: true, task: updatedTask };
      } catch (error) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Delete Task with Cascade Protection
    deleteTask: async (taskId) => {
      const { hasPermission } = useAuthStore.getState();
      const currentTask = get().tasks.find(t => t.id === taskId);
      
      if (!currentTask) {
        throw new Error('Task not found');
      }

      // Only superadmin or task creator can delete
      const canDelete = hasPermission('task:delete') || 
                       currentTask.createdBy === useAuthStore.getState().user?.id;

      if (!canDelete) {
        throw new Error('Insufficient permissions to delete this task');
      }

      set({ isLoading: true, error: null });
      
      try {
        const response = await taskAPI.delete(`/${taskId}`);
        
        if (!response.success) {
          throw new Error(response.message || 'Task deletion failed');
        }

        set((state) => {
          state.tasks = state.tasks.filter(t => t.id !== taskId);
          state.filteredTasks = get().applyFilters(state.tasks);
          
          if (state.currentTask?.id === taskId) {
            state.currentTask = null;
          }
        });

        // Trigger real-time update
        get().notifyTaskUpdate('deleted', { id: taskId });

        return { success: true };
      } catch (error) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Check WebSocket connection status
    getWebSocketStatus: () => {
      const { websocket, websocketConnected, websocketError } = get();
      return {
        connected: websocketConnected,
        error: websocketError,
        readyState: websocket?.readyState || 'CLOSED'
      };
    },

    // Load Tasks with better error handling
    loadTasks: async (filters = {}) => {
      set({ isLoading: true, error: null });
      
      try {
        // Check if WebSocket is connected for real-time updates
        const wsStatus = get().getWebSocketStatus();
        if (!wsStatus.connected) {
          console.warn('⚠️ WebSocket not connected, real-time updates may not work');
        }
        
        const queryParams = new URLSearchParams({
          page: get().pagination.page,
          limit: get().pagination.limit,
          ...filters
        });

        const response = await taskAPI.get(`/list?${queryParams}`);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to load tasks');
        }

        const { tasks, pagination } = response.data;
        
        set((state) => {
          state.tasks = tasks;
          state.pagination = pagination;
          state.filteredTasks = get().applyFilters(tasks);
        });

        return { success: true, tasks, pagination };
      } catch (error) {
        console.error('❌ Error loading tasks:', error);
        const errorMessage = error.message || 'Failed to load tasks. Please check your connection and try again.';
        set({ error: errorMessage });
        throw new Error(errorMessage);
      } finally {
        set({ isLoading: false });
      }
    },

    // Get Single Task with Details
    getTask: async (taskId) => {
      set({ isLoading: true, error: null });
      
      try {
        const response = await taskAPI.get(`/${taskId}`);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to load task');
        }

        const task = response.data;
        
        set((state) => {
          state.currentTask = task;
          
          // Update in tasks list if exists
          const taskIndex = state.tasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            state.tasks[taskIndex] = task;
          }
        });

        return { success: true, task };
      } catch (error) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Advanced Filtering System
    setFilter: (filterType, value) => {
      set((state) => {
        state.filters[filterType] = value;
        state.pagination.page = 1; // Reset to first page
        state.filteredTasks = get().applyFilters(state.tasks);
      });
    },

    applyFilters: (tasks) => {
      const { filters } = get();
      let filtered = [...tasks];

      // Status filter
      if (filters.status !== 'all') {
        filtered = filtered.filter(task => task.status === filters.status);
      }

      // Priority filter
      if (filters.priority !== 'all') {
        filtered = filtered.filter(task => task.priority === filters.priority);
      }

      // Assignee filter
      if (filters.assignee !== 'all') {
        filtered = filtered.filter(task => task.assigneeId === filters.assignee);
      }

      // Due date filter
      if (filters.dueDate !== 'all') {
        const now = new Date();
        switch (filters.dueDate) {
          case 'overdue':
            filtered = filtered.filter(task => 
              new Date(task.dueDate) < now && task.status !== 'completed'
            );
            break;
          case 'today':
            const today = new Date().toDateString();
            filtered = filtered.filter(task => 
              new Date(task.dueDate).toDateString() === today
            );
            break;
          case 'week':
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(task => 
              new Date(task.dueDate) <= weekFromNow && task.status !== 'completed'
            );
            break;
        }
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(task =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.assignee?.name.toLowerCase().includes(searchLower)
        );
      }

      return filtered;
    },

    // Pagination
    setPage: (page) => {
      set((state) => {
        state.pagination.page = page;
      });
      get().loadTasks();
    },

    setLimit: (limit) => {
      set((state) => {
        state.pagination.limit = limit;
        state.pagination.page = 1;
      });
      get().loadTasks();
    },

    // Manual WebSocket reconnection
    reconnectWebSocket: () => {
      console.log('🔄 Manually reconnecting WebSocket...');
      if (get().websocket) {
        get().websocket.close();
      }
      if (get().pingInterval) {
        clearInterval(get().pingInterval);
        set({ pingInterval: null });
      }
      get().initializeRealTimeUpdates();
    },

    // Initialize Real-time Updates with better error handling
    initializeRealTimeUpdates: () => {
      if (get().websocket) {
        get().websocket.close();
      }

      const ws = new WebSocket('ws://192.168.0.7:4008/ws/tasks');
      
      ws.onopen = () => {
        console.log('Task WebSocket connected');
        set({ websocketConnected: true, websocketError: null });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);
          
          // Handle connection confirmation
          if (data.type === 'connection_established') {
            console.log('✅ WebSocket connection confirmed:', data.message);
            return;
          }
          
          // Handle pong responses
          if (data.type === 'pong') {
            console.log('🏓 Pong received from server');
            return;
          }
          
          // Handle real-time updates
          get().handleRealTimeUpdate(data);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('Task WebSocket error:', error);
        set({ websocketError: error, websocketConnected: false });
      };

      ws.onclose = (event) => {
        console.log(`Task WebSocket disconnected - Code: ${event.code}, Reason: ${event.reason}`);
        set({ websocketConnected: false });
        
        // Only reconnect if it wasn't a clean close and real-time updates are still enabled
        if (event.code !== 1000 && get().realTimeUpdates) {
          console.log('🔄 Attempting to reconnect in 5 seconds...');
          setTimeout(() => {
            if (get().realTimeUpdates) {
              get().initializeRealTimeUpdates();
            }
          }, 5000);
        }
      };

      set({ websocket: ws });
      
      // Set up ping interval to keep connection alive
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
        }
      }, 25000); // Ping every 25 seconds
      
      // Store the interval ID for cleanup
      set({ pingInterval });
    },

    handleRealTimeUpdate: (data) => {
      const { type, task } = data;
      
      switch (type) {
        case 'task_created':
          set((state) => {
            state.tasks.unshift(task);
            state.filteredTasks = get().applyFilters(state.tasks);
          });
          break;
          
        case 'task_updated':
          set((state) => {
            const taskIndex = state.tasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
              state.tasks[taskIndex] = task;
            }
            state.filteredTasks = get().applyFilters(state.tasks);
            
            if (state.currentTask?.id === task.id) {
              state.currentTask = task;
            }
          });
          break;
          
        case 'task_deleted':
          set((state) => {
            state.tasks = state.tasks.filter(t => t.id !== task.id);
            state.filteredTasks = get().applyFilters(state.tasks);
            
            if (state.currentTask?.id === task.id) {
              state.currentTask = null;
            }
          });
          break;
      }
    },

    notifyTaskUpdate: (action, task) => {
      // Notify other components or trigger events
      const event = new CustomEvent('taskUpdate', {
        detail: { action, task }
      });
      window.dispatchEvent(event);
    },

    // Bulk Operations
    bulkUpdateTasks: async (taskIds, updates) => {
      const { hasPermission } = useAuthStore.getState();
      
      if (!hasPermission('task:bulk_update')) {
        throw new Error('Insufficient permissions for bulk operations');
      }

      set({ isLoading: true, error: null });
      
      try {
        const response = await taskAPI.post('/bulk-update', {
          taskIds,
          updates,
          updatedBy: useAuthStore.getState().user?.id
        });

        if (!response.success) {
          throw new Error(response.message || 'Bulk update failed');
        }

        // Reload tasks to get updated data
        await get().loadTasks();

        return { success: true };
      } catch (error) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Task Analytics
    getTaskAnalytics: async () => {
      try {
        const response = await taskAPI.get('/analytics');
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to load analytics');
        }

        return response.data;
      } catch (error) {
        set({ error: error.message });
        throw error;
      }
    },

    // Cleanup
    cleanup: () => {
      if (get().websocket) {
        get().websocket.close();
        set({ websocket: null });
      }
      if (get().pingInterval) {
        clearInterval(get().pingInterval);
        set({ pingInterval: null });
      }
    }
  }))
);

export { taskAPI }; 