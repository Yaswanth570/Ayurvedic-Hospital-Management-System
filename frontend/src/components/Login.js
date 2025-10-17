import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

/**
 * Login component for user authentication
 * Handles user login with email and password
 */
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, error, clearError, lastAuthEvent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  /**
   * Handle input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form data
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      console.log('Login form submitted with:', formData.email);
      const result = await login(formData.email, formData.password);
      
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, redirecting to:', from);
        // Redirect to the page user was trying to access
        navigate(from, { replace: true });
      } else {
        // Error is handled by the auth context
        console.error('Login failed:', result.error);
        setSubmitError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setSubmitError(err?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🏥</div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your Ayurvedic Hospital account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Global Error Message */}
          {(error || submitError) && (
            <div className="alert alert-danger">
              {typeof (submitError || error) === 'string' ? (submitError || error) : 'Unable to reach server. Please try again.'}
              {lastAuthEvent && (
                <div style={{ marginTop: '6px', fontSize: '0.85rem', opacity: 0.9 }}>
                  <div><strong>Action:</strong> {lastAuthEvent.action}</div>
                  <div><strong>Status:</strong> {lastAuthEvent.status}</div>
                  {lastAuthEvent.tookMs !== undefined && (
                    <div><strong>Duration:</strong> {lastAuthEvent.tookMs} ms</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Enter your email"
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && (
              <div className="invalid-feedback">
                {errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password"
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="invalid-feedback">
                {errors.password}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="signup-link">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <div className="demo-account">
            <strong>Admin:</strong> admin@hospital.com / admin123
          </div>
          <div className="demo-account">
            <strong>Doctor:</strong> doctor@hospital.com / doctor123
          </div>
          <div className="demo-account">
            <strong>Patient:</strong> patient@hospital.com / patient123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
