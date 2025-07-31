// File: app/patient/signup/page.tsx

"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ALLERGIES, SYMPTOMS, CHRONIC_CONDITIONS } from "@/app/constants";

export default function PatientSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    phone: "",
    gender: "",
    age: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
    },
    profilePic: "",
    doctorId: "",
    chronicConditions: [],
    allergies: [],
    symptoms: [],
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const current = formData[field as keyof typeof formData] as string[];
    if (current.includes(value)) {
      setFormData({
        ...formData,
        [field]: current.filter((item) => item !== value),
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...current, value],
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/patient/register",
        formData
      );
      alert("Patient registered successfully");
      router.push("/patient/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 shadow-xl rounded-xl bg-white mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Patient Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="fullname"
            onChange={handleChange}
            value={formData.fullname}
            required
            className="input"
            placeholder="Full Name"
          />
          <input
            name="email"
            onChange={handleChange}
            value={formData.email}
            type="email"
            required
            className="input"
            placeholder="Email"
          />
          <input
            name="password"
            onChange={handleChange}
            value={formData.password}
            type="password"
            required
            className="input"
            placeholder="Password"
          />
          <input
            name="phone"
            onChange={handleChange}
            value={formData.phone}
            required
            className="input"
            placeholder="Phone Number"
          />
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="gender"
            onChange={handleChange}
            value={formData.gender}
            required
            className="input"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            name="age"
            onChange={handleChange}
            value={formData.age}
            required
            className="input"
            type="number"
            placeholder="Age"
          />
          <input
            name="address.street"
            onChange={handleChange}
            value={formData.address.street}
            className="input"
            placeholder="Street"
          />
          <input
            name="address.city"
            onChange={handleChange}
            value={formData.address.city}
            className="input"
            placeholder="City"
          />
          <input
            name="address.state"
            onChange={handleChange}
            value={formData.address.state}
            className="input"
            placeholder="State"
          />
          <input
            name="address.zip"
            onChange={handleChange}
            value={formData.address.zip}
            className="input"
            placeholder="ZIP Code"
          />
          <input
            name="address.country"
            disabled
            value={formData.address.country}
            className="input bg-gray-100"
            placeholder="Country"
          />
        </div>

        {/* Optional Fields */}
        <input
          name="profilePic"
          onChange={handleChange}
          value={formData.profilePic}
          className="input"
          placeholder="Profile Picture URL (optional)"
        />
        <input
          name="doctorId"
          onChange={handleChange}
          value={formData.doctorId}
          className="input"
          placeholder="Doctor ID (optional)"
        />

        {/* Medical Fields */}
        <div>
          <label className="font-semibold">Chronic Conditions:</label>
          <div className="flex flex-wrap gap-2">
            {CHRONIC_CONDITIONS.map((cond) => (
              <label key={cond} className="text-sm">
                <input
                  type="checkbox"
                  checked={formData.chronicConditions.includes(cond)}
                  onChange={() => handleArrayChange("chronicConditions", cond)}
                  className="mr-1"
                />
                {cond}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="font-semibold">Allergies:</label>
          <div className="flex flex-wrap gap-2">
            {ALLERGIES.map((item) => (
              <label key={item} className="text-sm">
                <input
                  type="checkbox"
                  checked={formData.allergies.includes(item)}
                  onChange={() => handleArrayChange("allergies", item)}
                  className="mr-1"
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="font-semibold">Symptoms:</label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map((sym) => (
              <label key={sym} className="text-sm">
                <input
                  type="checkbox"
                  checked={formData.symptoms.includes(sym)}
                  onChange={() => handleArrayChange("symptoms", sym)}
                  className="mr-1"
                />
                {sym}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register Patient
        </button>
      </form>
    </div>
  );
}

// Tailwind input base style
// Add this globally in your tailwind.css if not already
// .input {
//   @apply border p-2 rounded w-full;
// }
