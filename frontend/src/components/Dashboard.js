import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Dashboard.css';

/**
 * Dashboard component for the main application interface
 * Displays user information and system overview
 */
const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    activeDoctors: 0,
    activePatients: 0
  });
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch dashboard statistics and recent data
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard statistics and recent data using the new dashboard endpoints
      const [statsResponse, recentDataResponse] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/dashboard/recent-data?limit=5')
      ]);

      if (statsResponse.data.success && recentDataResponse.data.success) {
        // Set statistics
        setStats(statsResponse.data.data.stats);

        // Set recent data
        setRecentDoctors(recentDataResponse.data.data.recentDoctors);
        setRecentPatients(recentDataResponse.data.data.recentPatients);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  /**
   * Format date for display
   * @param {string} dateString - Date string to format
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Get greeting based on time of day
   * @returns {string} Greeting message
   */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1 className="welcome-title">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="welcome-subtitle">
            Welcome to the Ayurvedic Hospital Management System
          </p>
          <div className="user-info">
            <span className="user-role-badge">{user?.role}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger">
            {error}
            <button 
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={fetchDashboardData}
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalDoctors}</h3>
              <p className="stat-label">Total Doctors</p>
              <span className="stat-subtext">{stats.activeDoctors} active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalPatients}</h3>
              <p className="stat-label">Total Patients</p>
              <span className="stat-subtext">{stats.activePatients} active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏥</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.activeDoctors + stats.activePatients}</h3>
              <p className="stat-label">Active Users</p>
              <span className="stat-subtext">Currently active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3 className="stat-number">100%</h3>
              <p className="stat-label">System Health</p>
              <span className="stat-subtext">All systems operational</span>
            </div>
          </div>
        </div>

        {/* Recent Data Section */}
        <div className="recent-data-section">
          <div className="recent-doctors">
            <div className="card">
              <div className="card-header">
                <h3>Recent Doctors</h3>
                <a href="/doctors" className="btn btn-sm btn-outline-primary">
                  View All
                </a>
              </div>
              <div className="card-body">
                {recentDoctors.length > 0 ? (
                  <div className="recent-list">
                    {recentDoctors.map((doctor) => (
                      <div key={doctor._id} className="recent-item">
                        <div className="item-avatar">
                          {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                        </div>
                        <div className="item-content">
                          <h4 className="item-name">
                            {doctor.firstName} {doctor.lastName}
                          </h4>
                          <p className="item-detail">{doctor.specialization}</p>
                          <span className="item-date">
                            Added {formatDate(doctor.createdAt)}
                          </span>
                        </div>
                        <div className="item-status">
                          <span className={`status-badge ${doctor.isActive ? 'active' : 'inactive'}`}>
                            {doctor.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No doctors found</p>
                )}
              </div>
            </div>
          </div>

          <div className="recent-patients">
            <div className="card">
              <div className="card-header">
                <h3>Recent Patients</h3>
                <a href="/patients" className="btn btn-sm btn-outline-primary">
                  View All
                </a>
              </div>
              <div className="card-body">
                {recentPatients.length > 0 ? (
                  <div className="recent-list">
                    {recentPatients.map((patient) => (
                      <div key={patient._id} className="recent-item">
                        <div className="item-avatar">
                          {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                        </div>
                        <div className="item-content">
                          <h4 className="item-name">
                            {patient.firstName} {patient.lastName}
                          </h4>
                          <p className="item-detail">
                            {patient.gender} • {patient.bloodGroup}
                          </p>
                          <span className="item-date">
                            Added {formatDate(patient.createdAt)}
                          </span>
                        </div>
                        <div className="item-status">
                          <span className={`status-badge ${patient.isActive ? 'active' : 'inactive'}`}>
                            {patient.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No patients found</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="card-body">
              <div className="action-buttons">
                <a href="/doctors" className="action-btn">
                  <span className="action-icon">👨‍⚕️</span>
                  <span className="action-text">Manage Doctors</span>
                </a>
                <a href="/patients" className="action-btn">
                  <span className="action-icon">👥</span>
                  <span className="action-text">Manage Patients</span>
                </a>
                <a href="/awareness" className="action-btn">
                  <span className="action-icon">📚</span>
                  <span className="action-text">Health Awareness</span>
                </a>
                {user?.role === 'admin' && (
                  <a href="/admin" className="action-btn">
                    <span className="action-icon">⚙️</span>
                    <span className="action-text">Admin Panel</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
