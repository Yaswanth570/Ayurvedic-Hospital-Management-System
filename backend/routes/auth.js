const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Authentication Routes for Ayurvedic Hospital Management System
 * Handles user registration, login, and profile management
 */

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 * @body    { name, email, password, role }
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role = 'patient' } = req.body;
    console.log('[AUTH][SIGNUP] Request received', { email, role });

    // Validate required fields
    if (!name || !email || !password) {
      console.warn('[AUTH][SIGNUP] Missing fields', { hasName: !!name, hasEmail: !!email, hasPassword: !!password });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password',
        error: 'MISSING_FIELDS'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      console.warn('[AUTH][SIGNUP] Invalid email format', { email });
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
        error: 'INVALID_EMAIL'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      console.warn('[AUTH][SIGNUP] Weak password');
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
        error: 'WEAK_PASSWORD'
      });
    }

    // Validate role
    const validRoles = ['patient', 'doctor', 'admin'];
    if (!validRoles.includes(role)) {
      console.warn('[AUTH][SIGNUP] Invalid role', { role });
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: patient, doctor, admin',
        error: 'INVALID_ROLE'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.warn('[AUTH][SIGNUP] User exists', { email });
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        error: 'USER_EXISTS'
      });
    }

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role
    });

    // Save user to database (password will be hashed by pre-save middleware)
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Update last login
    newUser.lastLogin = new Date();
    await newUser.save();

    // Return success response with user data (without password)
    console.log('[AUTH][SIGNUP] Success', { userId: newUser._id, role: newUser.role });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('[AUTH][SIGNUP] Error', { message: error.message, name: error.name, stack: error.stack });
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
        error: 'VALIDATION_ERROR'
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        error: 'DUPLICATE_EMAIL'
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      error: 'REGISTRATION_ERROR'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[AUTH][LOGIN] Request received', { email });

    // Validate required fields
    if (!email || !password) {
      console.warn('[AUTH][LOGIN] Missing credentials');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
        error: 'MISSING_CREDENTIALS'
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      console.warn('[AUTH][LOGIN] User not found for email', { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.warn('[AUTH][LOGIN] Account deactivated', { userId: user._id });
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.warn('[AUTH][LOGIN] Invalid password', { userId: user._id });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return success response with user data (without password)
    console.log('[AUTH][LOGIN] Success', { userId: user._id, role: user.role });
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('[AUTH][LOGIN] Error', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: 'LOGIN_ERROR'
    });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // User information is already available in req.user from middleware
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during profile retrieval',
      error: 'PROFILE_ERROR'
    });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 * @body    { name, email }
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update',
        error: 'NO_UPDATE_FIELDS'
      });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
          error: 'INVALID_EMAIL'
        });
      }
    }

    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email is already taken by another user',
          error: 'EMAIL_TAKEN'
        });
      }
    }

    // Update user
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
        error: 'VALIDATION_ERROR'
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email is already taken by another user',
        error: 'DUPLICATE_EMAIL'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during profile update',
      error: 'UPDATE_ERROR'
    });
  }
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 * @body    { currentPassword, newPassword }
 */
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password',
        error: 'MISSING_PASSWORDS'
      });
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
        error: 'WEAK_PASSWORD'
      });
    }

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
        error: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save(); // Password will be hashed by pre-save middleware

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during password change',
      error: 'PASSWORD_CHANGE_ERROR'
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticateToken, (req, res) => {
  // Since we're using stateless JWT tokens, logout is handled client-side
  // by removing the token from storage
  res.status(200).json({
    success: true,
    message: 'Logout successful. Please remove token from client storage.'
  });
});

/**
 * @route   GET /api/auth/verify-token
 * @desc    Verify if JWT token is valid
 * @access  Private
 */
router.get('/verify-token', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    data: {
      user: req.user
    }
  });
});

module.exports = router;
