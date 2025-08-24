"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/utils/api";
import { SPECIALIZATION, QUALIFICATIONS } from "@/app/constants";
import Select from "react-select";

export default function AddDoctorPage() {
  const { user: authUser, loading: authLoading } = useAuth();
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
    if (!authLoading && !authUser) {
      router.push("/admin/login");
    }
  }, [authUser, authLoading, router]);

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

  const handleSpecializationChange = (selectedOptions: any) => {
    const values = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    setFormData((prev: any) => ({
      ...prev,
      specialization: values,
    }));
  };

  const handleQualificationsChange = (selectedOptions: any) => {
    const values = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
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

    // Form validation
    if (!formData.fullname.trim()) {
      setError("Full name is required");
      setLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }
    if (formData.specialization.length === 0) {
      setError("At least one specialization is required");
      setLoading(false);
      return;
    }
    if (formData.qualifications.length === 0) {
      setError("At least one qualification is required");
      setLoading(false);
      return;
    }
    if (!formData.about.trim()) {
      setError("About section is required");
      setLoading(false);
      return;
    }

    try {
      const response = await adminApi.addDoctor(formData);

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
      // Handle validation errors specifically
      if (err.message && err.message.includes("validation failed")) {
        const validationErrors = [];
        if (err.message.includes("specialization")) {
          validationErrors.push(
            "Invalid specialization selected. Please choose from the available options."
          );
        }
        if (err.message.includes("qualifications")) {
          validationErrors.push(
            "Invalid qualification selected. Please choose from the available options."
          );
        }
        setError(validationErrors.join(" "));
      } else {
        setError(err.message || "Failed to add doctor");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

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
              <Select
                isMulti
                options={SPECIALIZATION.map((spec) => ({
                  value: spec,
                  label: spec,
                }))}
                value={formData.specialization.map((spec) => ({
                  value: spec,
                  label: spec,
                }))}
                onChange={handleSpecializationChange}
                className="w-full"
                classNamePrefix="select"
                placeholder="Select specializations..."
                isClearable
                isSearchable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "1px solid #d1d5db",
                    borderRadius: "12px",
                    padding: "4px",
                    minHeight: "48px",
                    "&:hover": {
                      borderColor: "#3b82f6",
                    },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "#3b82f6"
                      : state.isFocused
                      ? "#eff6ff"
                      : "white",
                    color: state.isSelected ? "white" : "#374151",
                    "&:hover": {
                      backgroundColor: state.isSelected ? "#3b82f6" : "#eff6ff",
                    },
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: "#eff6ff",
                    borderRadius: "8px",
                  }),
                  multiValueLabel: (provided) => ({
                    ...provided,
                    color: "#1e40af",
                    fontWeight: "500",
                  }),
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Select one or more specializations
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
              <Select
                isMulti
                options={QUALIFICATIONS.map((qual) => ({
                  value: qual,
                  label: qual,
                }))}
                value={formData.qualifications.map((qual) => ({
                  value: qual,
                  label: qual,
                }))}
                onChange={handleQualificationsChange}
                className="w-full"
                classNamePrefix="select"
                placeholder="Select qualifications..."
                isClearable
                isSearchable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "1px solid #d1d5db",
                    borderRadius: "12px",
                    padding: "4px",
                    minHeight: "48px",
                    "&:hover": {
                      borderColor: "#3b82f6",
                    },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "#3b82f6"
                      : state.isFocused
                      ? "#eff6ff"
                      : "white",
                    color: state.isSelected ? "white" : "#374151",
                    "&:hover": {
                      backgroundColor: state.isSelected ? "#3b82f6" : "#eff6ff",
                    },
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: "#eff6ff",
                    borderRadius: "8px",
                  }),
                  multiValueLabel: (provided) => ({
                    ...provided,
                    color: "#1e40af",
                    fontWeight: "500",
                  }),
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Select one or more qualifications
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
                href="/admin/dashboard"
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
