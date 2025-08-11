// Intelligent API Gateway Integration
// This file provides a unified interface to the intelligent API Gateway

// Gateway configuration
const API_GATEWAY = {
  BASE_URL: 'http://192.168.0.7:4000',
  API_PREFIX: '/api/v1',
  HEALTH_CHECK: '/health',
  METRICS: '/metrics'
};

// Service endpoints through intelligent gateway
export const API_ENDPOINTS = {
  // Gateway endpoints
  GATEWAY: API_GATEWAY.BASE_URL,
  HEALTH: `${API_GATEWAY.BASE_URL}${API_GATEWAY.HEALTH_CHECK}`,
  METRICS: `${API_GATEWAY.BASE_URL}${API_GATEWAY.METRICS}`,
  
  // Service-specific paths (gateway will route intelligently)
  AUTH: `${API_GATEWAY.BASE_URL}${API_GATEWAY.API_PREFIX}/auth`,
  USER: `${API_GATEWAY.BASE_URL}${API_GATEWAY.API_PREFIX}/user`,
  RBAC: `${API_GATEWAY.BASE_URL}${API_GATEWAY.API_PREFIX}/rbac`,
  TASK: `${API_GATEWAY.BASE_URL}${API_GATEWAY.API_PREFIX}/task`,
  ATTENDANCE: `${API_GATEWAY.BASE_URL}${API_GATEWAY.API_PREFIX}/attendance`,
  AI: `${API_GATEWAY.BASE_URL}${API_GATEWAY.API_PREFIX}/ai`,
  NOTIFICATION: `${API_GATEWAY.BASE_URL}${API_GATEWAY.API_PREFIX}/notifications`,
  REPORT: `${API_GATEWAY.BASE_URL}${API_GATEWAY.API_PREFIX}/reports`,
  MONITORING: `${API_GATEWAY.BASE_URL}${API_GATEWAY.API_PREFIX}/monitoring`,
  SESSION: `${API_GATEWAY.BASE_URL}${API_GATEWAY.API_PREFIX}/sessions`
};

// Intelligent API Gateway client with enhanced routing support
export class IntelligentAPIClient {
  constructor(baseURL, serviceName = null) {
    this.baseURL = baseURL;
    this.serviceName = serviceName;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    this.requestId = null;
  }

  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    this.requestId = this.generateRequestId();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // Headers for intelligent routing
        'X-Request-ID': this.requestId,
        'X-Client-Type': 'web-app',
        'X-API-Version': 'v1',
        'X-User-Agent': navigator.userAgent,
        ...options.headers
      },
      ...options
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add session ID for session management
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers['X-Session-ID'] = sessionId;
    }

    // Add service routing hints for the intelligent gateway
    if (this.serviceName) {
      config.headers['X-Target-Service'] = this.serviceName;
    }

    // Add request type for content-based routing
    if (options.body) {
      let bodyData;
      try {
        bodyData = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
        if (bodyData.type) {
          config.headers['X-Request-Type'] = bodyData.type;
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`🌐 [${this.serviceName || 'Gateway'}] Making request to:`, url, {
          requestId: this.requestId,
          attempt,
          method: options.method || 'GET',
          headers: { ...config.headers, Authorization: config.headers.Authorization ? '[REDACTED]' : undefined }
        });

        const response = await fetch(url, config);
        
        // Log routing information from gateway
        const routedBy = response.headers.get('X-Routed-By');
        const targetService = response.headers.get('X-Target-Service');
        const routingMethod = response.headers.get('X-Routing-Method');
        
        if (routedBy) {
          console.log(`🎯 Request routed by: ${routedBy}, Target: ${targetService}, Method: ${routingMethod}`);
        }
        
        if (!response.ok) {
          if (response.status === 401) {
            // Token expired, clear auth state
            localStorage.removeItem('authToken');
            localStorage.removeItem('sessionId');
            
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
            throw new Error('Authentication required');
          }
          
          if (response.status === 403) {
            throw new Error('Access denied - insufficient permissions');
          }
          
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Store session info if provided by gateway
        if (data.sessionId) {
          localStorage.setItem('sessionId', data.sessionId);
        }
        
        // Store routing info for analytics
        if (data.routingInfo) {
          console.log('📊 Routing analytics:', data.routingInfo);
        }
        
        return data;
      } catch (error) {
        console.error(`❌ [${this.serviceName || 'Gateway'}] Request failed:`, {
          requestId: this.requestId,
          attempt,
          error: error.message,
          url
        });
        
        if (attempt === this.retryAttempts) {
          throw error;
        }
        
        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Pre-configured API clients for each service
export const apiClients = {
  auth: new IntelligentAPIClient(API_ENDPOINTS.AUTH, 'auth-service'),
  user: new IntelligentAPIClient(API_ENDPOINTS.USER, 'user-service'),
  rbac: new IntelligentAPIClient(API_ENDPOINTS.RBAC, 'rbac-service'),
  task: new IntelligentAPIClient(API_ENDPOINTS.TASK, 'task-service'),
  attendance: new IntelligentAPIClient(API_ENDPOINTS.ATTENDANCE, 'attendance-service'),
  ai: new IntelligentAPIClient(API_ENDPOINTS.AI, 'ai-service'),
  notification: new IntelligentAPIClient(API_ENDPOINTS.NOTIFICATION, 'notification-service'),
  report: new IntelligentAPIClient(API_ENDPOINTS.REPORT, 'report-service'),
  monitoring: new IntelligentAPIClient(API_ENDPOINTS.MONITORING, 'monitoring-service'),
  session: new IntelligentAPIClient(API_ENDPOINTS.SESSION, 'session-service'),
  gateway: new IntelligentAPIClient(API_ENDPOINTS.GATEWAY, 'api-gateway')
};

// Utility functions
export const gatewayUtils = {
  // Check gateway health
  async checkHealth() {
    try {
      const response = await fetch(API_ENDPOINTS.HEALTH);
      return await response.json();
    } catch (error) {
      console.error('Gateway health check failed:', error);
      return { status: 'ERROR', error: error.message };
    }
  },

  // Get routing metrics
  async getMetrics() {
    try {
      const response = await fetch(API_ENDPOINTS.METRICS);
      return await response.json();
    } catch (error) {
      console.error('Failed to get metrics:', error);
      return null;
    }
  },

  // Test intelligent routing
  async testRouting(serviceType, requestData) {
    const testClient = new IntelligentAPIClient(API_ENDPOINTS.GATEWAY, serviceType);
    return await testClient.post('/test-route', {
      type: serviceType,
      ...requestData
    });
  }
};

export default {
  API_ENDPOINTS,
  IntelligentAPIClient,
  apiClients,
  gatewayUtils
};