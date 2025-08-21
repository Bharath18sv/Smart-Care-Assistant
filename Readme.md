# Smart Care Assistant

A comprehensive healthcare management system built with Next.js frontend and Node.js backend, featuring role-based access control for patients, doctors, and administrators.

## 🏥 Features

### **Patient Dashboard**

- **Health Overview**: Real-time health metrics and scores
- **Profile Management**: Patient information and contact details
- **Appointment Management**: View and manage upcoming appointments
- **Medication Tracking**: Current medications and dosages
- **Health Conditions**: Chronic conditions, allergies, and symptoms display
- **Quick Actions**: Easy access to common healthcare tasks

### **Doctor Dashboard**

- **Practice Overview**: Total patients, appointments, and active cases
- **Patient Management**: Add new patients and view patient list
- **Appointment Scheduling**: Manage patient appointments
- **Patient Profiles**: View detailed patient information
- **Quick Actions**: Add patients, schedule appointments, view records

### **Admin Dashboard**

- **User Management**: Manage doctors and patients
- **System Overview**: Platform statistics and monitoring
- **Role Management**: Assign and manage user roles

### **Security Features**

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different access levels for patients, doctors, and admins
- **Protected Routes**: Automatic redirection for unauthorized access
- **API Security**: Backend middleware for route protection

## 🛠️ Technology Stack

### **Frontend**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Form management and validation

### **Backend**

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Image upload and management

## 📁 Project Structure

```
Smart-Care-Assistant/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/           # API routes
│   │   │   ├── patient/       # Patient pages
│   │   │   ├── doctor/        # Doctor pages
│   │   │   ├── admin/         # Admin pages
│   │   │   └── layout.tsx
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts
│   │   └── utils/             # Utility functions
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middlewares/      # Custom middlewares
│   │   └── utils/            # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### **Prerequisites**

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### **Backend Setup**

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend directory:

   ```env
   PORT=5002
   MONGODB_URI=mongodb://localhost:27017/smart-care-assistant
   JWT_SECRET=your-jwt-secret-key
   ACCESS_TOKEN_SECRET=your-access-token-secret
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```

### **Frontend Setup**

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env.local` file in the frontend directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5002/api
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔐 API Endpoints

### **Authentication**

- `POST /api/patients/login` - Patient login
- `POST /api/patients/register` - Patient registration
- `POST /api/doctors/login` - Doctor login
- `POST /api/doctors/register` - Doctor registration
- `POST /api/admin/login` - Admin login

### **Patient Management**

- `GET /api/patients/currentPatient` - Get current patient profile
- `POST /api/patients/updateInfo` - Update patient information
- `POST /api/patients/updatePassword` - Update patient password
- `POST /api/patients/updateProfilePic` - Update profile picture

### **Doctor Management**

- `GET /api/doctors/currentDoctor` - Get current doctor profile
- `GET /api/doctors` - Get patients for doctor
- `POST /api/doctors/addPatient` - Add new patient
- `POST /api/doctors/registerPatient` - Register new patient

### **Admin Management**

- `GET /api/admin/doctors` - Get all doctors
- `GET /api/admin/patients` - Get all patients
- `POST /api/admin/addDoctor` - Add new doctor

## 🔒 Security Features

### **Authentication Flow**

1. User logs in with email and password
2. Backend validates credentials and returns JWT tokens
3. Frontend stores tokens in localStorage
4. All subsequent API calls include Authorization header
5. Backend middleware validates tokens on protected routes

### **Role-Based Access Control**

- **Patients**: Can access patient dashboard and manage their own data
- **Doctors**: Can access doctor dashboard, manage patients, and view appointments
- **Admins**: Can access admin dashboard and manage all users

### **Protected Routes**

- Automatic redirection for unauthorized access
- Role-specific route protection
- Token validation on every request

## 🎨 UI Components

### **Reusable Components**

- `HealthCard` - Displays health metrics with icons
- `AppointmentCard` - Shows appointment details
- `MedicationCard` - Displays medication information
- `LoadingSpinner` - Loading state component
- `Navbar` - Navigation header
- `AddPatientForm` - Modal form for adding patients
- `ProtectedRoute` - Route protection component

### **Dashboard Features**

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional healthcare interface
- **Real-time Updates**: Live data from backend API
- **Loading States**: Smooth user experience during data fetching
- **Error Handling**: Graceful error handling and user feedback

## 📊 Data Models

### **Patient Model**

```javascript
{
  _id: ObjectId,
  fullname: String,
  email: String,
  password: String (hashed),
  profilePic: String,
  gender: String,
  age: Number,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  chronicConditions: [String],
  allergies: [String],
  symptoms: [String],
  doctorId: ObjectId (ref: Doctor),
  refreshToken: String
}
```

### **Doctor Model**

```javascript
{
  _id: ObjectId,
  fullname: String,
  email: String,
  password: String (hashed),
  profilePic: String,
  gender: String,
  age: Number,
  phone: String,
  address: Object,
  specialization: String,
  refreshToken: String
}
```

## 🚀 Deployment

### **Backend Deployment**

1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### **Frontend Deployment**

1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting platform
3. Configure environment variables

## 🔧 Development

### **Adding New Features**

1. Create backend API endpoints
2. Add frontend components
3. Update authentication if needed
4. Test with different user roles

### **Database Migrations**

- Use Mongoose migrations for schema changes
- Update models and controllers accordingly
- Test data integrity

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- **Real-time Chat**: Doctor-patient messaging
- **Video Consultations**: Telemedicine integration
- **Health Records**: Comprehensive medical history
- **Prescription Management**: Digital prescriptions
- **Lab Results**: Integration with lab systems
- **Mobile App**: React Native mobile application
- **Analytics Dashboard**: Healthcare analytics and insights
