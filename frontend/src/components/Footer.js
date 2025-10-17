import React from 'react';
import './Footer.css';

/**
 * Footer component for the Ayurvedic Hospital Management System
 * Displays copyright information and contact details
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="footer-icon">🏥</span>
              Ayurvedic Hospital
            </h3>
            <p className="footer-description">
              Providing comprehensive healthcare services with traditional Ayurvedic wisdom 
              and modern medical practices for holistic healing and wellness.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/doctors">Doctors</a></li>
              <li><a href="/patients">Patients</a></li>
              <li><a href="/awareness">Health Awareness</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li>General Ayurveda</li>
              <li>Panchakarma Therapy</li>
              <li>Internal Medicine</li>
              <li>Rejuvenation Therapy</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact Info</h4>
            <div className="contact-info">
              <p>
                <span className="contact-icon">📍</span>
                123 Wellness Street, Health City, HC 12345
              </p>
              <p>
                <span className="contact-icon">📞</span>
                +1 (555) 123-4567
              </p>
              <p>
                <span className="contact-icon">✉️</span>
                info@ayurvedichospital.com
              </p>
              <p>
                <span className="contact-icon">🕒</span>
                Mon - Sat: 8:00 AM - 8:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Ayurvedic Hospital Management System. All rights reserved.
            </p>
            <div className="footer-social">
              <span className="social-text">Follow us:</span>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  📘
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  🐦
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  📷
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  💼
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
