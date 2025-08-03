"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function AddDoctorPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    specialization: [],
    qualifications: [],
    experience: "",
    about: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecializationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev: any) => ({
      ...prev,
      specialization: values,
    }));
  };

  const handleQualificationsChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev: any) => ({
      ...prev,
      qualifications: values,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/doctors`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Doctor added successfully!");
      setFormData({
        email: "",
        password: "",
        fullname: "",
        specialization: [],
        qualifications: [],
        experience: "",
        about: "",
        phone: "",
      });

      // Redirect to doctors list after 2 seconds
      setTimeout(() => {
        router.push("/admin/doctors");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Smart Care Assistant
                </h1>
              </Link>
              <span className="ml-4 text-sm text-gray-500">
                Admin Dashboard
              </span>
            </div>
            <Link
              href="/admin/doctors"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Doctors
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Add New Doctor
            </h2>
            <p className="text-gray-600">
              Fill in the doctor's information to add them to the system
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Dr. John Doe"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="doctor@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter password"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="+1234567890"
                />
              </div>

              {/* Experience */}
              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="5"
                  min="0"
                />
              </div>
            </div>

            {/* Specialization */}
            <div>
              <label
                htmlFor="specialization"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Specialization *
              </label>
              <select
                id="specialization"
                name="specialization"
                multiple
                value={formData.specialization}
                onChange={handleSpecializationChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                required
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Gastroenterology">Gastroenterology</option>
                <option value="Neurology">Neurology</option>
                <option value="Oncology">Oncology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="Radiology">Radiology</option>
                <option value="Surgery">Surgery</option>
                <option value="Urology">Urology</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl (or Cmd on Mac) to select multiple specializations
              </p>
            </div>

            {/* Qualifications */}
            <div>
              <label
                htmlFor="qualifications"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Qualifications *
              </label>
              <select
                id="qualifications"
                name="qualifications"
                multiple
                value={formData.qualifications}
                onChange={handleQualificationsChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                required
              >
                <option value="MBBS">MBBS</option>
                <option value="MD">MD</option>
                <option value="MS">MS</option>
                <option value="DM">DM</option>
                <option value="MCh">MCh</option>
                <option value="PhD">PhD</option>
                <option value="Fellowship">Fellowship</option>
                <option value="Diploma">Diploma</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl (or Cmd on Mac) to select multiple qualifications
              </p>
            </div>

            {/* About */}
            <div>
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                About Doctor *
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Brief description about the doctor's expertise, experience, and approach to patient care..."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/doctors"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding Doctor..." : "Add Doctor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
