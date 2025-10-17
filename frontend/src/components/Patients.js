import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Patients.css';

/**
 * Patients component for managing patient profiles
 * Displays list of patients with CRUD operations
 */
const Patients = () => {
  const { user, hasRole } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    occupation: '',
    maritalStatus: 'Single',
    doshaType: 'Not Assessed'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /**
   * Fetch patients from API
   */
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/patients');
      
      if (response.data.success) {
        setPatients(response.data.data.patients);
      } else {
        setError('Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError(error.response?.data?.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  /**
   * Handle input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear field error
    if (formErrors[name]) {
      setFormErrors(prev => ({
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
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.bloodGroup) errors.bloodGroup = 'Blood group is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.emergencyContact.name.trim()) errors['emergencyContact.name'] = 'Emergency contact name is required';
    if (!formData.emergencyContact.phone.trim()) errors['emergencyContact.phone'] = 'Emergency contact phone is required';
    if (!formData.emergencyContact.relationship) errors['emergencyContact.relationship'] = 'Emergency contact relationship is required';
    if (!formData.address.street.trim()) errors['address.street'] = 'Street address is required';
    if (!formData.address.city.trim()) errors['address.city'] = 'City is required';
    if (!formData.address.state.trim()) errors['address.state'] = 'State is required';
    if (!formData.address.pincode.trim()) errors['address.pincode'] = 'Pincode is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      if (editingPatient) {
        // Update existing patient
        const response = await axios.put(`/api/patients/${editingPatient._id}`, formData);
        if (response.data.success) {
          setPatients(prev => prev.map(patient => 
            patient._id === editingPatient._id ? response.data.data.patient : patient
          ));
          setEditingPatient(null);
          setShowAddForm(false);
          resetForm();
        }
      } else {
        // Create new patient
        const response = await axios.post('/api/patients', formData);
        if (response.data.success) {
          setPatients(prev => [response.data.data.patient, ...prev]);
          setShowAddForm(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      const server = error.response?.data;
      const details = Array.isArray(server?.errors) ? `: ${server.errors.join('; ')}` : '';
      setError((server?.message || 'Failed to save patient') + details);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Reset form data
   */
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      phone: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      },
      occupation: '',
      maritalStatus: 'Single',
      doshaType: 'Not Assessed'
    });
    setFormErrors({});
  };

  /**
   * Handle edit patient
   * @param {Object} patient - Patient to edit
   */
  const handleEdit = (patient) => {
    setFormData({
      firstName: patient.firstName || '',
      lastName: patient.lastName || '',
      dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
      gender: patient.gender || '',
      bloodGroup: patient.bloodGroup || '',
      phone: patient.phone || '',
      emergencyContact: {
        name: patient.emergencyContact?.name || '',
        phone: patient.emergencyContact?.phone || '',
        relationship: patient.emergencyContact?.relationship || ''
      },
      address: {
        street: patient.address?.street || '',
        city: patient.address?.city || '',
        state: patient.address?.state || '',
        pincode: patient.address?.pincode || '',
        country: patient.address?.country || 'India'
      },
      occupation: patient.occupation || '',
      maritalStatus: patient.maritalStatus || 'Single',
      doshaType: patient.doshaType || 'Not Assessed'
    });
    setEditingPatient(patient);
    setShowAddForm(true);
  };

  /**
   * Handle delete patient
   * @param {string} patientId - ID of patient to delete
   */
  const handleDelete = async (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    
    try {
      const response = await axios.delete(`/api/patients/${patientId}`);
      if (response.data.success) {
        setPatients(prev => prev.filter(patient => patient._id !== patientId));
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError(error.response?.data?.message || 'Failed to delete patient');
    }
  };

  /**
   * Cancel form editing
   */
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingPatient(null);
    resetForm();
  };

  /**
   * Calculate age from date of birth
   * @param {string} dateOfBirth - Date of birth string
   * @returns {number} Age in years
   */
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="patients-container">
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patients-container">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Patients Management</h1>
          <p className="page-subtitle">Manage patient profiles and medical information</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
            <button 
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="form-section">
            <div className="card">
              <div className="card-header">
                <h3>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h3>
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                        disabled={submitting}
                      />
                      {formErrors.firstName && (
                        <div className="invalid-feedback">{formErrors.firstName}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                        disabled={submitting}
                      />
                      {formErrors.lastName && (
                        <div className="invalid-feedback">{formErrors.lastName}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date of Birth *</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`form-control ${formErrors.dateOfBirth ? 'is-invalid' : ''}`}
                        disabled={submitting}
                      />
                      {formErrors.dateOfBirth && (
                        <div className="invalid-feedback">{formErrors.dateOfBirth}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={(e) => handleChange({ target: { name: 'gender', value: e.target.value.toLowerCase() } })}
                        className={`form-control ${formErrors.gender ? 'is-invalid' : ''}`}
                        disabled={submitting}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {formErrors.gender && (
                        <div className="invalid-feedback">{formErrors.gender}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Blood Group *</label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className={`form-control ${formErrors.bloodGroup ? 'is-invalid' : ''}`}
                        disabled={submitting}
                      >
                        <option value="">Select blood group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                      {formErrors.bloodGroup && (
                        <div className="invalid-feedback">{formErrors.bloodGroup}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                        disabled={submitting}
                      />
                      {formErrors.phone && (
                        <div className="invalid-feedback">{formErrors.phone}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Occupation</label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="form-control"
                        disabled={submitting}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Marital Status</label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className="form-control"
                        disabled={submitting}
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dosha Type</label>
                    <select
                      name="doshaType"
                      value={formData.doshaType}
                      onChange={handleChange}
                      className="form-control"
                      disabled={submitting}
                    >
                      <option value="Not Assessed">Not Assessed</option>
                      <option value="Vata">Vata</option>
                      <option value="Pitta">Pitta</option>
                      <option value="Kapha">Kapha</option>
                      <option value="Vata-Pitta">Vata-Pitta</option>
                      <option value="Vata-Kapha">Vata-Kapha</option>
                      <option value="Pitta-Kapha">Pitta-Kapha</option>
                      <option value="Tridosha">Tridosha</option>
                    </select>
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="emergency-section">
                    <h4>Emergency Contact Information</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Contact Name *</label>
                        <input
                          type="text"
                          name="emergencyContact.name"
                          value={formData.emergencyContact.name}
                          onChange={handleChange}
                          className={`form-control ${formErrors['emergencyContact.name'] ? 'is-invalid' : ''}`}
                          disabled={submitting}
                        />
                        {formErrors['emergencyContact.name'] && (
                          <div className="invalid-feedback">{formErrors['emergencyContact.name']}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Contact Phone *</label>
                        <input
                          type="tel"
                          name="emergencyContact.phone"
                          value={formData.emergencyContact.phone}
                          onChange={handleChange}
                          className={`form-control ${formErrors['emergencyContact.phone'] ? 'is-invalid' : ''}`}
                          disabled={submitting}
                        />
                        {formErrors['emergencyContact.phone'] && (
                          <div className="invalid-feedback">{formErrors['emergencyContact.phone']}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Relationship *</label>
                      <select
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={handleChange}
                        className={`form-control ${formErrors['emergencyContact.relationship'] ? 'is-invalid' : ''}`}
                        disabled={submitting}
                      >
                        <option value="">Select relationship</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Child">Child</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                      </select>
                      {formErrors['emergencyContact.relationship'] && (
                        <div className="invalid-feedback">{formErrors['emergencyContact.relationship']}</div>
                      )}
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="address-section">
                    <h4>Address Information</h4>
                    <div className="form-group">
                      <label className="form-label">Street Address *</label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className={`form-control ${formErrors['address.street'] ? 'is-invalid' : ''}`}
                        disabled={submitting}
                      />
                      {formErrors['address.street'] && (
                        <div className="invalid-feedback">{formErrors['address.street']}</div>
                      )}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          className={`form-control ${formErrors['address.city'] ? 'is-invalid' : ''}`}
                          disabled={submitting}
                        />
                        {formErrors['address.city'] && (
                          <div className="invalid-feedback">{formErrors['address.city']}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label className="form-label">State *</label>
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          className={`form-control ${formErrors['address.state'] ? 'is-invalid' : ''}`}
                          disabled={submitting}
                        />
                        {formErrors['address.state'] && (
                          <div className="invalid-feedback">{formErrors['address.state']}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Pincode *</label>
                        <input
                          type="text"
                          name="address.pincode"
                          value={formData.address.pincode}
                          onChange={handleChange}
                          className={`form-control ${formErrors['address.pincode'] ? 'is-invalid' : ''}`}
                          disabled={submitting}
                        />
                        {formErrors['address.pincode'] && (
                          <div className="invalid-feedback">{formErrors['address.pincode']}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleChange}
                          className="form-control"
                          disabled={submitting}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-small"></span>
                          {editingPatient ? 'Updating...' : 'Adding...'}
                        </>
                      ) : (
                        editingPatient ? 'Update Patient' : 'Add Patient'
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Patients List */}
        <div className="patients-section">
          <div className="section-header">
            <h2>Patients List ({patients.length})</h2>
            {hasRole(['patient', 'admin']) && (
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                Add New Patient
              </button>
            )}
          </div>

          {patients.length > 0 ? (
            <div className="patients-grid">
              {patients.map((patient) => (
                <div key={patient._id} className="patient-card">
                  <div className="patient-header">
                    <div className="patient-avatar">
                      {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                    </div>
                    <div className="patient-info">
                      <h3 className="patient-name">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="patient-details">
                        {patient.gender} • {calculateAge(patient.dateOfBirth)} years • {patient.bloodGroup}
                      </p>
                    </div>
                    <div className="patient-status">
                      <span className={`status-badge ${patient.isActive ? 'active' : 'inactive'}`}>
                        {patient.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="patient-details-section">
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{patient.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Emergency Contact:</span>
                      <span className="detail-value">
                        {patient.emergencyContact?.name} ({patient.emergencyContact?.relationship})
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">
                        {patient.address?.street}, {patient.address?.city}, {patient.address?.state} - {patient.address?.pincode}
                      </span>
                    </div>
                    {patient.occupation && (
                      <div className="detail-item">
                        <span className="detail-label">Occupation:</span>
                        <span className="detail-value">{patient.occupation}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Marital Status:</span>
                      <span className="detail-value">{patient.maritalStatus}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Dosha Type:</span>
                      <span className="detail-value">{patient.doshaType}</span>
                    </div>
                  </div>

                  {hasRole(['patient', 'admin']) && (
                    <div className="patient-actions">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(patient)}
                      >
                        Edit
                      </button>
                      {hasRole('admin') && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(patient._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No patients found. Add your first patient to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;
