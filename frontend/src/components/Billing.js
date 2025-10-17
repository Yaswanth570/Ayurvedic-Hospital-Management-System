import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const currency = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n || 0));

const Billing = () => {
  const { hasRole } = useAuth();
  const isAdminOrDoctor = hasRole(['admin', 'doctor']);
  const [items, setItems] = useState([{ description: '', qty: 1, price: 0 }]);
  const [patientName, setPatientName] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [savedBills, setSavedBills] = useState([]);

  const totals = useMemo(() => {
    const sub = items.reduce((acc, it) => acc + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);
    const tax = Math.round(sub * 0.12);
    const grand = sub + tax;
    return { sub, tax, grand };
  }, [items]);

  const updateItem = (idx, patch) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const addItem = () => setItems((prev) => [...prev, { description: '', qty: 1, price: 0 }]);
  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!isAdminOrDoctor) {
      setError('Only admin or doctor can create bills.');
      return;
    }
    if (!patientName.trim()) {
      setError('Patient name is required.');
      return;
    }
    if (items.some((it) => !it.description.trim())) {
      setError('Each line must have a description.');
      return;
    }
    setSaving(true);
    try {
      // If you later add a backend, post to /api/billing
      // await axios.post('/api/billing', { patientName, items, notes, totals });
      const bill = {
        id: Date.now().toString(),
        patientName,
        notes,
        items,
        totals
      };
      setSavedBills((prev) => [bill, ...prev]);
      setPatientName('');
      setNotes('');
      setItems([{ description: '', qty: 1, price: 0 }]);
      setSuccess('Bill drafted locally (no backend endpoint yet).');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save bill');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBill = (id) => {
    if (!window.confirm('Delete this bill?')) return;
    setSavedBills((prev) => prev.filter((b) => b.id !== id));
  };

  const gridStyle = { display: 'grid', gridTemplateColumns: '6fr 2fr 2fr 2fr auto', columnGap: '12px', alignItems: 'center' };

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">Billing</h1>
        <p className="page-subtitle">Create consultation and treatment invoices</p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>
      )}
      {success && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{success}</div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '1rem' }}>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Patient Name *</label>
            <input className="form-control" value={patientName} onChange={(e) => setPatientName(e.target.value)} disabled={saving} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Notes</label>
            <input className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} disabled={saving} />
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
          <div style={{ ...gridStyle, fontWeight: 600, marginBottom: '8px' }}>
            <div>Description</div>
            <div>Qty</div>
            <div>Price</div>
            <div style={{ textAlign: 'right' }}>Line Total</div>
            <div></div>
          </div>

          {items.map((it, idx) => (
            <div key={idx} style={{ ...gridStyle, marginBottom: '8px' }}>
              <div>
                <input
                  className="form-control"
                  placeholder="e.g., Consultation, Therapy"
                  value={it.description}
                  onChange={(e) => updateItem(idx, { description: e.target.value })}
                  disabled={saving}
                />
              </div>
              <div>
                <input
                  type="number"
                  className="form-control"
                  value={it.qty}
                  min={1}
                  onChange={(e) => updateItem(idx, { qty: Number(e.target.value) })}
                  disabled={saving}
                />
              </div>
              <div>
                <input
                  type="number"
                  className="form-control"
                  value={it.price}
                  min={0}
                  onChange={(e) => updateItem(idx, { price: Number(e.target.value) })}
                  disabled={saving}
                />
              </div>
              <div style={{ textAlign: 'right' }}>
                {currency((Number(it.qty) || 0) * (Number(it.price) || 0))}
              </div>
              <div>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => removeItem(idx)} disabled={saving || items.length === 1}>Remove</button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={addItem} disabled={saving}>Add Line</button>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', marginTop: '1rem', maxWidth: 420, marginLeft: 'auto' }}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>Subtotal</div>
            <div className="form-group" style={{ textAlign: 'right' }}>{currency(totals.sub)}</div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>Tax (12%)</div>
            <div className="form-group" style={{ textAlign: 'right' }}>{currency(totals.tax)}</div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1, fontWeight: 700 }}>Grand Total</div>
            <div className="form-group" style={{ textAlign: 'right', fontWeight: 700 }}>{currency(totals.grand)}</div>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving || !isAdminOrDoctor}>
            {saving ? 'Saving…' : 'Save Bill'}
          </button>
        </div>
      </form>

      {savedBills.length > 0 && (
        <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
          <h3>Saved Bills (local)</h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Lines</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedBills.map((b) => (
                  <tr key={b.id}>
                    <td>{b.patientName}</td>
                    <td>{b.items.length}</td>
                    <td style={{ textAlign: 'right' }}>{currency(b.totals.grand)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteBill(b.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;


