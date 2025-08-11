import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rbacAPI } from '../stores/authStore';

// Get user permissions
export const useUserPermissions = () => {
  return useQuery({
    queryKey: ['rbac', 'permissions'],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return [];
      
      // For now, return cached permissions from auth state
      // In a real app, you'd fetch from the RBAC service
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get user roles
export const useUserRoles = () => {
  return useQuery({
    queryKey: ['rbac', 'roles'],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return [];
      
      // For now, return cached roles from auth state
      // In a real app, you'd fetch from the RBAC service
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Check permission
export const useHasPermission = (permission) => {
  const { data: permissions = [] } = useUserPermissions();
  
  return {
    hasPermission: permissions.includes(permission),
    isLoading: false
  };
};

// Check role
export const useHasRole = (role) => {
  const { data: roles = [] } = useUserRoles();
  
  return {
    hasRole: roles.includes(role),
    isLoading: false
  };
};

// RBAC context hook
export const useRBAC = () => {
  const { data: permissions = [] } = useUserPermissions();
  const { data: roles = [] } = useUserRoles();
  
  const hasPermission = (permission) => {
    // Superadmin has all permissions
    if (roles.includes('SUPER_ADMIN')) return true;
    return permissions.includes(permission);
  };
  
  const hasRole = (role) => {
    return roles.includes(role);
  };
  
  const hasAnyRole = (requiredRoles) => {
    return requiredRoles.some(role => hasRole(role));
  };
  
  const hasAnyPermission = (requiredPermissions) => {
    return requiredPermissions.some(permission => hasPermission(permission));
  };
  
  return {
    permissions,
    roles,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAnyPermission,
    isLoading: false
  };
}; 