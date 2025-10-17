import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Doctors.css';

/**
 * Doctors component for managing doctor profiles
 * Displays list of doctors with CRUD operations
 */
const Doctors = () => {
  const { user, hasRole } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    qualification: '',
    experience: '',
    licenseNumber: '',
    phone: '',
    consultationFee: '',
    bio: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const canManageDoctors = hasRole(['doctor', 'admin']);

  /**
   * Fetch doctors from API
   */
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/doctors');
      
      if (response.data.success) {
        setDoctors(response.data.data.doctors);
      } else {
        setError('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError(error.response?.data?.message || 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
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
    if (!formData.specialization) errors.specialization = 'Specialization is required';
    if (!formData.qualification.trim()) errors.qualification = 'Qualification is required';
    if (!formData.experience) errors.experience = 'Experience is required';
    if (!formData.licenseNumber.trim()) errors.licenseNumber = 'License number is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.consultationFee) errors.consultationFee = 'Consultation fee is required';
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
      if (editingDoctor) {
        // Update existing doctor
        const response = await axios.put(`/api/doctors/${editingDoctor._id}`, formData);
        if (response.data.success) {
          setDoctors(prev => prev.map(doctor => 
            doctor._id === editingDoctor._id ? response.data.data.doctor : doctor
          ));
          setEditingDoctor(null);
          setShowAddForm(false);
          resetForm();
        }
      } else {
        // Create new doctor
        const response = await axios.post('/api/doctors', formData);
        if (response.data.success) {
          setDoctors(prev => [response.data.data.doctor, ...prev]);
          setShowAddForm(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving doctor:', error);
      const server = error.response?.data;
      const details = Array.isArray(server?.errors) ? `: ${server.errors.join('; ')}` : '';
      setError((server?.message || 'Failed to save doctor') + details);
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
      specialization: '',
      qualification: '',
      experience: '',
      licenseNumber: '',
      phone: '',
      consultationFee: '',
      bio: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      }
    });
    setFormErrors({});
  };

  /**
   * Handle edit doctor
   * @param {Object} doctor - Doctor to edit
   */
  const handleEdit = (doctor) => {
    setFormData({
      firstName: doctor.firstName || '',
      lastName: doctor.lastName || '',
      specialization: doctor.specialization || '',
      qualification: doctor.qualification || '',
      experience: doctor.experience || '',
      licenseNumber: doctor.licenseNumber || '',
      phone: doctor.phone || '',
      consultationFee: doctor.consultationFee || '',
      bio: doctor.bio || '',
      address: {
        street: doctor.address?.street || '',
        city: doctor.address?.city || '',
        state: doctor.address?.state || '',
        pincode: doctor.address?.pincode || '',
        country: doctor.address?.country || 'India'
      }
    });
    setEditingDoctor(doctor);
    setShowAddForm(true);
  };

  /**
   * Handle delete doctor
   * @param {string} doctorId - ID of doctor to delete
   */
  const handleDelete = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    
    try {
      const response = await axios.delete(`/api/doctors/${doctorId}`);
      if (response.data.success) {
        setDoctors(prev => prev.filter(doctor => doctor._id !== doctorId));
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setError(error.response?.data?.message || 'Failed to delete doctor');
    }
  };

  /**
   * Cancel form editing
   */
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingDoctor(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="doctors-container">
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doctors-container">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Doctors Management</h1>
          <p className="page-subtitle">Manage doctor profiles and information</p>
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
                <h3>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
              <div className="card-body">
                {!canManageDoctors && (
                  <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                    You must be an Admin or Doctor to create or edit doctor profiles.
                  </div>
                )}
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
                      <label className="form-label">Specialization *</label>
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className={`form-control ${formErrors.specialization ? 'is-invalid' : ''}`}
                        disabled={submitting}
                      >
                        <option value="">Select specialization</option>
                        <option value="General Ayurveda">General Ayurveda</option>
                        <option value="Panchakarma Therapy">Panchakarma Therapy</option>
                        <option value="Kaya Chikitsa (Internal Medicine)">Kaya Chikitsa (Internal Medicine)</option>
                        <option value="Shalya Tantra (Surgery)">Shalya Tantra (Surgery)</option>
                        <option value="Shalakya Tantra (ENT & Ophthalmology)">Shalakya Tantra (ENT & Ophthalmology)</option>
                        <option value="Prasuti Tantra (Obstetrics & Gynecology)">Prasuti Tantra (Obstetrics & Gynecology)</option>
                        <option value="Kaumara Bhritya (Pediatrics)">Kaumara Bhritya (Pediatrics)</option>
                        <option value="Agada Tantra (Toxicology)">Agada Tantra (Toxicology)</option>
                        <option value="Rasayana (Rejuvenation Therapy)">Rasayana (Rejuvenation Therapy)</option>
                        <option value="Vajikarana (Aphrodisiac Therapy)">Vajikarana (Aphrodisiac Therapy)</option>
                      </select>
                      {formErrors.specialization && (
                        <div className="invalid-feedback">{formErrors.specialization}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Qualification *</label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        className={`form-control ${formErrors.qualification ? 'is-invalid' : ''}`}
                        disabled={submitting}
                      />
                      {formErrors.qualification && (
                        <div className="invalid-feedback">{formErrors.qualification}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Experience (Years) *</label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className={`form-control ${formErrors.experience ? 'is-invalid' : ''}`}
                        min="0"
                        max="50"
                        disabled={submitting}
                      />
                      {formErrors.experience && (
                        <div className="invalid-feedback">{formErrors.experience}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">License Number *</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className={`form-control ${formErrors.licenseNumber ? 'is-invalid' : ''}`}
                        disabled={submitting}
                      />
                      {formErrors.licenseNumber && (
                        <div className="invalid-feedback">{formErrors.licenseNumber}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
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
                    <div className="form-group">
                      <label className="form-label">Consultation Fee (₹) *</label>
                      <input
                        type="number"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={handleChange}
                        className={`form-control ${formErrors.consultationFee ? 'is-invalid' : ''}`}
                        min="0"
                        disabled={submitting}
                      />
                      {formErrors.consultationFee && (
                        <div className="invalid-feedback">{formErrors.consultationFee}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="form-control"
                      rows="3"
                      disabled={submitting}
                    />
                  </div>

                  <div className="address-section">
                    <h4>Address Information</h4>
                    <div className="form-row">
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
                    </div>
                    <div className="form-row">
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
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting || !canManageDoctors}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-small"></span>
                          {editingDoctor ? 'Updating...' : 'Adding...'}
                        </>
                      ) : (
                        editingDoctor ? 'Update Doctor' : 'Add Doctor'
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

        {/* Doctors List */}
        <div className="doctors-section">
          <div className="section-header">
            <h2>Doctors List ({doctors.length})</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              Add New Doctor
            </button>
          </div>

          {doctors.length > 0 ? (
            <div className="doctors-grid">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="doctor-card">
                  <div className="doctor-header">
                    <div className="doctor-avatar">
                      {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                    </div>
                    <div className="doctor-info">
                      <h3 className="doctor-name">
                        {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="doctor-specialization">{doctor.specialization}</p>
                    </div>
                    <div className="doctor-status">
                      <span className={`status-badge ${doctor.isActive ? 'active' : 'inactive'}`}>
                        {doctor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="doctor-details">
                    <div className="detail-item">
                      <span className="detail-label">Qualification:</span>
                      <span className="detail-value">{doctor.qualification}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">{doctor.experience} years</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">License:</span>
                      <span className="detail-value">{doctor.licenseNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{doctor.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Consultation Fee:</span>
                      <span className="detail-value">₹{doctor.consultationFee}</span>
                    </div>
                    {doctor.bio && (
                      <div className="detail-item">
                        <span className="detail-label">Bio:</span>
                        <span className="detail-value">{doctor.bio}</span>
                      </div>
                    )}
                  </div>

                  {hasRole(['doctor', 'admin']) && (
                    <div className="doctor-actions">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(doctor)}
                      >
                        Edit
                      </button>
                      {hasRole('admin') && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(doctor._id)}
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
              <p>No doctors found. Add your first doctor to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
