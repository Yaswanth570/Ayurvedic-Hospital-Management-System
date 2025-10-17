# Ayurvedic Hospital Management System - Backend

This is the backend API for the Ayurvedic Hospital Management System, built with Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Update `config.env` with your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ayurvedic_hospital
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   ```

3. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Use your connection string

4. **Start the server**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── server.js                 # Main server file
├── config.env               # Environment configuration
├── package.json             # Dependencies and scripts
├── models/                  # Database models
│   ├── User.js             # User model for authentication
│   ├── Doctor.js           # Doctor profile model
│   └── Patient.js          # Patient profile model
├── routes/                  # API routes
│   ├── auth.js             # Authentication routes
│   ├── doctors.js          # Doctor management routes
│   └── patients.js         # Patient management routes
└── middleware/              # Custom middleware
    └── authMiddleware.js   # JWT authentication middleware
```

## 🔧 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/signup` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| POST | `/change-password` | Change password | Private |
| POST | `/logout` | Logout user | Private |
| GET | `/verify-token` | Verify JWT token | Private |

### Doctor Routes (`/api/doctors`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all doctors | Public |
| GET | `/:id` | Get doctor by ID | Public |
| POST | `/` | Create doctor | Doctor/Admin |
| PUT | `/:id` | Update doctor | Doctor/Admin |
| DELETE | `/:id` | Delete doctor | Admin only |
| GET | `/specializations/list` | Get specializations | Public |
| GET | `/specialization/:specialization` | Get doctors by specialization | Public |
| POST | `/:id/rating` | Add rating to doctor | Private |

### Patient Routes (`/api/patients`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all patients | Doctor/Admin |
| GET | `/:id` | Get patient by ID | Private |
| POST | `/` | Create patient | Patient/Admin |
| PUT | `/:id` | Update patient | Patient/Admin |
| DELETE | `/:id` | Delete patient | Admin only |
| POST | `/:id/medical-history` | Add medical history | Doctor/Admin |
| POST | `/:id/allergies` | Add allergy | Doctor/Admin |
| POST | `/:id/medications` | Add medication | Doctor/Admin |
| GET | `/age-range/:minAge/:maxAge` | Get patients by age range | Doctor/Admin |
| GET | `/blood-group/:bloodGroup` | Get patients by blood group | Doctor/Admin |

## 🛡️ Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### User Roles

1. **Admin**: Full access to all endpoints
2. **Doctor**: Can manage doctors and patients, view all data
3. **Patient**: Can manage own profile and view own data

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['patient', 'doctor', 'admin']),
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

### Doctor Model
```javascript
{
  user: ObjectId (ref: User),
  firstName: String,
  lastName: String,
  specialization: String (enum),
  qualification: String,
  experience: Number,
  licenseNumber: String (unique),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  consultationFee: Number,
  availableDays: [String],
  availableTimeSlots: [Object],
  isActive: Boolean,
  rating: {
    average: Number,
    totalReviews: Number
  },
  bio: String,
  languages: [String],
  achievements: [String],
  timestamps: true
}
```

### Patient Model
```javascript
{
  user: ObjectId (ref: User),
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: String (enum: ['Male', 'Female', 'Other']),
  bloodGroup: String (enum),
  phone: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  medicalHistory: [Object],
  allergies: [Object],
  currentMedications: [Object],
  doshaType: String (enum),
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date
  },
  isActive: Boolean,
  occupation: String,
  maritalStatus: String (enum),
  timestamps: true
}
```

## 🧪 Testing with Postman

### 1. Authentication Flow

**Sign Up**
```http
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
```

**Login**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Profile**
```http
GET http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### 2. Doctor Management

**Create Doctor**
```http
POST http://localhost:5000/api/doctors
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "firstName": "Dr. Rajesh",
  "lastName": "Sharma",
  "specialization": "General Ayurveda",
  "qualification": "BAMS",
  "experience": 10,
  "licenseNumber": "AY123456",
  "phone": "9876543210",
  "consultationFee": 500,
  "address": {
    "street": "123 Wellness Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  }
}
```

### 3. Patient Management

**Create Patient**
```http
POST http://localhost:5000/api/patients
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "firstName": "Priya",
  "lastName": "Patel",
  "dateOfBirth": "1990-05-15",
  "gender": "Female",
  "bloodGroup": "B+",
  "phone": "9876543210",
  "emergencyContact": {
    "name": "Raj Patel",
    "phone": "9876543211",
    "relationship": "Spouse"
  },
  "address": {
    "street": "456 Health Lane",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "country": "India"
  }
}
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs (salt rounds: 12)
- Role-based access control
- Input validation and sanitization
- CORS protection
- Protected API routes
- Error handling without sensitive information exposure

## 📝 Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "errors": ["Validation errors array"] // For validation errors
}
```

### Common Error Codes
- `MISSING_TOKEN`: No JWT token provided
- `INVALID_TOKEN`: Invalid or expired JWT token
- `INSUFFICIENT_PERMISSIONS`: User doesn't have required role
- `VALIDATION_ERROR`: Input validation failed
- `DUPLICATE_EMAIL`: Email already exists
- `USER_NOT_FOUND`: User doesn't exist
- `DOCTOR_NOT_FOUND`: Doctor doesn't exist
- `PATIENT_NOT_FOUND`: Patient doesn't exist

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ayurvedic_hospital
JWT_SECRET=your_very_secure_jwt_secret_key_here
```

### Production Considerations
- Use environment variables for sensitive data
- Enable MongoDB authentication
- Use HTTPS in production
- Implement rate limiting
- Set up proper logging
- Use a process manager like PM2
- Set up database backups
- Implement API versioning

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   - Ensure MongoDB is running
   - Check connection string in config.env
   - Verify network connectivity

2. **JWT Token Errors**
   ```
   Error: jwt malformed
   ```
   - Check JWT_SECRET in environment variables
   - Ensure token is included in Authorization header
   - Verify token format: `Bearer TOKEN`

3. **CORS Issues**
   ```
   Access to XMLHttpRequest blocked by CORS policy
   ```
   - Check CORS configuration in server.js
   - Verify frontend URL in CORS settings

4. **Port Conflicts**
   ```
   Error: listen EADDRINUSE :::5000
   ```
   - Change PORT in config.env
   - Kill process using the port: `lsof -ti:5000 | xargs kill`

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=*
```

## 📚 Dependencies

### Production Dependencies
- `express`: Web framework
- `mongoose`: MongoDB object modeling
- `jsonwebtoken`: JWT implementation
- `bcryptjs`: Password hashing
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable loading

### Development Dependencies
- `nodemon`: Development server with auto-restart

## 📄 License

This project is licensed under the MIT License.
