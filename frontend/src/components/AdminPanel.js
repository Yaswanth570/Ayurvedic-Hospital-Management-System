import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Placeholder: backend endpoint not implemented; show demo set
        setUsers([
          { id: '1', name: 'Admin User', email: 'admin@hospital.com', role: 'admin' },
          { id: '2', name: 'Dr. Rao', email: 'doctor@hospital.com', role: 'doctor' },
          { id: '3', name: 'Patient A', email: 'patient@hospital.com', role: 'patient' }
        ]);
      } catch (err) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-subtitle">Manage users and roles (demo)</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card" style={{ padding: '1rem' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" disabled>Change Role</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isAdmin() && (
          <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
            You need admin privileges to perform actions here.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;


