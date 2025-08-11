import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // State
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          permissions: [],
          roles: [],
          lastActivity: null,
          sessionTimeout: null,

          // Actions
          login: async (credentials) => {
            set((state) => {
              state.isLoading = true;
              state.error = null;
            });

            try {
              const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
              });

              const data = await response.json();

              if (data.success) {
                set((state) => {
                  state.user = data.user;
                  state.token = data.token;
                  state.refreshToken = data.refreshToken;
                  state.isAuthenticated = true;
                  state.permissions = data.permissions;
                  state.roles = data.roles;
                  state.lastActivity = new Date().toISOString();
                  state.isLoading = false;
                });
              } else {
                set((state) => {
                  state.error = data.message;
                  state.isLoading = false;
                });
              }
            } catch (error) {
              set((state) => {
                state.error = error.message;
                state.isLoading = false;
              });
            }
          },

          logout: () => {
            set((state) => {
              state.user = null;
              state.token = null;
              state.refreshToken = null;
              state.isAuthenticated = false;
              state.permissions = [];
              state.roles = [];
              state.lastActivity = null;
              state.sessionTimeout = null;
            });
          },

          updateUser: (userData) => {
            set((state) => {
              state.user = { ...state.user, ...userData };
            });
          },

          refreshSession: async () => {
            const { refreshToken } = get();
            if (!refreshToken) return false;

            try {
              const response = await fetch('/api/v1/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
              });

              const data = await response.json();

              if (data.success) {
                set((state) => {
                  state.token = data.token;
                  state.refreshToken = data.refreshToken;
                  state.lastActivity = new Date().toISOString();
                });
                return true;
              }
            } catch (error) {
              console.error('Session refresh failed:', error);
            }

            return false;
          },

          hasPermission: (permission) => {
            const { permissions } = get();
            return permissions.includes(permission) || permissions.includes('*');
          },

          hasRole: (role) => {
            const { roles } = get();
            return roles.includes(role);
          },

          updateActivity: () => {
            set((state) => {
              state.lastActivity = new Date().toISOString();
            });
          },
        }))
      ),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
          permissions: state.permissions,
          roles: state.roles,
        }),
      }
    ),
    { name: 'auth-store' }
  )
);

// UI Store
export const useUIStore = create(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // State
          sidebarCollapsed: false,
          theme: 'light',
          language: 'en',
          notifications: [],
          modals: {},
          loadingStates: {},
          errors: {},
          breadcrumbs: [],
          activeTab: 'dashboard',

          // Actions
          toggleSidebar: () => {
            set((state) => {
              state.sidebarCollapsed = !state.sidebarCollapsed;
            });
          },

          setTheme: (theme) => {
            set((state) => {
              state.theme = theme;
            });
          },

          setLanguage: (language) => {
            set((state) => {
              state.language = language;
            });
          },

          addNotification: (notification) => {
            set((state) => {
              state.notifications.push({
                id: Date.now(),
                timestamp: new Date().toISOString(),
                ...notification,
              });
            });
          },

          removeNotification: (id) => {
            set((state) => {
              state.notifications = state.notifications.filter(n => n.id !== id);
            });
          },

          clearNotifications: () => {
            set((state) => {
              state.notifications = [];
            });
          },

          openModal: (modalId, props = {}) => {
            set((state) => {
              state.modals[modalId] = { isOpen: true, props };
            });
          },

          closeModal: (modalId) => {
            set((state) => {
              if (state.modals[modalId]) {
                state.modals[modalId].isOpen = false;
              }
            });
          },

          setLoading: (key, isLoading) => {
            set((state) => {
              state.loadingStates[key] = isLoading;
            });
          },

          setError: (key, error) => {
            set((state) => {
              state.errors[key] = error;
            });
          },

          clearError: (key) => {
            set((state) => {
              delete state.errors[key];
            });
          },

          setBreadcrumbs: (breadcrumbs) => {
            set((state) => {
              state.breadcrumbs = breadcrumbs;
            });
          },

          setActiveTab: (tab) => {
            set((state) => {
              state.activeTab = tab;
            });
          },
        }))
      ),
      {
        name: 'ui-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
          language: state.language,
          activeTab: state.activeTab,
        }),
      }
    ),
    { name: 'ui-store' }
  )
);

