"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getUserRole } from "@/utils/roles";
import { ROUTES } from "@/utils/routes";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Shield,
  ArrowLeft,
  Edit3,
  FileText,
  Pill,
  Activity,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface PatientDetail {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  chronicConditions?: string[];
  allergies?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: {
    date: string;
    diagnosis: string;
    treatment: string;
    notes: string;
  }[];
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    status: "active" | "discontinued";
  }[];
  appointments?: {
    date: string;
    time: string;
    type: string;
    status: "scheduled" | "completed" | "cancelled";
    notes?: string;
  }[];
  lastVisit?: string;
  nextAppointment?: string;
}

export default function PatientDetailPage() {
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;

  useEffect(() => {
    // Check if doctor is logged in
    const currentRole = getUserRole();

    if (!currentRole || currentRole !== "doctor") {
      router.replace(ROUTES.DOCTOR_LOGIN);
      return;
    }

    // Load patient data
    loadPatientData();
  }, [router, patientId]);

  const loadPatientData = async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // For now, use mock data
      const mockPatient: PatientDetail = {
        _id: patientId,
        fullname: "Alice Wilson",
        email: "alice.wilson@example.com",
        phone: "+1-555-0123",
        age: 35,
        gender: "Female",
        address: {
          street: "123 Main Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
        },
        chronicConditions: ["Hypertension", "Type 2 Diabetes", "Asthma"],
        allergies: ["Penicillin", "Peanuts", "Latex"],
        emergencyContact: {
          name: "John Wilson",
          phone: "+1-555-0127",
          relationship: "Spouse",
        },
        medicalHistory: [
          {
            date: "2024-01-15",
            diagnosis: "Hypertension",
            treatment: "Lisinopril 10mg daily",
            notes: "Patient reports occasional headaches. BP: 140/90",
          },
          {
            date: "2023-12-10",
            diagnosis: "Diabetes Management",
            treatment: "Metformin 500mg twice daily",
            notes: "Blood sugar levels improved. HbA1c: 6.8%",
          },
          {
            date: "2023-11-05",
            diagnosis: "Asthma Exacerbation",
            treatment: "Albuterol inhaler PRN",
            notes: "Triggered by seasonal allergies. Peak flow: 350 L/min",
          },
        ],
        medications: [
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            startDate: "2024-01-15",
            status: "active",
          },
          {
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            startDate: "2023-12-10",
            status: "active",
          },
          {
            name: "Albuterol",
            dosage: "90mcg",
            frequency: "As needed",
            startDate: "2023-11-05",
            status: "active",
          },
        ],
        appointments: [
          {
            date: "2024-02-15",
            time: "10:00 AM",
            type: "Follow-up",
            status: "scheduled",
            notes: "Review blood pressure and diabetes management",
          },
          {
            date: "2024-01-15",
            time: "2:00 PM",
            type: "Consultation",
            status: "completed",
            notes: "Initial consultation for hypertension",
          },
        ],
        lastVisit: "2024-01-15",
        nextAppointment: "2024-02-15",
      };

      setPatient(mockPatient);
      setLoading(false);
    } catch (error) {
      console.error("Error loading patient data:", error);
      setError("Failed to load patient data");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.DOCTOR_LOGIN);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "discontinued":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "scheduled":
        return <CheckCircle className="w-4 h-4" />;
      case "discontinued":
      case "cancelled":
        return <AlertTriangle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{error || "Patient not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/doctor/patients")}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Smart Care Assistant
              </h1>
              <span className="ml-4 text-sm text-gray-500">
                Patient Details
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(ROUTES.DOCTOR_DASHBOARD)}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push("/doctor/profile")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {patient.fullname}
                </h1>
                <p className="text-gray-600">
                  Patient ID: {patient._id.slice(-8)}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() =>
                  router.push(`/doctor/patients/${patientId}/edit`)
                }
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Patient</span>
              </button>
              <button
                onClick={() =>
                  router.push(`/doctor/patients/${patientId}/appointments/new`)
                }
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Appointment</span>
              </button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Age</p>
              <p className="text-2xl font-bold text-gray-900">
                {patient.age || "N/A"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Gender</p>
              <p className="text-2xl font-bold text-gray-900">
                {patient.gender || "N/A"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Last Visit</p>
              <p className="text-2xl font-bold text-gray-900">
                {patient.lastVisit
                  ? new Date(patient.lastVisit).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Next Appointment</p>
              <p className="text-2xl font-bold text-gray-900">
                {patient.nextAppointment
                  ? new Date(patient.nextAppointment).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Patient Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-900">{patient.email}</p>
                </div>
              </div>

              {patient.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-gray-900">{patient.phone}</p>
                  </div>
                </div>
              )}

              {patient.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-gray-900">
                      {patient.address.street && `${patient.address.street}, `}
                      {patient.address.city && `${patient.address.city}, `}
                      {patient.address.state} {patient.address.zipCode}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Health Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-600" />
              Health Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Chronic Conditions
                </p>
                {patient.chronicConditions &&
                patient.chronicConditions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.chronicConditions.map((condition, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No chronic conditions recorded
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Allergies
                </p>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No allergies recorded</p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-orange-600" />
              Emergency Contact
            </h2>
            {patient.emergencyContact ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-gray-900">
                    {patient.emergencyContact.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-gray-900">
                    {patient.emergencyContact.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Relationship
                  </p>
                  <p className="text-gray-900">
                    {patient.emergencyContact.relationship}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No emergency contact information</p>
            )}
          </div>

          {/* Current Medications */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Pill className="w-5 h-5 mr-2 text-purple-600" />
              Current Medications
            </h2>
            {patient.medications && patient.medications.length > 0 ? (
              <div className="space-y-3">
                {patient.medications.map((med, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-purple-200 pl-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{med.name}</h4>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          med.status
                        )}`}
                      >
                        {med.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {med.dosage} - {med.frequency}
                    </p>
                    <p className="text-xs text-gray-500">
                      Started: {new Date(med.startDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No current medications</p>
            )}
          </div>
        </div>

        {/* Medical History */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-indigo-600" />
            Medical History
          </h2>
          {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
            <div className="space-y-4">
              {patient.medicalHistory.map((record, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {record.diagnosis}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Treatment:</strong> {record.treatment}
                  </p>
                  <p className="text-sm text-gray-600">{record.notes}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No medical history recorded</p>
          )}
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600" />
            Appointments
          </h2>
          {patient.appointments && patient.appointments.length > 0 ? (
            <div className="space-y-4">
              {patient.appointments.map((appointment, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {appointment.type}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.date).toLocaleDateString()} at{" "}
                        {appointment.time}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  {appointment.notes && (
                    <p className="text-sm text-gray-600 mt-2">
                      {appointment.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No appointments scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
}
