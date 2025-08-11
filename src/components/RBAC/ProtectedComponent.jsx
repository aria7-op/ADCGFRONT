import React from 'react';
import { useRBAC } from './RBACProvider';

/**
 * ProtectedComponent - Conditionally renders content based on permissions/roles
 */
export const ProtectedComponent = ({ 
  children, 
  permission, 
  role, 
  permissions, 
  roles, 
  requireAll = false,
  fallback = null,
  showFallback = true
}) => {
  const rbac = useRBAC();

  // If not authenticated, don't show protected content
  if (!rbac.isAuthenticated) {
    return showFallback ? fallback : null;
  }

  let hasAccess = false;

  // Check single permission
  if (permission) {
    hasAccess = rbac.hasPermission(permission);
  }
  
  // Check single role
  else if (role) {
    hasAccess = rbac.hasRole(role);
  }
  
  // Check multiple permissions
  else if (permissions && Array.isArray(permissions)) {
    if (requireAll) {
      hasAccess = permissions.every(p => rbac.hasPermission(p));
    } else {
      hasAccess = rbac.hasAnyPermission(permissions);
    }
  }
  
  // Check multiple roles
  else if (roles && Array.isArray(roles)) {
    if (requireAll) {
      hasAccess = roles.every(r => rbac.hasRole(r));
    } else {
      hasAccess = rbac.hasAnyRole(roles);
    }
  }
  
  // If no specific permission/role specified, just check if authenticated
  else {
    hasAccess = true;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return showFallback ? fallback : null;
};

/**
 * RequirePermission - Component wrapper for permission-based access
 */
export const RequirePermission = ({ permission, children, fallback }) => (
  <ProtectedComponent permission={permission} fallback={fallback}>
    {children}
  </ProtectedComponent>
);

/**
 * RequireRole - Component wrapper for role-based access
 */
export const RequireRole = ({ role, children, fallback }) => (
  <ProtectedComponent role={role} fallback={fallback}>
    {children}
  </ProtectedComponent>
);

/**
 * RequireAnyPermission - Component wrapper for multiple permissions (OR logic)
 */
export const RequireAnyPermission = ({ permissions, children, fallback }) => (
  <ProtectedComponent permissions={permissions} requireAll={false} fallback={fallback}>
    {children}
  </ProtectedComponent>
);

/**
 * RequireAllPermissions - Component wrapper for multiple permissions (AND logic)
 */
export const RequireAllPermissions = ({ permissions, children, fallback }) => (
  <ProtectedComponent permissions={permissions} requireAll={true} fallback={fallback}>
    {children}
  </ProtectedComponent>
);

/**
 * RequireAnyRole - Component wrapper for multiple roles (OR logic)
 */
export const RequireAnyRole = ({ roles, children, fallback }) => (
  <ProtectedComponent roles={roles} requireAll={false} fallback={fallback}>
    {children}
  </ProtectedComponent>
);

/**
 * AdminOnly - Component wrapper for admin access only
 */
export const AdminOnly = ({ children, fallback }) => {
  const rbac = useRBAC();
  
  if (!rbac.isAdmin()) {
    return fallback || null;
  }
  
  return <>{children}</>;
};

/**
 * ManagerOnly - Component wrapper for manager access only
 */
export const ManagerOnly = ({ children, fallback }) => {
  const rbac = useRBAC();
  
  if (!rbac.isManager()) {
    return fallback || null;
  }
  
  return <>{children}</>;
};

/**
 * ConditionalRender - Renders different content based on permissions
 */
export const ConditionalRender = ({ 
  permission, 
  role, 
  hasAccess, 
  noAccess, 
  loading 
}) => {
  const rbac = useRBAC();

  if (rbac.isLoading) {
    return loading || <div>Loading permissions...</div>;
  }

  let canAccess = false;

  if (permission) {
    canAccess = rbac.hasPermission(permission);
  } else if (role) {
    canAccess = rbac.hasRole(role);
  }

  return canAccess ? (hasAccess || null) : (noAccess || null);
};

export default ProtectedComponent;