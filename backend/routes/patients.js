const express = require('express');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { authenticateToken, authorizeRoles, requireOwnershipOrAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Patient Routes for Ayurvedic Hospital Management System
 * Handles CRUD operations for patient profiles
 */

/**
 * @route   GET /api/patients
 * @desc    Get all patients with optional filtering
 * @access  Private (Admin, Doctor, and Patient - patients can only see their own data)
 * @query   { isActive, page, limit, search, ageMin, ageMax, gender, bloodGroup }
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      isActive = 'true', 
      page = 1, 
      limit = 10,
      search,
      ageMin,
      ageMax,
      gender,
      bloodGroup
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Role-based access control
    if (req.user.role === 'patient') {
      // Patients can only see their own data
      filter.user = req.user._id;
    }
    
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    if (gender) {
      filter.gender = gender;
    }

    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    // Add age range filter
    if (ageMin || ageMax) {
      const today = new Date();
      const maxAge = ageMax ? parseInt(ageMax) : 100;
      const minAge = ageMin ? parseInt(ageMin) : 0;
      
      const maxBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
      const minBirthDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
      
      filter.dateOfBirth = {
        $gte: minBirthDate,
        $lte: maxBirthDate
      };
    }

    // Add search functionality
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const patients = await Patient.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Patient.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Patients retrieved successfully',
      data: {
        patients,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalPatients: total,
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving patients',
      error: 'GET_PATIENTS_ERROR'
    });
  }
});

/**
 * @route   GET /api/patients/:id
 * @desc    Get patient by ID
 * @access  Private (Patient can view own profile, Doctor and Admin can view any)
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format',
        error: 'INVALID_ID'
      });
    }

    const patient = await Patient.findById(id).populate('user', 'name email');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    // Check permissions - patients can only view their own profile
    if (req.user.role === 'patient' && patient.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own profile.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient retrieved successfully',
      data: {
        patient
      }
    });

  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving patient',
      error: 'GET_PATIENT_ERROR'
    });
  }
});

/**
 * @route   POST /api/patients
 * @desc    Create a new patient profile
 * @access  Private (Patient or Admin)
 * @body    Patient profile data
 */
router.post('/', authenticateToken, authorizeRoles('patient', 'admin'), async (req, res) => {
  try {
    const patientData = req.body;
    const userId = req.user._id;

    // If user is patient (not admin), ensure they can only create their own profile
    if (req.user.role === 'patient') {
      patientData.user = userId;
    }

    // If admin and no explicit user is provided, default to current user to prevent validation failure
    if (req.user.role === 'admin' && !patientData.user) {
      patientData.user = userId;
    }

    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'dateOfBirth', 'gender', 'bloodGroup',
      'phone', 'emergencyContact'
    ];

    const missingFields = requiredFields.filter(field => !patientData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        error: 'MISSING_FIELDS'
      });
    }

    // Validate emergency contact fields
    if (patientData.emergencyContact) {
      const emergencyFields = ['name', 'phone', 'relationship'];
      const missingEmergencyFields = emergencyFields.filter(field => !patientData.emergencyContact[field]);
      if (missingEmergencyFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing emergency contact fields: ${missingEmergencyFields.join(', ')}`,
          error: 'MISSING_EMERGENCY_FIELDS'
        });
      }
    }

    // Check if patient profile already exists for this user
    if (req.user.role === 'patient') {
      const existingPatient = await Patient.findOne({ user: userId });
      if (existingPatient) {
        return res.status(409).json({
          success: false,
          message: 'Patient profile already exists for this user',
          error: 'PROFILE_EXISTS'
        });
      }
    }

    // Create new patient
    const newPatient = new Patient(patientData);
    await newPatient.save();

    // Populate user data
    await newPatient.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Patient profile created successfully',
      data: {
        patient: newPatient
      }
    });

  } catch (error) {
    console.error('Create patient error:', error);
    
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

    res.status(500).json({
      success: false,
      message: 'Internal server error while creating patient',
      error: 'CREATE_PATIENT_ERROR'
    });
  }
});

/**
 * @route   PUT /api/patients/:id
 * @desc    Update patient profile
 * @access  Private (Patient can update own profile, Admin can update any)
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
        message: 'Invalid patient ID format',
        error: 'INVALID_ID'
      });
    }

    // Find patient
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && patient.user.toString() !== userId.toString()) {
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

    // Update patient
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Patient profile updated successfully',
      data: {
        patient: updatedPatient
      }
    });

  } catch (error) {
    console.error('Update patient error:', error);
    
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

    res.status(500).json({
      success: false,
      message: 'Internal server error while updating patient',
      error: 'UPDATE_PATIENT_ERROR'
    });
  }
});

/**
 * @route   DELETE /api/patients/:id
 * @desc    Delete patient profile (soft delete by setting isActive to false)
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format',
        error: 'INVALID_ID'
      });
    }

    // Find patient
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    // Soft delete by setting isActive to false
    patient.isActive = false;
    await patient.save();

    res.status(200).json({
      success: true,
      message: 'Patient profile deactivated successfully'
    });

  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting patient',
      error: 'DELETE_PATIENT_ERROR'
    });
  }
});

/**
 * @route   POST /api/patients/:id/medical-history
 * @desc    Add medical history entry to patient
 * @access  Private (Doctor and Admin)
 */
router.post('/:id/medical-history', authenticateToken, authorizeRoles('doctor', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { condition, diagnosedDate, status, notes } = req.body;

    // Validate required fields
    if (!condition || !diagnosedDate) {
      return res.status(400).json({
        success: false,
        message: 'Condition and diagnosed date are required',
        error: 'MISSING_FIELDS'
      });
    }

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format',
        error: 'INVALID_ID'
      });
    }

    // Find patient
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    // Add medical history entry
    const historyEntry = {
      condition,
      diagnosedDate: new Date(diagnosedDate),
      status: status || 'Active',
      notes
    };

    await patient.addMedicalHistory(historyEntry);

    res.status(200).json({
      success: true,
      message: 'Medical history entry added successfully',
      data: {
        patient
      }
    });

  } catch (error) {
    console.error('Add medical history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding medical history',
      error: 'ADD_MEDICAL_HISTORY_ERROR'
    });
  }
});

/**
 * @route   POST /api/patients/:id/allergies
 * @desc    Add allergy to patient
 * @access  Private (Doctor and Admin)
 */
router.post('/:id/allergies', authenticateToken, authorizeRoles('doctor', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { allergen, severity, notes } = req.body;

    // Validate required fields
    if (!allergen || !severity) {
      return res.status(400).json({
        success: false,
        message: 'Allergen and severity are required',
        error: 'MISSING_FIELDS'
      });
    }

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format',
        error: 'INVALID_ID'
      });
    }

    // Find patient
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    // Add allergy
    const allergy = {
      allergen,
      severity,
      notes
    };

    await patient.addAllergy(allergy);

    res.status(200).json({
      success: true,
      message: 'Allergy added successfully',
      data: {
        patient
      }
    });

  } catch (error) {
    console.error('Add allergy error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding allergy',
      error: 'ADD_ALLERGY_ERROR'
    });
  }
});

/**
 * @route   POST /api/patients/:id/medications
 * @desc    Add current medication to patient
 * @access  Private (Doctor and Admin)
 */
router.post('/:id/medications', authenticateToken, authorizeRoles('doctor', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dosage, frequency, startDate, prescribedBy } = req.body;

    // Validate required fields
    if (!name || !dosage || !frequency || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Name, dosage, frequency, and start date are required',
        error: 'MISSING_FIELDS'
      });
    }

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format',
        error: 'INVALID_ID'
      });
    }

    // Find patient
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    // Add medication
    const medication = {
      name,
      dosage,
      frequency,
      startDate: new Date(startDate),
      prescribedBy
    };

    await patient.addMedication(medication);

    res.status(200).json({
      success: true,
      message: 'Medication added successfully',
      data: {
        patient
      }
    });

  } catch (error) {
    console.error('Add medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding medication',
      error: 'ADD_MEDICATION_ERROR'
    });
  }
});

/**
 * @route   GET /api/patients/age-range/:minAge/:maxAge
 * @desc    Get patients by age range
 * @access  Private (Doctor and Admin)
 */
router.get('/age-range/:minAge/:maxAge', authenticateToken, authorizeRoles('doctor', 'admin'), async (req, res) => {
  try {
    const { minAge, maxAge } = req.params;

    const patients = await Patient.findByAgeRange(parseInt(minAge), parseInt(maxAge));

    res.status(200).json({
      success: true,
      message: `Patients aged ${minAge}-${maxAge} retrieved successfully`,
      data: {
        patients,
        count: patients.length
      }
    });

  } catch (error) {
    console.error('Get patients by age range error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving patients by age range',
      error: 'GET_PATIENTS_BY_AGE_ERROR'
    });
  }
});

/**
 * @route   GET /api/patients/blood-group/:bloodGroup
 * @desc    Get patients by blood group
 * @access  Private (Doctor and Admin)
 */
router.get('/blood-group/:bloodGroup', authenticateToken, authorizeRoles('doctor', 'admin'), async (req, res) => {
  try {
    const { bloodGroup } = req.params;

    const patients = await Patient.find({ 
      bloodGroup: bloodGroup.toUpperCase(),
      isActive: true 
    }).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: `Patients with blood group ${bloodGroup} retrieved successfully`,
      data: {
        patients,
        count: patients.length
      }
    });

  } catch (error) {
    console.error('Get patients by blood group error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving patients by blood group',
      error: 'GET_PATIENTS_BY_BLOOD_GROUP_ERROR'
    });
  }
});

module.exports = router;
