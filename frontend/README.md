# Ayurvedic Hospital Management System - Frontend

This is the React frontend for the Ayurvedic Hospital Management System, featuring a modern, responsive interface with JWT authentication and role-based access control.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Backend API running on port 5000

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── index.js           # Application entry point
│   ├── index.css          # Global styles
│   ├── App.js             # Main App component
│   ├── App.css            # App-specific styles
│   ├── contexts/          # React contexts
│   │   └── AuthContext.js # Authentication context
│   └── components/        # React components
│       ├── ProtectedRoute.js # Route protection component
│       ├── Navbar.js      # Navigation component
│       ├── Footer.js      # Footer component
│       ├── Login.js       # Login page
│       ├── Signup.js      # Registration page
│       ├── Dashboard.js   # Dashboard page
│       ├── Doctors.js     # Doctor management page
│       ├── Patients.js    # Patient management page
│       └── Awareness.js   # Health awareness page
└── package.json           # Dependencies and scripts
```

## 🎨 Features

### Authentication
- **Login/Signup**: Secure user authentication with JWT tokens
- **Protected Routes**: Role-based access control
- **Token Management**: Automatic token storage and refresh
- **Logout**: Secure session termination

### User Interface
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Ayurvedic Theme**: Custom color scheme and styling
- **Interactive Components**: Dynamic forms and data tables
- **Loading States**: User feedback during API calls
- **Error Handling**: Comprehensive error messages and validation

### Pages

#### 1. Login Page (`/login`)
- Email and password authentication
- Form validation
- Error message display
- Demo credentials for testing

#### 2. Signup Page (`/signup`)
- User registration with role selection
- Form validation
- Password confirmation
- Terms and privacy policy

#### 3. Dashboard (`/dashboard`)
- Welcome message with user information
- System statistics cards
- Recent doctors and patients lists
- Quick action buttons
- Role-based content display

#### 4. Doctors Management (`/doctors`)
- View all doctors in card format
- Add new doctor with comprehensive form
- Edit existing doctor profiles
- Delete doctors (Admin only)
- Search and filter functionality
- Responsive grid layout

#### 5. Patients Management (`/patients`)
- View all patients in card format
- Add new patient with detailed form
- Edit existing patient profiles
- Delete patients (Admin only)
- Medical information display
- Emergency contact management

#### 6. Health Awareness (`/awareness`)
- Ayurvedic principles and concepts
- Daily routine guidelines (Dinacharya)
- Seasonal health tips (Ritucharya)
- Dietary guidelines and six tastes
- Common ailments and treatments
- Preventive care practices

## 🔧 Configuration

### Environment Setup
The frontend is configured to proxy API requests to the backend:

```json
{
  "proxy": "http://localhost:5000"
}
```

### API Integration
All API calls are made using axios with automatic JWT token inclusion:

```javascript
// Automatic token inclusion
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

## 🧪 Testing the Frontend

### 1. Authentication Flow
1. Open `http://localhost:3000`
2. You should be redirected to the login page
3. Test with demo credentials:
   - **Admin**: admin@hospital.com / admin123
   - **Doctor**: doctor@hospital.com / doctor123
   - **Patient**: patient@hospital.com / patient123

### 2. Dashboard Testing
- Verify welcome message displays your name and role
- Check that statistics cards show data
- Confirm recent doctors and patients are listed
- Test quick action buttons navigation

### 3. Doctor Management Testing
1. Navigate to "Doctors" from the navbar
2. **Add Doctor**:
   - Click "Add New Doctor"
   - Fill required fields (marked with *)
   - Test form validation
   - Submit and verify doctor appears in list
3. **Edit Doctor**:
   - Click "Edit" on any doctor card
   - Modify information
   - Save and verify changes
4. **Delete Doctor** (Admin only):
   - Click "Delete" on any doctor card
   - Confirm deletion
   - Verify doctor is removed from list

### 4. Patient Management Testing
1. Navigate to "Patients" from the navbar
2. **Add Patient**:
   - Click "Add New Patient"
   - Fill required fields including emergency contact
   - Test date picker for date of birth
   - Submit and verify patient appears in list
3. **Edit Patient**:
   - Click "Edit" on any patient card
   - Modify information
   - Save and verify changes