// Data Store
export const useDataStore = create(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        // State
        users: [],
        departments: [],
        attendance: [],
        tasks: [],
        projects: [],
        notifications: [],
        reports: {},
        cache: {},
        lastFetch: {},

        // Actions
        setUsers: (users) => {
          set((state) => {
            state.users = users;
            state.lastFetch.users = new Date().toISOString();
          });
        },

        addUser: (user) => {
          set((state) => {
            state.users.push(user);
          });
        },

        updateUser: (id, updates) => {
          set((state) => {
            const userIndex = state.users.findIndex(u => u.id === id);
            if (userIndex !== -1) {
              state.users[userIndex] = { ...state.users[userIndex], ...updates };
            }
          });
        },

        removeUser: (id) => {
          set((state) => {
            state.users = state.users.filter(u => u.id !== id);
          });
        },

        setDepartments: (departments) => {
          set((state) => {
            state.departments = departments;
            state.lastFetch.departments = new Date().toISOString();
          });
        },

        setAttendance: (attendance) => {
          set((state) => {
            state.attendance = attendance;
            state.lastFetch.attendance = new Date().toISOString();
          });
        },

        addAttendance: (record) => {
          set((state) => {
            state.attendance.unshift(record);
          });
        },

        setTasks: (tasks) => {
          set((state) => {
            state.tasks = tasks;
            state.lastFetch.tasks = new Date().toISOString();
          });
        },

        updateTask: (id, updates) => {
          set((state) => {
            const taskIndex = state.tasks.findIndex(t => t.id === id);
            if (taskIndex !== -1) {
              state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
            }
          });
        },

        setProjects: (projects) => {
          set((state) => {
            state.projects = projects;
            state.lastFetch.projects = new Date().toISOString();
          });
        },

        setNotifications: (notifications) => {
          set((state) => {
            state.notifications = notifications;
          });
        },

        addNotification: (notification) => {
          set((state) => {
            state.notifications.unshift(notification);
          });
        },

        markNotificationRead: (id) => {
          set((state) => {
            const notification = state.notifications.find(n => n.id === id);
            if (notification) {
              notification.read = true;
              notification.readAt = new Date().toISOString();
            }
          });
        },

        setReport: (key, data) => {
          set((state) => {
            state.reports[key] = data;
          });
        },

        setCache: (key, data, ttl = 300000) => {
          set((state) => {
            state.cache[key] = {
              data,
              timestamp: Date.now(),
              ttl,
            };
          });
        },

        getCache: (key) => {
          const { cache } = get();
          const cached = cache[key];
          if (cached && Date.now() - cached.timestamp < cached.ttl) {
            return cached.data;
          }
          return null;
        },

        clearCache: (key) => {
          set((state) => {
            if (key) {
              delete state.cache[key];
            } else {
              state.cache = {};
            }
          });
        },

        isDataStale: (key, maxAge = 300000) => {
          const { lastFetch } = get();
          const lastFetchTime = lastFetch[key];
          if (!lastFetchTime) return true;
          return Date.now() - new Date(lastFetchTime).getTime() > maxAge;
        },
      }))
    ),
    { name: 'data-store' }
  )
);

// AI Store
export const useAIStore = create(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        // State
        aiModels: {},
        predictions: {},
        insights: {},
        recommendations: {},
        aiStatus: 'idle',
        lastAnalysis: null,
        modelPerformance: {},

        // Actions
        setAIModels: (models) => {
          set((state) => {
            state.aiModels = models;
          });
        },

        setPrediction: (key, prediction) => {
          set((state) => {
            state.predictions[key] = prediction;
          });
        },

        setInsight: (key, insight) => {
          set((state) => {
            state.insights[key] = insight;
          });
        },

        setRecommendation: (key, recommendation) => {
          set((state) => {
            state.recommendations[key] = recommendation;
          });
        },

        setAIStatus: (status) => {
          set((state) => {
            state.aiStatus = status;
          });
        },

        updateModelPerformance: (modelId, performance) => {
          set((state) => {
            state.modelPerformance[modelId] = performance;
          });
        },

        clearAIData: () => {
          set((state) => {
            state.predictions = {};
            state.insights = {};
            state.recommendations = {};
          });
        },
      }))
    ),
    { name: 'ai-store' }
  )
); 