import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

const RBACContext = createContext();

/**
 * RBAC Provider Component
 * Provides role-based access control context to child components
 */
export const RBACProvider = ({ children }) => {
  const { user, roles, permissions, isAuthenticated } = useAuthStore();
  const [rbacData, setRBACData] = useState({
    roles: [],
    permissions: [],
    isLoading: true
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setRBACData({
        roles: roles || [],
        permissions: permissions || [],
        isLoading: false
      });
    } else {
      setRBACData({
        roles: [],
        permissions: [],
        isLoading: false
      });
    }
  }, [user, roles, permissions, isAuthenticated]);

  const hasPermission = (permission) => {
    if (!isAuthenticated) return false;
    
    // Super admin has all permissions
    if (rbacData.roles.includes('SUPER_ADMIN')) return true;
    
    // Check for specific permission
    return rbacData.permissions.includes(permission);
  };

  const hasRole = (role) => {
    if (!isAuthenticated) return false;
    return rbacData.roles.includes(role);
  };

  const hasAnyRole = (requiredRoles) => {
    if (!isAuthenticated) return false;
    if (!Array.isArray(requiredRoles)) requiredRoles = [requiredRoles];
    return requiredRoles.some(role => hasRole(role));
  };

  const hasAnyPermission = (requiredPermissions) => {
    if (!isAuthenticated) return false;
    if (!Array.isArray(requiredPermissions)) requiredPermissions = [requiredPermissions];
    return requiredPermissions.some(permission => hasPermission(permission));
  };

  const isAdmin = () => {
    return hasAnyRole(['SUPER_ADMIN', 'SYSTEM_ADMIN']);
  };

  const isManager = () => {
    return hasAnyRole(['SUPER_ADMIN', 'SYSTEM_ADMIN', 'HR_MANAGER', 'FINANCE_MANAGER', 'PROJECT_MANAGER', 'DEPT_MANAGER']);
  };

  const canManageUsers = () => {
    return hasAnyPermission(['USER_CREATE', 'USER_UPDATE', 'USER_DELETE']) || isAdmin();
  };

  const canManageTasks = () => {
    return hasAnyPermission(['TASK_CREATE', 'TASK_UPDATE', 'TASK_DELETE']) || isManager();
  };

  const canViewReports = () => {
    return hasAnyPermission(['REPORT_VIEW', 'REPORT_CREATE']) || isManager();
  };

  const canManageFinance = () => {
    return hasAnyRole(['FINANCE_MANAGER', 'SUPER_ADMIN']) || 
           hasAnyPermission(['FINANCE_EXPENSE_APPROVE', 'FINANCE_INVOICE_CREATE', 'FINANCE_PAYMENT_MANAGE']);
  };

  const value = {
    ...rbacData,
    user,
    isAuthenticated,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAnyPermission,
    isAdmin,
    isManager,
    canManageUsers,
    canManageTasks,
    canViewReports,
    canManageFinance
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
};

/**
 * Hook to use RBAC context
 */
export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

export default RBACProvider;