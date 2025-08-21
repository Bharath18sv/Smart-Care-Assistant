"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { patientApi } from "@/utils/api";
import Navbar from "@/components/Navbar";
import {
  Calendar,
  Clock,
  User,
  Pill,
  Activity,
  AlertTriangle,
  Heart,
  FileText,
  Phone,
  MapPin,
  Edit,
  Plus,
} from "lucide-react";
import HealthCard from "@/components/HealthCard";
import AppointmentCard from "@/components/AppointmentCard";
import MedicationCard from "@/components/MedicationCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/ProtectedRoute";

interface PatientData {
  _id: string;
  fullname: string;
  profilePic?: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  chronicConditions: string[];
  allergies: string[];
  symptoms: string[];
  age: number;
  gender: string;
  email: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

export default function DashboardPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState({
    profile: false,
    appointments: false,
    medications: false,
  });

  // Real data will be loaded via APIs as they become available.

  const getPatientData = async () => {
    setLoading((prev) => ({ ...prev, profile: true }));
    try {
      const response = await patientApi.getCurrentPatient();
      if (response.success && response.data) {
        setPatientData(response.data as PatientData);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const getAppointments = async () => {
    setLoading((prev) => ({ ...prev, appointments: true }));
    try {
      const res = await patientApi.getAppointments();
      if (res.success && Array.isArray(res.data)) {
        setAppointments(
          res.data.map((a: any) => ({
            id: a._id || a.id,
            doctorName: a.doctorName || a.doctor?.fullname || "Doctor",
            date: a.date,
            time: a.time,
            type: a.type || "Appointment",
            status: a.status || "Upcoming",
          }))
        );
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading((prev) => ({ ...prev, appointments: false }));
    }
  };

  const getMedications = async () => {
    setLoading((prev) => ({ ...prev, medications: true }));
    try {
      const res = await patientApi.getMedications();
      if (res.success && Array.isArray(res.data)) {
        setMedications(
          res.data.map((m: any) => ({
            id: m._id || m.id,
            name: m.name,
            dosage: m.dosage,
            frequency: m.frequency,
            startDate: m.startDate,
            endDate: m.endDate,
          }))
        );
      } else {
        setMedications([]);
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
    } finally {
      setLoading((prev) => ({ ...prev, medications: false }));
    }
  };

  useEffect(() => {
    if (authUser && !authLoading) {
      getPatientData();
      getAppointments();
      getMedications();
    }
  }, [authUser, authLoading]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push("/patient/login");
    }
  }, [authUser, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  const formatAddress = (address: PatientData["address"]) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
  };

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={patientData || authUser} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {patientData?.fullname || authUser.fullname}!
            </h1>
            <p className="text-gray-600">
              Here's your health overview for today
            </p>
          </div>

          {/* Health Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <HealthCard
              icon={Heart}
              title="Health Score"
              value="85%"
              color="blue"
            />
            <HealthCard
              icon={Calendar}
              title="Next Appointment"
              value={
                appointments.length
                  ? new Date(appointments[0].date).toLocaleDateString()
                  : "N/A"
              }
              color="green"
            />
            <HealthCard
              icon={Pill}
              title="Active Medications"
              value={medications.length}
              color="purple"
            />
            <HealthCard
              icon={AlertTriangle}
              title="Active Symptoms"
              value={patientData?.symptoms.length || 0}
              color="orange"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile and Health Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profile
                  </h2>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                {loading.profile ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">
                          {patientData?.fullname || authUser.fullname}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {patientData?.age || authUser.age} years old •{" "}
                          {patientData?.gender || authUser.gender}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {patientData?.phone || authUser.phone}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {patientData?.address
                            ? formatAddress(patientData.address)
                            : "Address not available"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Health Conditions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Health Conditions
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Chronic Conditions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(patientData?.chronicConditions || []).map(
                        (condition: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                          >
                            {condition}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(patientData?.allergies || []).map(
                        (allergy: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                          >
                            {allergy}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Current Symptoms
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(patientData?.symptoms || []).map(
                        (symptom: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                          >
                            {symptom}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Appointments and Medications */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Appointments */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Upcoming Appointments
                  </h2>
                  <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Plus className="h-4 w-4 mr-1" />
                    Book New
                  </button>
                </div>
                {loading.appointments ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : appointments.length ? (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    No upcoming appointments.
                  </p>
                )}
              </div>

              {/* Current Medications */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Current Medications
                  </h2>
                  <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Medication
                  </button>
                </div>
                {loading.medications ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : medications.length ? (
                  <div className="space-y-4">
                    {medications.map((medication) => (
                      <MedicationCard
                        key={medication.id}
                        medication={medication}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    No current medications.
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Book Appointment
                    </span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <FileText className="h-6 w-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">
                      View Records
                    </span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <Pill className="h-6 w-6 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Medication Refill
                    </span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <Activity className="h-6 w-6 text-orange-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Health Metrics
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