4. **Delete Patient** (Admin only):
   - Click "Delete" on any patient card
   - Confirm deletion
   - Verify patient is removed from list

### 5. Responsive Design Testing
Test on different screen sizes:

**Desktop (1200px+)**
- Full navigation menu visible
- Multi-column layouts
- Hover effects on cards

**Tablet (768px - 1199px)**
- Navigation menu may collapse
- Grid layouts adapt
- Touch-friendly buttons

**Mobile (320px - 767px)**
- Hamburger menu navigation
- Single column layouts
- Large touch targets
- Swipe-friendly interactions

### 6. Error Handling Testing
1. **Invalid Login**:
   - Enter wrong credentials
   - Verify error message appears
2. **Form Validation**:
   - Submit empty forms
   - Verify validation messages
3. **Network Errors**:
   - Disconnect internet
   - Try to perform actions
   - Verify error handling
4. **Unauthorized Access**:
   - Try to access protected routes without login
   - Verify redirect to login page

## 🎨 Styling and Theming

### Color Scheme
The application uses an Ayurvedic-inspired color palette:

```css
:root {
  --primary-color: #2c5530;    /* Deep green */
  --secondary-color: #8b4513;  /* Brown */
  --accent-color: #d4af37;     /* Gold */
  --success-color: #28a745;    /* Green */
  --danger-color: #dc3545;     /* Red */
  --warning-color: #ffc107;    /* Yellow */
  --info-color: #17a2b8;       /* Blue */
  --light-color: #f8f9fa;      /* Light gray */
  --dark-color: #343a40;       /* Dark gray */
}
```

### Responsive Breakpoints
```css
/* Mobile */
@media (max-width: 576px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Desktop */
@media (min-width: 769px) { }
```

## 🔒 Security Features

### Authentication
- JWT token storage in localStorage
- Automatic token inclusion in API requests
- Protected route components
- Role-based access control

### Input Validation
- Client-side form validation
- Real-time error feedback
- Sanitized input handling
- XSS protection

### Error Handling
- Graceful error messages
- No sensitive information exposure
- User-friendly error states
- Network error handling

## 📱 Browser Compatibility

### Supported Browsers
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Features Used
- ES6+ JavaScript features
- CSS Grid and Flexbox
- CSS Custom Properties (Variables)
- Fetch API (via axios)
- Local Storage API

## 🚀 Build and Deployment

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Build Output
The build process creates an optimized production build in the `build/` directory:
- Minified JavaScript and CSS
- Optimized images
- Service worker for caching
- Static file serving

### Deployment Options
1. **Static Hosting**: Deploy `build/` folder to services like:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 + CloudFront

2. **Server Deployment**: Serve with web servers like:
   - Nginx
   - Apache
   - Express static middleware

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   ```
   Network Error: Failed to fetch
   ```
   - Ensure backend is running on port 5000
   - Check proxy configuration in package.json
   - Verify CORS settings in backend

2. **Authentication Issues**
   ```
   Token verification failed
   ```
   - Clear localStorage and login again
   - Check JWT_SECRET in backend
   - Verify token format in requests

3. **Build Errors**
   ```
   Module not found
   ```
   - Delete node_modules and package-lock.json
   - Run `npm install` again
   - Check for typos in import statements

4. **Styling Issues**
   ```
   CSS not loading
   ```
   - Check import statements in components
   - Verify CSS file paths
   - Clear browser cache

### Debug Mode
Enable React Developer Tools and check:
- Component state in React DevTools
- Network requests in browser DevTools
- Console for JavaScript errors
- Local Storage for token storage

## 📚 Dependencies

### Production Dependencies
- `react`: React library
- `react-dom`: React DOM rendering
- `react-router-dom`: Client-side routing
- `axios`: HTTP client for API requests

### Development Dependencies
- `react-scripts`: Create React App build tools
- `web-vitals`: Performance monitoring

## 🔄 State Management

The application uses React Context for state management:

### AuthContext
- User authentication state
- JWT token management
- Login/logout functions
- Role-based permissions

### Component State
- Local component state with useState
- Form data management
- Loading and error states
- UI interaction state

## 📄 License

This project is licensed under the MIT License.
