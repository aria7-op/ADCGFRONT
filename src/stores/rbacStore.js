import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

const useRBACStore = create(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // State
          permissions: new Map(),
          roles: new Map(),
          userRoles: new Map(),
          userPermissions: new Map(),
          permissionCache: new Map(),
          roleCache: new Map(),
          context: {
            userId: null,
            sessionId: null,
            ip: null,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            location: null,
            device: null,
            riskScore: 0
          },
          uiPermissions: new Map(), // Frontend-specific permissions
          dynamicPermissions: new Map(), // Context-aware permissions
          permissionHistory: [],
          accessLog: [],
          isInitialized: false,
          lastSync: null,
          syncInterval: null,

          // Actions
          initialize: async (userId, sessionId) => {
            set((state) => {
              state.context.userId = userId;
              state.context.sessionId = sessionId;
              state.context.timestamp = new Date().toISOString();
            });

            // Load user permissions from backend
            await get().loadUserPermissions(userId);
            
            // Setup real-time sync
            get().setupRealtimeSync();
            
            // Setup context monitoring
            get().setupContextMonitoring();
            
            set((state) => {
              state.isInitialized = true;
              state.lastSync = new Date().toISOString();
            });
          },

          // Load user permissions from backend
          loadUserPermissions: async (userId) => {
            try {
              const response = await fetch(`/api/v1/rbac/user/${userId}/permissions`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                }
              });

              if (response.ok) {
                const data = await response.json();
                
                set((state) => {
                  // Clear existing permissions
                  state.permissions.clear();
                  state.roles.clear();
                  state.userRoles.clear();
                  state.userPermissions.clear();
                  
                  // Load permissions
                  data.permissions.forEach(permission => {
                    state.permissions.set(permission.id, permission);
                  });
                  
                  // Load roles
                  data.roles.forEach(role => {
                    state.roles.set(role.id, role);
                  });
                  
                  // Load user roles
                  data.userRoles.forEach(userRole => {
                    state.userRoles.set(userRole.id, userRole);
                  });
                  
                  // Load user permissions
                  data.userPermissions.forEach(userPermission => {
                    state.userPermissions.set(userPermission.id, userPermission);
                  });
                });

                // Build permission cache
                get().buildPermissionCache();
                
                // Update UI permissions
                get().updateUIPermissions();
                
                // Update dynamic permissions
                get().updateDynamicPermissions();
              }
            } catch (error) {
              console.error('Failed to load user permissions:', error);
            }
          },

          // Build permission cache for fast lookups
          buildPermissionCache: () => {
            const { permissions, roles, userRoles, userPermissions } = get();
            const cache = new Map();
            
            // Build role-based permissions
            userRoles.forEach(userRole => {
              const role = roles.get(userRole.roleId);
              if (role && role.permissions) {
                role.permissions.forEach(permission => {
                  const key = `${permission.resource}:${permission.action}`;
                  if (!cache.has(key)) {
                    cache.set(key, {
                      ...permission,
                      source: 'role',
                      roleId: role.id,
                      roleName: role.name,
                      priority: role.priority || 0
                    });
                  }
                });
              }
            });
            
            // Override with direct user permissions
            userPermissions.forEach(userPermission => {
              const permission = permissions.get(userPermission.permissionId);
              if (permission) {
                const key = `${permission.resource}:${permission.action}`;
                cache.set(key, {
                  ...permission,
                  source: 'direct',
                  granted: userPermission.isGranted,
                  temporary: userPermission.isTemporary
                });
              }
            });
            
            set((state) => {
              state.permissionCache = cache;
            });
          },

          // Update UI permissions based on current context
          updateUIPermissions: () => {
            const { permissionCache, context } = get();
            const uiPermissions = new Map();
            
            // Define UI-specific permissions
            const uiPermissionMap = {
              'dashboard:view': ['dashboard', 'read'],
              'dashboard:edit': ['dashboard', 'update'],
              'users:view': ['user', 'read'],
              'users:create': ['user', 'create'],
              'users:edit': ['user', 'update'],
              'users:delete': ['user', 'delete'],
              'attendance:view': ['attendance', 'read'],
              'attendance:create': ['attendance', 'create'],
              'attendance:edit': ['attendance', 'update'],
              'ai:view': ['ai', 'read'],
              'ai:use': ['ai', 'create'],
              'reports:view': ['report', 'read'],
              'reports:create': ['report', 'create'],
              'settings:view': ['setting', 'read'],
              'settings:edit': ['setting', 'update'],
              'rbac:view': ['rbac', 'read'],
              'rbac:edit': ['rbac', 'update']
            };
            
            // Check each UI permission
            Object.entries(uiPermissionMap).forEach(([uiPermission, [resource, action]]) => {
              const hasPermission = get().checkPermission(resource, action);
              uiPermissions.set(uiPermission, hasPermission);
            });
            
            set((state) => {
              state.uiPermissions = uiPermissions;
            });
          },

          // Update dynamic permissions based on context
          updateDynamicPermissions: () => {
            const { permissionCache, context } = get();
            const dynamicPermissions = new Map();
            
            // Apply context-based permission modifications
            permissionCache.forEach((permission, key) => {
              let modifiedPermission = { ...permission };
              
              // Time-based restrictions
              if (permission.timeRestrictions) {
                const now = new Date();
                const hour = now.getHours();
                const day = now.getDay();
                
                if (hour < permission.timeRestrictions.startHour || 
                    hour > permission.timeRestrictions.endHour ||
                    !permission.timeRestrictions.allowedDays.includes(day)) {
                  modifiedPermission.granted = false;
                }
              }
              
              // Location-based restrictions
              if (permission.locationRestrictions && context.location) {
                const isInAllowedLocation = permission.locationRestrictions.allowedLocations
                  .some(location => 
                    location.lat === context.location.lat && 
                    location.lng === context.location.lng
                  );
                
                if (!isInAllowedLocation) {
                  modifiedPermission.granted = false;
                }
              }
              
              // Risk-based restrictions
              if (permission.riskThreshold && context.riskScore > permission.riskThreshold) {
                modifiedPermission.granted = false;
              }
              
              // Device-based restrictions
              if (permission.deviceRestrictions && context.device) {
                const isAllowedDevice = permission.deviceRestrictions.allowedDevices
                  .some(device => context.device.type === device);
                
                if (!isAllowedDevice) {
                  modifiedPermission.granted = false;
                }
              }
              
              dynamicPermissions.set(key, modifiedPermission);
            });
            
            set((state) => {
              state.dynamicPermissions = dynamicPermissions;
            });
          },

          // Check permission with context
          checkPermission: (resource, action, context = {}) => {
            const { dynamicPermissions, context: globalContext } = get();
            const key = `${resource}:${action}`;
            
            // Check dynamic permissions first
            const dynamicPermission = dynamicPermissions.get(key);
            if (dynamicPermission) {
              if (dynamicPermission.source === 'direct' && !dynamicPermission.granted) {
                return false;
              }
              
              // Check conditions
              if (dynamicPermission.conditions) {
                const mergedContext = { ...globalContext, ...context };
                if (!get().evaluateConditions(dynamicPermission.conditions, mergedContext)) {
                  return false;
                }
              }
              
              return dynamicPermission.granted !== false;
            }
            
            return false;
          },

          // Check UI permission
          checkUIPermission: (permission) => {
            const { uiPermissions } = get();
            return uiPermissions.get(permission) || false;
          },

          // Evaluate conditions
          evaluateConditions: (conditions, context) => {
            for (const [key, value] of Object.entries(conditions)) {
              const contextValue = get().getNestedValue(context, key);
              
              if (typeof value === 'object' && value.operator) {
                switch (value.operator) {
                  case 'equals':
                    if (contextValue !== value.value) return false;
                    break;
                  case 'not_equals':
                    if (contextValue === value.value) return false;
                    break;
                  case 'in':
                    if (!value.value.includes(contextValue)) return false;
                    break;
                  case 'not_in':
                    if (value.value.includes(contextValue)) return false;
                    break;
                  case 'greater_than':
                    if (contextValue <= value.value) return false;
                    break;
                  case 'less_than':
                    if (contextValue >= value.value) return false;
                    break;
                  case 'regex':
                    if (!new RegExp(value.value).test(contextValue)) return false;
                    break;
                }
              } else {
                if (contextValue !== value) return false;
              }
            }
            
            return true;
          },

          // Helper method to get nested object values
          getNestedValue: (obj, path) => {
            return path.split('.').reduce((current, key) => current?.[key], obj);
          },

          // Setup real-time sync with backend
          setupRealtimeSync: () => {
            // Clear existing interval
            if (get().syncInterval) {
              clearInterval(get().syncInterval);
            }
            
            // Setup new sync interval
            const interval = setInterval(async () => {
              const { context } = get();
              if (context.userId) {
                await get().loadUserPermissions(context.userId);
                set((state) => {
                  state.lastSync = new Date().toISOString();
                });
              }
            }, 30000); // Sync every 30 seconds
            
            set((state) => {
              state.syncInterval = interval;
            });
          },

          // Setup context monitoring
          setupContextMonitoring: () => {
            // Monitor location changes
            if ('geolocation' in navigator) {
              navigator.geolocation.watchPosition(
                (position) => {
                  set((state) => {
                    state.context.location = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                      accuracy: position.coords.accuracy
                    };
                  });
                  get().updateDynamicPermissions();
                },
                (error) => {
                  console.warn('Location access denied:', error);
                }
              );
            }
            
            // Monitor device information
            set((state) => {
              state.context.device = {
                type: get().detectDeviceType(),
                screen: {
                  width: window.screen.width,
                  height: window.screen.height
                },
                platform: navigator.platform,
                language: navigator.language
              };
            });
            
            // Monitor network changes
            if ('connection' in navigator) {
              navigator.connection.addEventListener('change', () => {
                set((state) => {
                  state.context.network = {
                    type: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt
                  };
                });
              });
            }
            
            // Monitor focus/blur events
            document.addEventListener('visibilitychange', () => {
              set((state) => {
                state.context.isActive = !document.hidden;
              });
              get().updateDynamicPermissions();
            });
          },

          // Detect device type
          detectDeviceType: () => {
            const userAgent = navigator.userAgent.toLowerCase();
            
            if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
              return 'mobile';
            } else if (/tablet|ipad/i.test(userAgent)) {
              return 'tablet';
            } else {
              return 'desktop';
            }
          },

          // Log access attempt
          logAccess: (resource, action, granted, reason = null) => {
            const { context } = get();
            const logEntry = {
              id: uuidv4(),
              timestamp: new Date().toISOString(),
              userId: context.userId,
              resource,
              action,
              granted,
              reason,
              context: {
                ip: context.ip,
                userAgent: context.userAgent,
                location: context.location,
                device: context.device,
                riskScore: context.riskScore
              }
            };
            
            set((state) => {
              state.accessLog.push(logEntry);
              
              // Keep only last 1000 entries
              if (state.accessLog.length > 1000) {
                state.accessLog = state.accessLog.slice(-1000);
              }
            });
            
            // Send to backend for analytics
            get().sendAccessLogToBackend(logEntry);
          },

          // Send access log to backend
          sendAccessLogToBackend: async (logEntry) => {
            try {
              await fetch('/api/v1/rbac/access-log', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(logEntry)
              });
            } catch (error) {
              console.error('Failed to send access log:', error);
            }
          },

          // Get user roles
          getUserRoles: () => {
            const { userRoles, roles } = get();
            return Array.from(userRoles.values()).map(userRole => ({
              ...userRole,
              role: roles.get(userRole.roleId)
            }));
          },

          // Get user permissions
          getUserPermissions: () => {
            const { userPermissions, permissions } = get();
            return Array.from(userPermissions.values()).map(userPermission => ({
              ...userPermission,
              permission: permissions.get(userPermission.permissionId)
            }));
          },

          // Get all permissions for current user
          getAllUserPermissions: () => {
            const { dynamicPermissions } = get();
            return Array.from(dynamicPermissions.values());
          },

          // Check if user has any permission for resource
          hasAnyPermission: (resource) => {
            const { dynamicPermissions } = get();
            return Array.from(dynamicPermissions.keys()).some(key => 
              key.startsWith(`${resource}:`)
            );
          },

          // Get permissions for specific resource
          getResourcePermissions: (resource) => {
            const { dynamicPermissions } = get();
            const permissions = [];
            
            dynamicPermissions.forEach((permission, key) => {
              if (key.startsWith(`${resource}:`)) {
                permissions.push(permission);
              }
            });
            
            return permissions;
          },

          // Update risk score
          updateRiskScore: (score) => {
            set((state) => {
              state.context.riskScore = score;
            });
            get().updateDynamicPermissions();
          },

          // Clear all data
          clear: () => {
            if (get().syncInterval) {
              clearInterval(get().syncInterval);
            }
            
            set((state) => {
              state.permissions.clear();
              state.roles.clear();
              state.userRoles.clear();
              state.userPermissions.clear();
              state.permissionCache.clear();
              state.roleCache.clear();
              state.uiPermissions.clear();
              state.dynamicPermissions.clear();
              state.permissionHistory = [];
              state.accessLog = [];
              state.isInitialized = false;
              state.lastSync = null;
              state.syncInterval = null;
              state.context = {
                userId: null,
                sessionId: null,
                ip: null,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                location: null,
                device: null,
                riskScore: 0
              };
            });
          }
        }))
      ),
      {
        name: 'rbac-store',
        partialize: (state) => ({
          permissions: Array.from(state.permissions.entries()),
          roles: Array.from(state.roles.entries()),
          userRoles: Array.from(state.userRoles.entries()),
          userPermissions: Array.from(state.userPermissions.entries()),
          context: state.context,
          isInitialized: state.isInitialized,
          lastSync: state.lastSync
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Convert arrays back to Maps
            state.permissions = new Map(state.permissions);
            state.roles = new Map(state.roles);
            state.userRoles = new Map(state.userRoles);
            state.userPermissions = new Map(state.userPermissions);
            
            // Rebuild caches
            state.buildPermissionCache();
            state.updateUIPermissions();
            state.updateDynamicPermissions();
          }
        }
      }
    ),
    {
      name: 'RBAC Store'
    }
  )
);

export default useRBACStore; 