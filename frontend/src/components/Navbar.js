import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

/**
 * Navbar component for the Ayurvedic Hospital Management System
 * Displays navigation links and user information
 */
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  /**
   * Handle logout functionality
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Toggle mobile menu
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * Close mobile menu
   */
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Apply theme to document
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/dashboard" className="brand-link" onClick={closeMenu}>
            <span className="brand-icon">🏥</span>
            <span className="brand-text">Ayurvedic Hospital</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={`navbar-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={closeMenu}>
                Dashboard
              </Link>
              <Link to="/doctors" className="nav-link" onClick={closeMenu}>
                Doctors
              </Link>
              <Link to="/patients" className="nav-link" onClick={closeMenu}>
                Patients
              </Link>
              <Link to="/awareness" className="nav-link" onClick={closeMenu}>
                Awareness
              </Link>
              <Link to="/billing" className="nav-link" onClick={closeMenu}>
                Billing
              </Link>
              <Link to="/reports" className="nav-link" onClick={closeMenu}>
                Reports
              </Link>
              <Link to="/appointments" className="nav-link" onClick={closeMenu}>
                Appointments
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="nav-link" onClick={closeMenu}>
                  Admin
                </Link>
              )}
              <button type="button" className="nav-link" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/signup" className="nav-link" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* User Menu */}
        {isAuthenticated && (
          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">Welcome, {user?.name}</span>
              <span className="user-role">({user?.role})</span>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="brand-icon">🏥</span>
              <span className="brand-text">Ayurvedic Hospital</span>
            </div>
            
            {isAuthenticated && (
              <div className="mobile-user-info">
                <p className="user-name">{user?.name}</p>
                <p className="user-role">{user?.role}</p>
              </div>
            )}

            <div className="mobile-nav-links">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="mobile-nav-link" onClick={closeMenu}>
                    Dashboard
                  </Link>
                  <Link to="/doctors" className="mobile-nav-link" onClick={closeMenu}>
                    Doctors
                  </Link>
                  <Link to="/patients" className="mobile-nav-link" onClick={closeMenu}>
                    Patients
                  </Link>
                  <Link to="/awareness" className="mobile-nav-link" onClick={closeMenu}>
                    Awareness
                  </Link>
                  <Link to="/billing" className="mobile-nav-link" onClick={closeMenu}>
                    Billing
                  </Link>
                  <Link to="/reports" className="mobile-nav-link" onClick={closeMenu}>
                    Reports
                  </Link>
                  <Link to="/appointments" className="mobile-nav-link" onClick={closeMenu}>
                    Appointments
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="mobile-nav-link" onClick={closeMenu}>
                      Admin
                    </Link>
                  )}
                  <button className="mobile-nav-link logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                  <button className="mobile-nav-link logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="mobile-nav-link" onClick={closeMenu}>
                    Login
                  </Link>
                  <Link to="/signup" className="mobile-nav-link" onClick={closeMenu}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
