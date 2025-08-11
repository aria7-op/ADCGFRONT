import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { apiClients, gatewayUtils } from '../services/apiGateway.js';

// Use pre-configured API clients from the gateway service
const { auth: authAPI, user: userAPI, rbac: rbacAPI } = apiClients;

export const useAuthStore = create(
  persist(
    immer((set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      permissions: [],
      roles: [],
      lastActivity: null,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      updateLastActivity: () => set({ lastActivity: Date.now() }),

      // Advanced Login with RBAC
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔐 Attempting login with:', credentials.email);
          
          // Login to auth service
          const authResponse = await authAPI.post('/login', credentials);
          
          console.log('🔐 Auth response:', authResponse);
          
          // Backend returns { message, token, user } format
          if (!authResponse.token || !authResponse.user) {
            throw new Error(authResponse.error || 'Login failed');
          }

          const { token, user } = authResponse;
          
          console.log('🔐 Setting auth state for user:', user.email);
          
          // Store token
          localStorage.setItem('authToken', token);
          
          // Set user state directly from auth response
          set((state) => {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.roles = user.roles || [];
            state.lastActivity = Date.now();
            state.error = null;
          });

          console.log('🔐 Auth state set, starting session monitoring');
          
          // Start session monitoring
          get().startSessionMonitoring();
          
          const finalState = get();
          console.log('🔐 Final auth state:', {
            isAuthenticated: finalState.isAuthenticated,
            user: finalState.user?.email
          });
          
          return { success: true, user: get().user };
        } catch (error) {
          console.error('🔐 Login error:', error);
          set({ error: error.message, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Advanced Registration
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authAPI.post('/register', userData);
          
          if (!response.success) {
            throw new Error(response.message || 'Registration failed');
          }

          // Auto-login after registration
          await get().login({
            email: userData.email,
            password: userData.password
          });

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout with cleanup
      logout: async () => {
        try {
          // Call logout endpoint if available
          await authAPI.post('/logout');
        } catch (error) {
          console.warn('Logout endpoint not available:', error);
        }

        // Clear local storage
        localStorage.removeItem('authToken');
        
        // Reset state
        set((state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.permissions = [];
          state.roles = [];
          state.lastActivity = null;
          state.error = null;
        });

        // Stop session monitoring
        get().stopSessionMonitoring();
      },

      // Session Management
      startSessionMonitoring: () => {
        const interval = setInterval(() => {
          const { lastActivity, sessionTimeout } = get();
          
          if (lastActivity && Date.now() - lastActivity > sessionTimeout) {
            get().logout();
            clearInterval(interval);
          }
        }, 60000); // Check every minute

        // Store interval ID for cleanup
        set({ sessionInterval: interval });
      },

      stopSessionMonitoring: () => {
        const { sessionInterval } = get();
        if (sessionInterval) {
          clearInterval(sessionInterval);
          set({ sessionInterval: null });
        }
      },

      // Permission checking
      hasPermission: (permission) => {
        const { permissions, user } = get();
        
        // Superadmin has all permissions
        if (user?.role === 'superadmin') {
          return true;
        }
        
        return permissions.includes(permission);
      },

      hasRole: (role) => {
        const { roles, user } = get();
        
        // Superadmin has all roles
        if (user?.role === 'superadmin') {
          return true;
        }
        
        return roles.includes(role);
      },

      // Refresh token
      refreshToken: async () => {
        try {
          const response = await authAPI.post('/refresh');
          
          if (response.success) {
            const { token } = response.data;
            localStorage.setItem('authToken', token);
            set({ token, lastActivity: Date.now() });
            return true;
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
          return false;
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await userAPI.put('/profile', profileData);
          
          if (!response.success) {
            throw new Error(response.message || 'Profile update failed');
          }

          set((state) => {
            state.user = { ...state.user, ...response.data };
          });

          return { success: true };
        } catch (error) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Initialize auth state from stored token
      initializeAuth: async () => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          return false;
        }

        try {
          set({ token, isLoading: true });
          
          // For now, just verify the token exists and set basic auth state
          // We'll enhance this later with proper token verification
          const currentState = get();
          
          if (currentState.user && currentState.isAuthenticated) {
            // If we already have user data from persist, use it
            set({ lastActivity: Date.now() });
            get().startSessionMonitoring();
            return true;
          }
          
          // If no user data, clear the invalid token
          localStorage.removeItem('authToken');
          set({ token: null, isAuthenticated: false, user: null });
          return false;
        } catch (error) {
          console.error('Auth initialization failed:', error);
          get().logout();
          return false;
        } finally {
          set({ isLoading: false });
        }
      }
    })),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Export API clients for use in other stores
export { authAPI, userAPI, rbacAPI }; 