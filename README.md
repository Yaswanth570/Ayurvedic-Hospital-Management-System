
# Ayurvedic Hospital Management System

A comprehensive healthcare management system built with React frontend, Node.js/Express backend, MongoDB database, and JWT authentication. This system is designed specifically for Ayurvedic hospitals and healthcare facilities.

## 🏥 Features

### Backend Features
- **User Authentication**: JWT-based authentication with role-based access control
- **User Management**: Support for Admin, Doctor, and Patient roles
- **Doctor Management**: Complete CRUD operations for doctor profiles
- **Patient Management**: Comprehensive patient records with medical history
- **API Security**: Protected routes with JWT middleware
- **Data Validation**: Comprehensive input validation and error handling

### Frontend Features
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Authentication**: Secure login/signup with JWT token management
- **Protected Routes**: Role-based access to different sections
- **Dashboard**: Overview of system statistics and recent activities
- **Doctor Management**: Add, edit, delete, and view doctor profiles
- **Patient Management**: Complete patient record management
- **Health Awareness**: Educational content about Ayurvedic practices
- **Real-time Updates**: Dynamic data fetching and updates

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy `config.env` and update the values:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ayurvedic_hospital
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Use your connection string

5. **Start the backend server**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## 🧪 Testing Instructions

### Backend API Testing with Postman

#### 1. Authentication Endpoints

**Sign Up (Create Account)**
```
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
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Profile (Protected)**
```
GET http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 2. Doctor Management Endpoints

**Get All Doctors**
```
GET http://localhost:5000/api/doctors
```

**Create Doctor (Protected - Doctor/Admin)**
```
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

**Update Doctor (Protected)**
```
PUT http://localhost:5000/api/doctors/DOCTOR_ID
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "consultationFee": 600
}
```

**Delete Doctor (Protected - Admin only)**
```
DELETE http://localhost:5000/api/doctors/DOCTOR_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 3. Patient Management Endpoints

**Get All Patients (Protected - Doctor/Admin)**
```
GET http://localhost:5000/api/patients
Authorization: Bearer YOUR_JWT_TOKEN
```

**Create Patient (Protected - Patient/Admin)**
```
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

### Frontend Testing

#### 1. Authentication Flow
1. Open `http://localhost:3000`
2. You should be redirected to the login page
3. Use the demo credentials or create a new account:
   - **Admin**: admin@hospital.com / admin123
   - **Doctor**: doctor@hospital.com / doctor123
   - **Patient**: patient@hospital.com / patient123

#### 2. Dashboard Testing
1. After login, you should see the dashboard with:
   - Welcome message with your name and role
   - Statistics cards showing system data
   - Recent doctors and patients lists
   - Quick action buttons

#### 3. Doctor Management Testing
1. Navigate to "Doctors" from the navbar
2. Test adding a new doctor:
   - Click "Add New Doctor" button
   - Fill in the required fields
   - Submit the form
3. Test editing a doctor:
   - Click "Edit" on any doctor card
   - Modify the information
   - Save changes
4. Test deleting a doctor (Admin only):
   - Click "Delete" on any doctor card
   - Confirm the deletion

#### 4. Patient Management Testing
1. Navigate to "Patients" from the navbar
2. Test adding a new patient:
   - Click "Add New Patient" button
   - Fill in the required fields including emergency contact
   - Submit the form
3. Test editing a patient:
   - Click "Edit" on any patient card
   - Modify the information
   - Save changes
4. Test deleting a patient (Admin only):
   - Click "Delete" on any patient card
   - Confirm the deletion

#### 5. Health Awareness Testing
1. Navigate to "Awareness" from the navbar
2. Verify that all sections are displayed:
   - Fundamental Principles of Ayurveda
   - Daily Routine (Dinacharya)
   - Seasonal Guidelines (Ritucharya)
   - Dietary Guidelines
   - Common Ailments & Ayurvedic Approaches
   - Preventive Care & Wellness

#### 6. Responsive Design Testing
1. Test on different screen sizes:
   - Desktop (1200px+)
   - Tablet (768px - 1199px)
   - Mobile (320px - 767px)
2. Verify that:
   - Navigation menu collapses on mobile
   - Forms stack properly on smaller screens
   - Cards and grids adapt to screen size
   - Text remains readable at all sizes

#### 7. Error Handling Testing
1. Test invalid login credentials
2. Test form validation errors
3. Test network errors by disconnecting internet
4. Test unauthorized access to protected routes

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ayurvedic_hospital
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
NODE_ENV=development
```

**Frontend (package.json proxy)**
```json
{
  "proxy": "http://localhost:5000"
}
```

### Database Schema

The system uses three main collections:

1. **Users**: Authentication and basic user information
2. **Doctors**: Detailed doctor profiles and professional information
3. **Patients**: Comprehensive patient records and medical history

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Input validation and sanitization
- CORS protection
- Protected API routes

## 📱 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in config.env
   - Verify network connectivity

2. **JWT Token Errors**
   - Check JWT_SECRET in environment variables
   - Ensure token is included in Authorization header
   - Verify token hasn't expired

3. **CORS Issues**
   - Check CORS configuration in server.js
   - Verify frontend URL in CORS settings

4. **Port Conflicts**
   - Change PORT in config.env if 5000 is occupied
   - Update frontend proxy if backend port changes

### Logs and Debugging

- Backend logs are displayed in the console
- Frontend errors are shown in browser console
- Network requests can be monitored in browser DevTools

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify-token` - Verify JWT token

### Doctor Endpoints
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create doctor (Protected)
- `PUT /api/doctors/:id` - Update doctor (Protected)
- `DELETE /api/doctors/:id` - Delete doctor (Admin only)
- `GET /api/doctors/specializations/list` - Get specializations
- `GET /api/doctors/specialization/:specialization` - Get doctors by specialization
- `POST /api/doctors/:id/rating` - Add rating to doctor

### Patient Endpoints
- `GET /api/patients` - Get all patients (Protected)
- `GET /api/patients/:id` - Get patient by ID (Protected)
- `POST /api/patients` - Create patient (Protected)
- `PUT /api/patients/:id` - Update patient (Protected)
- `DELETE /api/patients/:id` - Delete patient (Admin only)
- `POST /api/patients/:id/medical-history` - Add medical history
- `POST /api/patients/:id/allergies` - Add allergy
- `POST /api/patients/:id/medications` - Add medication
- `GET /api/patients/age-range/:minAge/:maxAge` - Get patients by age range
- `GET /api/patients/blood-group/:bloodGroup` - Get patients by blood group

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: info@ayurvedichospital.com
- Phone: +1 (555) 123-4567

---

**Note**: This is a demo application. For production use, ensure proper security measures, database backups, and regular updates.
