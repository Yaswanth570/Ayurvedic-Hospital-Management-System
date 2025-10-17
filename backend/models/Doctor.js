const mongoose = require('mongoose');

// Address sub-schema
const addressSchema = new mongoose.Schema({
  street: { type: String, required: [true, 'Street is required'] },
  city: { type: String, required: [true, 'City is required'] },
  state: { type: String, required: [true, 'State is required'] },
  pincode: { type: String, required: [true, 'Pincode is required'] }
}, { _id: false });

// Doctor schema
const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Associated user is required'],
    unique: true
  },
  firstName: { type: String, required: [true, 'First name is required'], trim: true },
  lastName: { type: String, required: [true, 'Last name is required'], trim: true },
  specialization: { type: String, required: [true, 'Specialization is required'], trim: true },
  qualification: { type: String, required: [true, 'Qualification is required'], trim: true },
  experience: { type: Number, required: [true, 'Experience is required'], min: [0, 'Experience cannot be negative'] },
  licenseNumber: { type: String, required: [true, 'License number is required'], unique: true, trim: true },
  phone: { type: String, required: [true, 'Phone number is required'], trim: true },
  consultationFee: { type: Number, required: [true, 'Consultation fee is required'], min: [0, 'Consultation fee cannot be negative'] },
  address: { type: addressSchema, required: [true, 'Address is required'] },
  rating: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Instance method to update rating (simple running average for demo)
doctorSchema.methods.updateRating = async function(newRating) {
  if (typeof newRating !== 'number' || newRating < 1 || newRating > 5) return this.rating;
  this.rating = Math.round(((this.rating || 0) + newRating) / 2 * 10) / 10;
  await this.save();
  return this.rating;
};

// Static to find by specialization (case-insensitive)
doctorSchema.statics.findBySpecialization = function(specialization) {
  return this.find({ specialization: new RegExp(`^${specialization}$`, 'i') }).populate('user', 'name email');
};

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;