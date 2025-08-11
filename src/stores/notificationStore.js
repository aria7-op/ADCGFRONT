import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useAuthStore } from './authStore';

// Notification API client - Updated to use API Gateway
const notificationAPI = new (class {
  constructor() {
    // Use API Gateway instead of direct service
    this.baseURL = 'http://192.168.0.7:4000/api/v1/notifications';
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Type': 'web-app',
        'X-API-Version': 'v1',
        'X-Target-Service': 'notification-service',
        ...options.headers
      },
      ...options
    };

    // Add auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (attempt === this.retryAttempts) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
})();

export const useNotificationStore = create(
  immer((set, get) => ({
    // State
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    filters: {
      type: 'all',
      priority: 'all',
      read: 'all',
      dateRange: 'all'
    },
    settings: {
      emailNotifications: true,
      pushNotifications: true,
      soundEnabled: true,
      autoMarkAsRead: false,
      notificationTimeout: 5000
    },
    realTimeUpdates: true,
    websocket: null,
    toastQueue: [],
    websocketConnected: false,
    websocketError: null,

    // Actions
    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    // Load Notifications with Advanced Filtering
    loadNotifications: async (filters = {}) => {
      const { user } = useAuthStore.getState();
      if (!user) return;

      set({ isLoading: true, error: null });
      
      try {
        const queryParams = new URLSearchParams({
          userId: user.id,
          ...filters
        });

        const response = await notificationAPI.get(`/user/${user.id}?${queryParams}`);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to load notifications');
        }

        const notifications = response.data;
        
        set((state) => {
          state.notifications = notifications;
          state.unreadCount = notifications.filter(n => !n.read).length;
        });

        return { success: true, notifications };
      } catch (error) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Send Notification with RBAC
    sendNotification: async (notificationData) => {
      const { hasPermission } = useAuthStore.getState();
      
      if (!hasPermission('notification:send')) {
        throw new Error('Insufficient permissions to send notifications');
      }

      set({ isLoading: true, error: null });
      
      try {
        const response = await notificationAPI.post('/send', {
          ...notificationData,
          sentBy: useAuthStore.getState().user?.id,
          sentAt: new Date().toISOString()
        });

        if (!response.success) {
          throw new Error(response.message || 'Failed to send notification');
        }

        const notification = response.data;
        
        // Add to local state if it's for current user
        if (notification.userId === useAuthStore.getState().user?.id) {
          set((state) => {
            state.notifications.unshift(notification);
            if (!notification.read) {
              state.unreadCount++;
            }
          });
        }

        return { success: true, notification };
      } catch (error) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Mark as Read with Batch Support
    markAsRead: async (notificationIds) => {
      const { user } = useAuthStore.getState();
      if (!user) return;

      set({ isLoading: true, error: null });
      
      try {
        const response = await notificationAPI.put(`/${notificationIds.join(',')}/read`, {
          userId: user.id,
          readAt: new Date().toISOString()
        });

        if (!response.success) {
          throw new Error(response.message || 'Failed to mark notifications as read');
        }

        set((state) => {
          notificationIds.forEach(id => {
            const notification = state.notifications.find(n => n.id === id);
            if (notification && !notification.read) {
              notification.read = true;
              notification.readAt = new Date().toISOString();
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
          });
        });

        return { success: true };
      } catch (error) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Mark All as Read
    markAllAsRead: async () => {
      const { user } = useAuthStore.getState();
      if (!user) return;

      set({ isLoading: true, error: null });
      
      try {
        const response = await notificationAPI.put(`/user/${user.id}/read-all`, {
          readAt: new Date().toISOString()
        });

        if (!response.success) {
          throw new Error(response.message || 'Failed to mark all notifications as read');
        }

        set((state) => {
          state.notifications.forEach(notification => {
            if (!notification.read) {
              notification.read = true;
              notification.readAt = new Date().toISOString();
            }
          });
          state.unreadCount = 0;
        });

        return { success: true };
      } catch (error) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Delete Notification
    deleteNotification: async (notificationId) => {
      const { user } = useAuthStore.getState();
      if (!user) return;

      set({ isLoading: true, error: null });
      
      try {
        const response = await notificationAPI.delete(`/${notificationId}`);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete notification');
        }

        set((state) => {
          const notification = state.notifications.find(n => n.id === notificationId);
          if (notification && !notification.read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications = state.notifications.filter(n => n.id !== notificationId);
        });

        return { success: true };
      } catch (error) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Advanced Filtering
    setFilter: (filterType, value) => {
      set((state) => {
        state.filters[filterType] = value;
      });
      get().loadNotifications(get().filters);
    },

    applyFilters: (notifications) => {
      const { filters } = get();
      let filtered = [...notifications];

      // Type filter
      if (filters.type !== 'all') {
        filtered = filtered.filter(notification => notification.type === filters.type);
      }

      // Priority filter
      if (filters.priority !== 'all') {
        filtered = filtered.filter(notification => notification.priority === filters.priority);
      }

      // Read filter
      if (filters.read !== 'all') {
        const isRead = filters.read === 'read';
        filtered = filtered.filter(notification => notification.read === isRead);
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const now = new Date();
        switch (filters.dateRange) {
          case 'today':
            const today = new Date().toDateString();
            filtered = filtered.filter(notification => 
              new Date(notification.createdAt).toDateString() === today
            );
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(notification => 
              new Date(notification.createdAt) >= weekAgo
            );
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(notification => 
              new Date(notification.createdAt) >= monthAgo
            );
            break;
        }
      }

      return filtered;
    },

    // Real-time Updates
    initializeRealTimeUpdates: () => {
      if (get().websocket) {
        get().websocket.close();
      }

      // Use the notification service directly for WebSocket (WebSockets can't go through HTTP API Gateway)
      const ws = new WebSocket('ws://192.168.0.7:4006/ws/notifications');
      
      ws.onopen = () => {
        console.log('🔔 Notification WebSocket connected');
        set({ websocketConnected: true, websocketError: null });
        
        // Send user ID for filtering
        const userId = useAuthStore.getState().user?.id;
        if (userId) {
          ws.send(JSON.stringify({
            type: 'subscribe',
            userId: userId
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Notification WebSocket message received:', data);
          get().handleRealTimeUpdate(data);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ Notification WebSocket error:', error);
        set({ websocketError: error, websocketConnected: false });
      };

      ws.onclose = (event) => {
        console.log(`🔌 Notification WebSocket disconnected - Code: ${event.code}, Reason: ${event.reason}`);
        set({ websocketConnected: false });
        
        // Reconnect after 5 seconds if real-time updates are still enabled
        if (get().realTimeUpdates) {
          console.log('🔄 Attempting to reconnect in 5 seconds...');
          setTimeout(() => {
            if (get().realTimeUpdates) {
              get().initializeRealTimeUpdates();
            }
          }, 5000);
        }
      };

      set({ websocket: ws });
    },

    handleRealTimeUpdate: (data) => {
      const { type, notification } = data;
      
      switch (type) {
        case 'notification_created':
          set((state) => {
            state.notifications.unshift(notification);
            if (!notification.read) {
              state.unreadCount++;
            }
          });
          
          // Show toast notification
          get().showToast(notification);
          break;
          
        case 'notification_updated':
          set((state) => {
            const notificationIndex = state.notifications.findIndex(n => n.id === notification.id);
            if (notificationIndex !== -1) {
              state.notifications[notificationIndex] = notification;
            }
          });
          break;
          
        case 'notification_deleted':
          set((state) => {
            const notification = state.notifications.find(n => n.id === notification.id);
            if (notification && !notification.read) {
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
            state.notifications = state.notifications.filter(n => n.id !== notification.id);
          });
          break;
      }
    },

    // Toast Notification System
    showToast: (notification) => {
      const { settings } = get();
      
      // Create toast element
      const toast = {
        id: Date.now(),
        notification,
        visible: true
      };

      set((state) => {
        state.toastQueue.push(toast);
      });

      // Auto-hide after timeout
      setTimeout(() => {
        get().hideToast(toast.id);
      }, settings.notificationTimeout);

      // Play sound if enabled
      if (settings.soundEnabled) {
        get().playNotificationSound(notification.priority);
      }

      // Auto-mark as read if enabled
      if (settings.autoMarkAsRead) {
        setTimeout(() => {
          get().markAsRead([notification.id]);
        }, 2000);
      }
    },

    hideToast: (toastId) => {
      set((state) => {
        state.toastQueue = state.toastQueue.filter(toast => toast.id !== toastId);
      });
    },

    // Sound System
    playNotificationSound: (priority) => {
      const audio = new Audio();
      
      switch (priority) {
        case 'critical':
          audio.src = '/sounds/critical.mp3';
          break;
        case 'high':
          audio.src = '/sounds/high.mp3';
          break;
        case 'medium':
          audio.src = '/sounds/medium.mp3';
          break;
        default:
          audio.src = '/sounds/default.mp3';
      }
      
      audio.play().catch(error => {
        console.warn('Failed to play notification sound:', error);
      });
    },

    // Settings Management
    updateSettings: (newSettings) => {
      set((state) => {
        state.settings = { ...state.settings, ...newSettings };
      });
      
      // Save to localStorage
      localStorage.setItem('notificationSettings', JSON.stringify(get().settings));
    },

    loadSettings: () => {
      const savedSettings = localStorage.getItem('notificationSettings');
      if (savedSettings) {
        set({ settings: JSON.parse(savedSettings) });
      }
    },

    // Notification Analytics
    getNotificationAnalytics: async () => {
      const { user } = useAuthStore.getState();
      if (!user) return;

      try {
        const response = await notificationAPI.get(`/analytics/${user.id}`);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to load analytics');
        }

        return response.data;
      } catch (error) {
        set({ error: error.message });
        throw error;
      }
    },

    // Bulk Operations
    bulkMarkAsRead: async (notificationIds) => {
      return get().markAsRead(notificationIds);
    },

    bulkDelete: async (notificationIds) => {
      const { user } = useAuthStore.getState();
      if (!user) return;

      set({ isLoading: true, error: null });
      
      try {
        const response = await notificationAPI.delete(`/bulk/${notificationIds.join(',')}`);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete notifications');
        }

        set((state) => {
          let deletedUnread = 0;
          notificationIds.forEach(id => {
            const notification = state.notifications.find(n => n.id === id);
            if (notification && !notification.read) {
              deletedUnread++;
            }
          });
          
          state.notifications = state.notifications.filter(n => !notificationIds.includes(n.id));
          state.unreadCount = Math.max(0, state.unreadCount - deletedUnread);
        });

        return { success: true };
      } catch (error) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Cleanup
    cleanup: () => {
      if (get().websocket) {
        get().websocket.close();
        set({ websocket: null });
      }
    }
  }))
);

export { notificationAPI }; 