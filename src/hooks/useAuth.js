import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../stores/authStore';

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials) => {
      const response = await authAPI.post('/login', credentials);
      
      if (!response.token || !response.user) {
        throw new Error(response.error || 'Login failed');
      }
      
      return response;
    },
    onSuccess: (data) => {
      // Store token
      localStorage.setItem('authToken', data.token);
      
      // Update auth state
      queryClient.setQueryData(['auth', 'user'], data.user);
      queryClient.setQueryData(['auth', 'token'], data.token);
      queryClient.setQueryData(['auth', 'isAuthenticated'], true);
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Login error:', error);
      // Clear any existing auth data
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.setQueryData(['auth', 'token'], null);
      queryClient.setQueryData(['auth', 'isAuthenticated'], false);
    }
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        await authAPI.post('/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    },
    onSuccess: () => {
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('auth-storage');
      
      // Clear all query cache
      queryClient.clear();
      
      // Reset auth state
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.setQueryData(['auth', 'token'], null);
      queryClient.setQueryData(['auth', 'isAuthenticated'], false);
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Still clear everything even if logout fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('auth-storage');
      queryClient.clear();
    }
  });
};

// Get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return null;
      
      // For now, return cached user data
      // In a real app, you'd validate the token with the backend
      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Check authentication status
export const useAuthStatus = () => {
  return useQuery({
    queryKey: ['auth', 'isAuthenticated'],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      return !!token;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get auth token
export const useAuthToken = () => {
  return useQuery({
    queryKey: ['auth', 'token'],
    queryFn: async () => {
      return localStorage.getItem('authToken');
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}; 