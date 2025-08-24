"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getUserRole } from "@/utils/roles";
import { ROUTES } from "@/utils/routes";
import {
  User,
  Search,
  Filter,
  Plus,
  Eye,
  Phone,
  Mail,
  Calendar,
  MapPin,
} from "lucide-react";

interface Patient {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: string;
  address?: {
    city?: string;
    state?: string;
  };
  chronicConditions?: string[];
  lastVisit?: string;
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterAge, setFilterAge] = useState("");
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if doctor is logged in
    const currentRole = getUserRole();

    if (!currentRole || currentRole !== "doctor") {
      router.replace(ROUTES.DOCTOR_LOGIN);
      return;
    }

    // Load patients data
    loadPatients();
  }, [router]);

  const loadPatients = async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // For now, use mock data
      const mockPatients: Patient[] = [
        {
          _id: "1",
          fullname: "Alice Wilson",
          email: "alice.wilson@example.com",
          phone: "+1-555-0123",
          age: 35,
          gender: "Female",
          address: { city: "New York", state: "NY" },
          chronicConditions: ["Hypertension", "Diabetes"],
          lastVisit: "2024-01-15",
        },
        {
          _id: "2",
          fullname: "Bob Davis",
          email: "bob.davis@example.com",
          phone: "+1-555-0124",
          age: 42,
          gender: "Male",
          address: { city: "Los Angeles", state: "CA" },
          chronicConditions: ["Asthma"],
          lastVisit: "2024-01-10",
        },
        {
          _id: "3",
          fullname: "Carol Miller",
          email: "carol.miller@example.com",
          phone: "+1-555-0125",
          age: 28,
          gender: "Female",
          address: { city: "Chicago", state: "IL" },
          chronicConditions: [],
          lastVisit: "2024-01-20",
        },
        {
          _id: "4",
          fullname: "David Johnson",
          email: "david.johnson@example.com",
          phone: "+1-555-0126",
          age: 55,
          gender: "Male",
          address: { city: "Houston", state: "TX" },
          chronicConditions: ["Heart Disease", "Hypertension"],
          lastVisit: "2024-01-05",
        },
      ];

      setPatients(mockPatients);
      setLoading(false);
    } catch (error) {
      console.error("Error loading patients:", error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.DOCTOR_LOGIN);
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = !filterGender || patient.gender === filterGender;
    const matchesAge =
      !filterAge ||
      (filterAge === "18-30" &&
        patient.age &&
        patient.age >= 18 &&
        patient.age <= 30) ||
      (filterAge === "31-50" &&
        patient.age &&
        patient.age >= 31 &&
        patient.age <= 50) ||
      (filterAge === "51+" && patient.age && patient.age >= 51);

    return matchesSearch && matchesGender && matchesAge;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patients...</p>
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
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Smart Care Assistant
              </h1>
              <span className="ml-4 text-sm text-gray-500">
                Patient Management
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Patients</h1>
          <p className="text-gray-600">
            Manage and view information about your patients
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Patients
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Age Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Group
              </label>
              <select
                value={filterAge}
                onChange={(e) => setFilterAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Ages</option>
                <option value="18-30">18-30</option>
                <option value="31-50">31-50</option>
                <option value="51+">51+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Patient Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <button
                  onClick={() => router.push(`/doctor/patients/${patient._id}`)}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View Details
                </button>
              </div>

              {/* Patient Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {patient.fullname}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ID: {patient._id.slice(-8)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{patient.email}</span>
                  </div>

                  {patient.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{patient.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {patient.age && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{patient.age} years</span>
                      </div>
                    )}
                    {patient.gender && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {patient.gender}
                      </span>
                    )}
                  </div>

                  {patient.address && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {patient.address.city}, {patient.address.state}
                      </span>
                    </div>
                  )}
                </div>

                {/* Chronic Conditions */}
                {patient.chronicConditions &&
                  patient.chronicConditions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Conditions:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {patient.chronicConditions.map((condition, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Last Visit */}
                {patient.lastVisit && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Last Visit:{" "}
                      {new Date(patient.lastVisit).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No patients found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterGender || filterAge
                ? "Try adjusting your search or filters"
                : "You don't have any patients yet"}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Patients
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active This Month
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    patients.filter(
                      (p) =>
                        p.lastVisit &&
                        new Date(p.lastVisit) >
                          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  With Conditions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    patients.filter(
                      (p) =>
                        p.chronicConditions && p.chronicConditions.length > 0
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
