const express = require('express');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Dashboard Routes for Ayurvedic Hospital Management System
 * Provides dashboard statistics and data based on user role
 */

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics based on user role
 * @access  Private
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    let stats = {};

    if (userRole === 'admin' || userRole === 'doctor') {
      // Admin and Doctor can see all statistics
      const [totalDoctors, totalPatients, activeDoctors, activePatients] = await Promise.all([
        Doctor.countDocuments(),
        Patient.countDocuments(),
        Doctor.countDocuments({ isActive: true }),
        Patient.countDocuments({ isActive: true })
      ]);

      stats = {
        totalDoctors,
        totalPatients,
        activeDoctors,
        activePatients,
        totalUsers: totalDoctors + totalPatients
      };
    } else if (userRole === 'patient') {
      // Patient can only see their own data and general doctor count
      const [totalDoctors, activeDoctors, patientProfile] = await Promise.all([
        Doctor.countDocuments({ isActive: true }),
        Doctor.countDocuments({ isActive: true }),
        Patient.findOne({ user: req.user._id })
      ]);

      stats = {
        totalDoctors,
        totalPatients: patientProfile ? 1 : 0,
        activeDoctors,
        activePatients: patientProfile && patientProfile.isActive ? 1 : 0,
        totalUsers: 1
      };
    }

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        stats
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving dashboard statistics',
      error: 'GET_DASHBOARD_STATS_ERROR'
    });
  }
});

/**
 * @route   GET /api/dashboard/recent-data
 * @desc    Get recent doctors and patients data based on user role
 * @access  Private
 */
router.get('/recent-data', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    const limit = parseInt(req.query.limit) || 5;
    let recentDoctors = [];
    let recentPatients = [];

    if (userRole === 'admin' || userRole === 'doctor') {
      // Admin and Doctor can see all recent data
      [recentDoctors, recentPatients] = await Promise.all([
        Doctor.find({ isActive: true })
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .limit(limit),
        Patient.find({ isActive: true })
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .limit(limit)
      ]);
    } else if (userRole === 'patient') {
      // Patient can see recent doctors and their own profile
      [recentDoctors, recentPatients] = await Promise.all([
        Doctor.find({ isActive: true })
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .limit(limit),
        Patient.find({ user: req.user._id, isActive: true })
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .limit(limit)
      ]);
    }

    res.status(200).json({
      success: true,
      message: 'Recent data retrieved successfully',
      data: {
        recentDoctors,
        recentPatients
      }
    });

  } catch (error) {
    console.error('Get recent data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving recent data',
      error: 'GET_RECENT_DATA_ERROR'
    });
  }
});

module.exports = router;

