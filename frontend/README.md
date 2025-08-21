# Smart Care Assistant - Frontend

A modern healthcare management system built with Next.js and TypeScript.

## Features

### Patient Dashboard

- **Health Overview**: Real-time health metrics and scores
- **Profile Management**: Patient information and contact details
- **Appointment Management**: View and manage upcoming appointments
- **Medication Tracking**: Current medications and dosages
- **Health Conditions**: Chronic conditions, allergies, and symptoms
- **Quick Actions**: Easy access to common healthcare tasks

### Components

#### Reusable Components

- `HealthCard`: Displays health metrics with icons and colors
- `AppointmentCard`: Shows appointment details with status indicators
- `MedicationCard`: Displays medication information
- `LoadingSpinner`: Loading state component
- `Navbar`: Navigation header with user info

#### Dashboard Sections

1. **Health Overview Cards**: Key health metrics at a glance
2. **Profile Section**: Patient information and contact details
3. **Health Conditions**: Medical history and current status
4. **Appointments**: Upcoming and past appointments
5. **Medications**: Current medication list
6. **Quick Actions**: Common healthcare tasks

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

- `/api/patient` - Patient data management
  - `GET /api/patient?type=profile` - Fetch patient profile
  - `GET /api/patient?type=appointments` - Fetch appointments
  - `GET /api/patient?type=medications` - Fetch medications
  - `POST /api/patient` - Update patient data

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hook Form** - Form management

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── patient/
│   │       └── route.ts
│   ├── patient/
│   │   └── dashboard/
│   │       └── page.tsx
│   └── layout.tsx
├── components/
│   ├── HealthCard.tsx
│   ├── AppointmentCard.tsx
│   ├── MedicationCard.tsx
│   ├── LoadingSpinner.tsx
│   └── Navbar.tsx
└── ...
```

## Features in Development

- Real-time appointment booking
- Medication refill requests
- Health records viewing
- Doctor-patient messaging
- Health metrics tracking
- Emergency contact management
