# Ayurvedic Hospital Management System - Setup Instructions

Complete setup guide for the Ayurvedic Hospital Management System with React frontend, Node.js backend, MongoDB database, and JWT authentication.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

## 🚀 Complete Setup Process

### Step 1: Clone or Download the Project

If you have the project files, extract them to a folder. If using Git:

```bash
git clone <repository-url>
cd ayurvedic-hospital-management
```

### Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Open `config.env` file
   - Update the following values:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ayurvedic_hospital
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   ```

4. **Start MongoDB**
   
   **Option A: Local MongoDB**
   ```bash
   # On Windows
   mongod
   
   # On macOS/Linux
   sudo systemctl start mongod
   # or
   mongod --dbpath /path/to/your/db
   ```
   
   **Option B: MongoDB Atlas (Cloud)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get connection string and update `MONGO_URI` in config.env

5. **Start the backend server**
   ```bash
   npm start
   ```
   
   You should see:
   ```
   ╔══════════════════════════════════════════════════════════════╗
   ║                                                              ║
   ║    🏥 Ayurvedic Hospital Management System - Backend        ║
   ║                                                              ║
   ║    Server running on: http://localhost:5000                    ║
   ║    Environment: development                    ║
   ║    Database: Connected                                       ║
   ║                                                              ║
   ╚══════════════════════════════════════════════════════════════╝
   ```

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm start
   ```
   
   The application will automatically open in your browser at `http://localhost:3000`

### Step 4: Verify Installation

1. **Check Backend Health**
   - Open browser and go to `http://localhost:5000/health`
   - You should see a JSON response with success message

2. **Check Frontend**
   - The React app should open automatically
   - You should see the login page
   - If not, manually navigate to `http://localhost:3000`

## 🧪 Testing the System

### 1. Create Test Users

**Option A: Use Demo Credentials**
The system comes with demo credentials:
- **Admin**: admin@hospital.com / admin123
- **Doctor**: doctor@hospital.com / doctor123
- **Patient**: patient@hospital.com / patient123

**Option B: Create New Users**
1. Go to the signup page
2. Create accounts with different roles
3. Test the authentication flow

### 2. Test Core Functionality

**Authentication Flow**
1. Try logging in with demo credentials
2. Verify you're redirected to dashboard
3. Check that your name and role appear in navbar
4. Test logout functionality

**Dashboard**
1. Verify statistics cards show data
2. Check recent doctors and patients lists
3. Test quick action buttons

**Doctor Management**
1. Navigate to Doctors page
2. Add a new doctor with all required fields
3. Edit an existing doctor
4. Test search and filter functionality

**Patient Management**
1. Navigate to Patients page
2. Add a new patient with complete information
3. Edit patient details
4. Test medical history features

**Health Awareness**
1. Navigate to Awareness page
2. Verify all sections load properly
3. Check responsive design on different screen sizes

### 3. Test API with Postman

**Setup Postman Collection**
1. Import the following endpoints:

**Authentication**
```
POST http://localhost:5000/api/auth/signup
POST http://localhost:5000/api/auth/login
GET http://localhost:5000/api/auth/profile
```

**Doctors**
```
GET http://localhost:5000/api/doctors
POST http://localhost:5000/api/doctors
PUT http://localhost:5000/api/doctors/:id
DELETE http://localhost:5000/api/doctors/:id
```

**Patients**
```
GET http://localhost:5000/api/patients
POST http://localhost:5000/api/patients
PUT http://localhost:5000/api/patients/:id
DELETE http://localhost:5000/api/patients/:id
```

**Test Authentication Flow**
1. Create a user via signup endpoint
2. Login and copy the JWT token
3. Use the token in Authorization header for protected routes
4. Test CRUD operations

## 🔧 Configuration Options

### Backend Configuration

**Environment Variables (config.env)**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/ayurvedic_hospital

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# CORS Configuration (optional)
FRONTEND_URL=http://localhost:3000
```

**Database Options**
- **Local MongoDB**: Use `mongodb://localhost:27017/ayurvedic_hospital`
- **MongoDB Atlas**: Use your Atlas connection string
- **Docker MongoDB**: Use `mongodb://mongo:27017/ayurvedic_hospital`

### Frontend Configuration

