import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Authentication Context for managing user authentication state
 * Provides authentication methods and user data throughout the app
 */
const AuthContext = createContext();

/**
 * Custom hook to use authentication context
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider component that wraps the app and provides authentication context
 * @param {Object} children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastAuthEvent, setLastAuthEvent] = useState(null); // { action, status, message, tookMs }

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Configure axios base URL and interceptors
  useEffect(() => {
    // Prefer env var in production; otherwise use relative URL to flow through CRA proxy
    const envBaseUrl = process.env.REACT_APP_API_URL;
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    axios.defaults.baseURL = envBaseUrl || (isLocalhost ? '' : '');
    axios.defaults.timeout = 10000; // fail fast instead of hanging indefinitely
    
    // Add request interceptor for logging & timing
    axios.interceptors.request.use(
      (config) => {
        const method = config.method?.toUpperCase();
        const url = config.url;
        // attach metadata for timing
        config.metadata = { startTime: Date.now() };
        console.log('[API] Request →', method, url, {
          baseURL: config.baseURL,
          hasAuth: !!config.headers?.Authorization,
        });
        return config;
      },
      (error) => {
        console.error('[API] Request setup error:', error?.message, error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for timing & error handling
    axios.interceptors.response.use(
      (response) => {
        const { config, status } = response;
        const durationMs = config?.metadata?.startTime ? Date.now() - config.metadata.startTime : undefined;
        console.log('[API] Response ←', status, config?.method?.toUpperCase(), config?.url, { durationMs });
        return response;
      },
      (error) => {
        const cfg = error.config || {};
        const durationMs = cfg?.metadata?.startTime ? Date.now() - cfg.metadata.startTime : undefined;
        const status = error.response?.status;
        const data = error.response?.data;
        const isNetworkError = !error.response;
        console.error('[API] Error ×', status || 'NETWORK', cfg?.method?.toUpperCase(), cfg?.url, {
          durationMs,
          message: error.message,
          data,
          baseURL: cfg.baseURL,
        });
        return Promise.reject(error);
      }
    );
  }, []);

  /**
   * Check if user is authenticated by verifying token
   */
  const checkAuth = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      console.log('Verifying token...');
      const response = await axios.get('/api/auth/verify-token');
      if (response.data.success) {
        setUser(response.data.data.user);
        console.log('Token verified for user:', response.data.data.user.name);
      } else {
        // Token is invalid, remove it
        console.log('Token verification failed, removing token');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      // Token is invalid or expired, remove it
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Login user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Login response
   */
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log('[Auth] Login start for:', email);
      const stepStartedAt = Date.now();

      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      console.log('[Auth] Login API OK', {
        status: response.status,
        tookMs: Date.now() - stepStartedAt,
      });

      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('token', authToken);
        setToken(authToken);
        setUser(userData);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
        console.log('[Auth] Login success for user:', userData.name);
        setLastAuthEvent({ action: 'login', status: response.status, message: 'OK', tookMs: Date.now() - stepStartedAt, url: response.config?.url });
        return { success: true, user: userData };
      } else {
        const msg = response.data.message || 'Login failed';
        console.warn('[Auth] Login API returned unsuccessful:', msg);
        throw new Error(msg);
      }
    } catch (error) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const errorMessage = serverMessage || error.message || 'Login failed';
      console.error('[Auth] Login error:', {
        status,
        message: errorMessage,
        url: error.config?.url,
      });
      setError(errorMessage);
      setLastAuthEvent({ action: 'login', status: status || 'NETWORK', message: errorMessage, url: error.config?.url });
      return { success: false, error: errorMessage, status };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  const signup = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      console.log('[Auth] Signup start for:', userData.email);
      const stepStartedAt = Date.now();

      const response = await axios.post('/api/auth/signup', userData);

      console.log('[Auth] Signup API OK', {
        status: response.status,
        tookMs: Date.now() - stepStartedAt,
      });

      if (response.data.success) {
        const { user: newUser, token: authToken } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('token', authToken);
        setToken(authToken);
        setUser(newUser);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
        console.log('[Auth] Signup success for user:', newUser.name);
        setLastAuthEvent({ action: 'signup', status: response.status, message: 'OK', tookMs: Date.now() - stepStartedAt, url: response.config?.url });
        return { success: true, user: newUser };
      } else {
        const msg = response.data.message || 'Registration failed';
        console.warn('[Auth] Signup API returned unsuccessful:', msg);
        throw new Error(msg);
      }
    } catch (error) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      console.error('[Auth] Signup error:', { status, message: errorMessage, url: error.config?.url });
      setError(errorMessage);
      setLastAuthEvent({ action: 'signup', status: status || 'NETWORK', message: errorMessage, url: error.config?.url });
      return { success: false, error: errorMessage, status };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user and clear authentication data
   */
  const logout = async () => {
    try {
      // Call logout endpoint (optional, for server-side cleanup)
      if (token) {
        await axios.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of server response
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  /**
   * Update user profile
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Update response
   */
  const updateProfile = async (updateData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.put('/api/auth/profile', updateData);

      if (response.data.success) {
        setUser(response.data.data.user);
        return { success: true, user: response.data.data.user };
      } else {
        throw new Error(response.data.message || 'Profile update failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Change password response
   */
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Password change failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Password change failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Check if user has specific role
   * @param {string|Array} roles - Role(s) to check
   * @returns {boolean} True if user has required role
   */
  const hasRole = (roles) => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  /**
   * Check if user is admin
   * @returns {boolean} True if user is admin
   */
  const isAdmin = () => {
    return hasRole('admin');
  };

  /**
   * Check if user is doctor
   * @returns {boolean} True if user is doctor
   */
  const isDoctor = () => {
    return hasRole('doctor');
  };

  /**
   * Check if user is patient
   * @returns {boolean} True if user is patient
   */
  const isPatient = () => {
    return hasRole('patient');
  };

  const value = {
    user,
    token,
    loading,
    error,
    lastAuthEvent,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    clearError,
    hasRole,
    isAdmin,
    isDoctor,
    isPatient,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
