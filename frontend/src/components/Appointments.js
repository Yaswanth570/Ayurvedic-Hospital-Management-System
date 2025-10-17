import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Appointments = () => {
  const { hasRole } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ doctorId: '', date: '', time: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/doctors', { params: { isActive: 'true', page: 1, limit: 100 } });
        setDoctors(res.data?.data?.doctors || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.doctorId || !form.date || !form.time) {
      setError('Please choose doctor, date and time.');
      return;
    }
    setSubmitting(true);
    try {
      // Placeholder: In a real app, POST to /api/appointments
      const doctor = doctors.find((d) => d._id === form.doctorId);
      const created = {
        id: Date.now().toString(),
        doctorId: form.doctorId,
        doctorName: `${doctor?.firstName} ${doctor?.lastName}`,
        date: form.date,
        time: form.time,
        reason: form.reason
      };
      setAppointments((prev) => [created, ...prev]);
      setForm({ doctorId: '', date: '', time: '', reason: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAppointment = (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '1.5rem' }}>
        <div className="loading-overlay"><div className="spinner"></div><p>Loading…</p></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">Appointment Booking</h1>
        <p className="page-subtitle">Schedule consultations with available doctors</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card" style={{ padding: '1rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Doctor *</label>
              <select name="doctorId" className="form-control" value={form.doctorId} onChange={handleChange} disabled={submitting}>
                <option value="">Select doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>{d.firstName} {d.lastName} — {d.specialization}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Date *</label>
              <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} disabled={submitting} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Time *</label>
              <input type="time" name="time" className="form-control" value={form.time} onChange={handleChange} disabled={submitting} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reason (optional)</label>
            <input name="reason" className="form-control" value={form.reason} onChange={handleChange} disabled={submitting} placeholder="e.g., Follow-up, initial consult" />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>Book Appointment</button>
          </div>
        </form>
      </div>

      {appointments.length > 0 && (
        <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
          <h3>Upcoming Appointments (local)</h3>
          <ul>
            {appointments.map((a) => (
              <li key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>
                  {a.date} {a.time} — {a.doctorName}{a.reason ? `, ${a.reason}` : ''}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteAppointment(a.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Appointments;


