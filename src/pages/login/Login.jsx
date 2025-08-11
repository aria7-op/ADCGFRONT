import React, { useState, useEffect } from 'react';
import { useLogin } from '../../hooks/useAuth';
import { useNotificationStore } from '../../stores/notificationStore';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = useLogin();
  const authLoading = loginMutation.isPending;
  const authError = loginMutation.error?.message;

  const { sendNotification } = useNotificationStore();

  // Clear errors when switching modes
  useEffect(() => {
    if (authError) {
      loginMutation.reset();
    }
  }, [isRegistering, authError, loginMutation]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const targetData = isRegistering ? registerData : formData;
    const setTargetData = isRegistering ? setRegisterData : setFormData;
    
    setTargetData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginMutation.mutateAsync(formData);
      
      // Send welcome notification
      await sendNotification({
        userId: result.user.id,
        title: 'Welcome Back!',
        message: `Welcome back, ${result.user.firstName}! You have successfully logged in.`,
        type: 'success',
        priority: 'medium'
      });

      // React Query will handle the state update and redirect
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterData(prev => ({ ...prev, confirmPassword: '' }));
      return;
    }

    try {
      const result = await register(registerData);
      
      if (result.success) {
        // Send welcome notification
        await sendNotification({
          userId: useAuthStore.getState().user?.id,
          title: 'Welcome to ADCGMIS!',
          message: 'Your account has been created successfully. Welcome to our system!',
          type: 'success',
          priority: 'high'
        });

        // Let App.jsx handle the redirect automatically
        // The authentication state change will trigger the redirect
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDemoLogin = async (role) => {
    setIsLoading(true);
    clearError();

    const demoCredentials = {
      superadmin: { email: 'superadmin@adcgmis.com', password: 'SuperAdmin123!' },
      admin: { email: 'sysadmin@adcgmis.com', password: 'SysAdmin123!' },
      manager: { email: 'manager@adcgmis.com', password: 'Manager123!' },
      developer: { email: 'developer@adcgmis.com', password: 'Developer123!' },
      user: { email: 'user@adcgmis.com', password: 'User123!' }
    };

    try {
      const result = await loginMutation.mutateAsync(demoCredentials[role]);
      
      await sendNotification({
        userId: result.user.id,
        title: 'Demo Login Successful',
        message: `You are now logged in as ${role.toUpperCase()}`,
        type: 'info',
        priority: 'medium'
      });

      // React Query will handle the state update and redirect
    } catch (error) {
      console.error('Demo login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-background-overlay"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <h1>ADCGMIS</h1>
            <p>Advanced Dynamic Corporate Governance Management Information System</p>
          </div>
        </div>

        <div className="login-tabs">
          <button 
            className={`tab ${!isRegistering ? 'active' : ''}`}
            onClick={() => setIsRegistering(false)}
          >
            Sign In
          </button>
          <button 
            className={`tab ${isRegistering ? 'active' : ''}`}
            onClick={() => setIsRegistering(true)}
          >
            Register
          </button>
        </div>

        {authError && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {authError}
          </div>
        )}

        {!isRegistering ? (
          // Login Form
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
                <span className="input-icon">📧</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <span className="input-icon">🔒</span>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading || authLoading}
            >
              {isLoading || authLoading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        ) : (
          // Registration Form
          <form onSubmit={handleRegister} className="login-form">
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="reg-name"
                  name="name"
                  value={registerData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
                <span className="input-icon">👤</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  value={registerData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
                <span className="input-icon">📧</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  name="password"
                  value={registerData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                  minLength={8}
                />
                <span className="input-icon">🔒</span>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm-password">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-confirm-password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
                <span className="input-icon">🔒</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-role">Role</label>
              <div className="input-wrapper">
                <select
                  id="reg-role"
                  name="role"
                  value={registerData.role}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <span className="input-icon">👥</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading || authLoading}
            >
              {isLoading || authLoading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        {/* Demo Login Section */}
        <div className="demo-section">
          <h3>Quick Demo Access</h3>
          <p>Test the system with different user roles:</p>
          <div className="demo-buttons">
            <button
              onClick={() => handleDemoLogin('superadmin')}
              className="demo-button superadmin"
              disabled={isLoading}
            >
              Super Admin
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="demo-button admin"
              disabled={isLoading}
            >
              Admin
            </button>
            <button
              onClick={() => handleDemoLogin('manager')}
              className="demo-button manager"
              disabled={isLoading}
            >
              Manager
            </button>
            <button
              onClick={() => handleDemoLogin('developer')}
              className="demo-button developer"
              disabled={isLoading}
            >
              Developer
            </button>
            <button
              onClick={() => handleDemoLogin('user')}
              className="demo-button user"
              disabled={isLoading}
            >
              User
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>&copy; 2024 ADCGMIS. All rights reserved.</p>
          <p>Advanced Dynamic Corporate Governance Management Information System</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
