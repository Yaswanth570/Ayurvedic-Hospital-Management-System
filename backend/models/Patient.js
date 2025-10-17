const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: [true, 'Street is required'] },
  city: { type: String, required: [true, 'City is required'] },
  state: { type: String, required: [true, 'State is required'] },
  pincode: { type: String, required: [true, 'Pincode is required'] }
}, { _id: false });

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Emergency contact name is required'] },
  phone: { type: String, required: [true, 'Emergency contact phone is required'] },
  relationship: { type: String, required: [true, 'Relationship is required'] }
}, { _id: false });

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    unique: true,
    sparse: true
  },
  firstName: { type: String, required: [true, 'First name is required'], trim: true },
  lastName: { type: String, required: [true, 'Last name is required'], trim: true },
  dateOfBirth: { type: Date, required: [true, 'Date of birth is required'] },
  gender: { type: String, enum: ['male', 'female', 'other'], lowercase: true, required: [true, 'Gender is required'] },
  bloodGroup: { type: String, trim: true },
  phone: { type: String, required: [true, 'Phone number is required'], trim: true },
  emergencyContact: { type: emergencyContactSchema, required: [true, 'Emergency contact is required'] },
  address: { type: addressSchema, required: [true, 'Address is required'] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;