**Package.json Proxy**
```json
{
  "proxy": "http://localhost:5000"
}
```

**API Base URL** (if needed)
```javascript
// In src/contexts/AuthContext.js
const API_BASE_URL = process.env.REACT_APP_API_URL || '';
```

## 🐛 Troubleshooting

### Common Issues and Solutions

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running
- Check connection string in config.env
- Verify MongoDB service is started

**2. Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
- Change PORT in config.env to another port (e.g., 5001)
- Kill process using the port: `lsof -ti:5000 | xargs kill`
- Restart the backend server

**3. Frontend Not Loading**
```
This site can't be reached
```
**Solution:**
- Ensure backend is running on port 5000
- Check proxy configuration in package.json
- Verify no firewall blocking the ports

**4. JWT Token Errors**
```
jwt malformed
```
**Solution:**
- Check JWT_SECRET in config.env
- Clear localStorage in browser
- Login again to get new token

**5. CORS Errors**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Check CORS configuration in backend/server.js
- Verify frontend URL in CORS settings
- Ensure proxy is configured correctly

**6. Build Errors**
```
Module not found: Can't resolve
```
**Solution:**
- Delete node_modules and package-lock.json
- Run `npm install` again
- Check for typos in import statements

### Debug Mode

**Backend Debug**
```bash
# Enable debug logging
DEBUG=* npm start

# Or set environment variable
NODE_ENV=development npm start
```

**Frontend Debug**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls
- Use React Developer Tools extension

## 📊 System Requirements

### Minimum Requirements
- **RAM**: 4GB
- **Storage**: 2GB free space
- **CPU**: Dual-core processor
- **Node.js**: v14.0.0 or higher
- **MongoDB**: v4.4.0 or higher

### Recommended Requirements
- **RAM**: 8GB or higher
- **Storage**: 5GB free space
- **CPU**: Quad-core processor
- **Node.js**: v16.0.0 or higher
- **MongoDB**: v5.0.0 or higher

## 🚀 Production Deployment

### Backend Deployment

**Environment Variables for Production**
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ayurvedic_hospital
JWT_SECRET=your_very_secure_jwt_secret_key_here
```

**Deployment Options**
- **Heroku**: Use Heroku CLI and Procfile
- **AWS EC2**: Use PM2 process manager
- **DigitalOcean**: Use Docker containers
- **Vercel**: For serverless deployment

### Frontend Deployment

**Build for Production**
```bash
cd frontend
npm run build
```

**Deploy Options**
- **Netlify**: Drag and drop build folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload build folder
- **GitHub Pages**: Use gh-pages package

## 📞 Support and Help

### Getting Help
1. Check the troubleshooting section above
2. Review the README files in backend/ and frontend/ directories
3. Check browser console for error messages
4. Verify all prerequisites are installed correctly

### Common Commands Reference

**Backend Commands**
```bash
npm install          # Install dependencies
npm start           # Start production server
npm run dev         # Start development server with auto-restart
npm test            # Run tests (if available)
```

**Frontend Commands**
```bash
npm install          # Install dependencies
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests
npm run eject       # Eject from Create React App (not recommended)
```

**MongoDB Commands**
```bash
mongod              # Start MongoDB server
mongo               # Connect to MongoDB shell
mongoimport         # Import data
mongoexport         # Export data
```

## ✅ Verification Checklist

After setup, verify the following:

- [ ] Backend server starts without errors
- [ ] MongoDB connection is successful
- [ ] Frontend loads in browser
- [ ] Login page appears
- [ ] Can create new user accounts
- [ ] Can login with demo credentials
- [ ] Dashboard loads with user information
- [ ] Can navigate between pages
- [ ] Doctor management works (add/edit/delete)
- [ ] Patient management works (add/edit/delete)
- [ ] Health awareness page loads
- [ ] Responsive design works on mobile
- [ ] API endpoints respond correctly in Postman
- [ ] Error handling works properly
- [ ] Logout functionality works

## 🎉 Success!

If all items in the checklist are working, congratulations! You have successfully set up the Ayurvedic Hospital Management System. The system is now ready for development, testing, or production use.

For any issues not covered in this guide, please refer to the individual README files in the backend and frontend directories, or check the troubleshooting section above.
