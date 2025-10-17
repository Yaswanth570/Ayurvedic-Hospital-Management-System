const express = require('express');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { authenticateToken, authorizeRoles, requireOwnershipOrAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Doctor Routes for Ayurvedic Hospital Management System
 * Handles CRUD operations for doctor profiles
 */

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors with optional filtering
 * @access  Public (can be made private if needed)
 * @query   { specialization, isActive, page, limit }
 */
router.get('/', async (req, res) => {
  try {
    const { 
      specialization, 
      isActive = 'true', 
      page = 1, 
      limit = 10,
      search 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (specialization) {
      filter.specialization = specialization;
    }
    
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    // Add search functionality
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const doctors = await Doctor.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Doctor.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: {
        doctors,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalDoctors: total,
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving doctors',
      error: 'GET_DOCTORS_ERROR'
    });
  }
});

/**
 * @route   GET /api/doctors/:id
 * @desc    Get doctor by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID format',
        error: 'INVALID_ID'
      });
    }

    const doctor = await Doctor.findById(id).populate('user', 'name email');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor retrieved successfully',
      data: {
        doctor
      }
    });

  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving doctor',
      error: 'GET_DOCTOR_ERROR'
    });
  }
});

/**
 * @route   POST /api/doctors
 * @desc    Create a new doctor profile
 * @access  Private (Doctor or Admin)
 * @body    Doctor profile data
 */
router.post('/', authenticateToken, authorizeRoles('doctor', 'admin'), async (req, res) => {
  try {
    const doctorData = req.body;
    const userId = req.user._id;

    // If user is doctor (not admin), ensure they can only create their own profile
    if (req.user.role === 'doctor') {
      doctorData.user = userId;
    }
    // If admin and no explicit user is provided, default to current user to prevent validation failure
    if (req.user.role === 'admin' && !doctorData.user) {
      doctorData.user = userId;
    }

    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'specialization', 'qualification', 
      'experience', 'licenseNumber', 'phone', 'consultationFee', 'address', 'user'
    ];

    const missingFields = requiredFields.filter(field => !doctorData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        error: 'MISSING_FIELDS'
      });
    }

    // Check if doctor profile already exists for this user
    if (req.user.role === 'doctor') {
      const existingDoctor = await Doctor.findOne({ user: userId });
      if (existingDoctor) {
        return res.status(409).json({
          success: false,
          message: 'Doctor profile already exists for this user',
          error: 'PROFILE_EXISTS'
        });
      }
    }

    // Check if license number is already taken
    const existingLicense = await Doctor.findOne({ licenseNumber: doctorData.licenseNumber });
    if (existingLicense) {
      return res.status(409).json({
        success: false,
        message: 'License number is already registered',
        error: 'LICENSE_EXISTS'
      });
    }

    // Create new doctor
    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();

    // Populate user data
    await newDoctor.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: {
        doctor: newDoctor
      }
    });

  } catch (error) {
    console.error('Create doctor error:', error);
    
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
        message: 'License number is already registered',
        error: 'DUPLICATE_LICENSE'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while creating doctor',
      error: 'CREATE_DOCTOR_ERROR'
    });
  }
});

/**
 * @route   PUT /api/doctors/:id
 * @desc    Update doctor profile
 * @access  Private (Doctor can update own profile, Admin can update any)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user._id;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID format',
        error: 'INVALID_ID'
      });
    }

    // Find doctor
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && doctor.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own profile.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.user;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Update doctor
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: {
        doctor: updatedDoctor
      }
    });

  } catch (error) {
    console.error('Update doctor error:', error);
    
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
        message: 'License number is already registered',
        error: 'DUPLICATE_LICENSE'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while updating doctor',
      error: 'UPDATE_DOCTOR_ERROR'
    });
  }
});

/**
 * @route   DELETE /api/doctors/:id
 * @desc    Delete doctor profile (soft delete by setting isActive to false)
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID format',
        error: 'INVALID_ID'
      });
    }

    // Find doctor
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    // Soft delete by setting isActive to false
    doctor.isActive = false;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Doctor profile deactivated successfully'
    });

  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting doctor',
      error: 'DELETE_DOCTOR_ERROR'
    });
  }
});

/**
 * @route   GET /api/doctors/specializations/list
 * @desc    Get list of all available specializations
 * @access  Public
 */
router.get('/specializations/list', (req, res) => {
  const specializations = [
    'General Ayurveda',
    'Panchakarma Therapy',
    'Kaya Chikitsa (Internal Medicine)',
    'Shalya Tantra (Surgery)',
    'Shalakya Tantra (ENT & Ophthalmology)',
    'Prasuti Tantra (Obstetrics & Gynecology)',
    'Kaumara Bhritya (Pediatrics)',
    'Agada Tantra (Toxicology)',
    'Rasayana (Rejuvenation Therapy)',
    'Vajikarana (Aphrodisiac Therapy)'
  ];

  res.status(200).json({
    success: true,
    message: 'Specializations retrieved successfully',
    data: {
      specializations
    }
  });
});

/**
 * @route   GET /api/doctors/specialization/:specialization
 * @desc    Get doctors by specialization
 * @access  Public
 */
router.get('/specialization/:specialization', async (req, res) => {
  try {
    const { specialization } = req.params;

    const doctors = await Doctor.findBySpecialization(specialization);

    res.status(200).json({
      success: true,
      message: `Doctors with specialization '${specialization}' retrieved successfully`,
      data: {
        doctors,
        count: doctors.length
      }
    });

  } catch (error) {
    console.error('Get doctors by specialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving doctors by specialization',
      error: 'GET_DOCTORS_BY_SPECIALIZATION_ERROR'
    });
  }
});

/**
 * @route   POST /api/doctors/:id/rating
 * @desc    Add rating to doctor
 * @access  Private (Authenticated users)
 */
router.post('/:id/rating', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
        error: 'INVALID_RATING'
      });
    }

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID format',
        error: 'INVALID_ID'
      });
    }

    // Find doctor
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    // Update rating
    await doctor.updateRating(rating);

    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      data: {
        rating: doctor.rating
      }
    });

  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding rating',
      error: 'ADD_RATING_ERROR'
    });
  }
});

module.exports = router;
