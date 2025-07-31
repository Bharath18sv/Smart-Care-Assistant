"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar"; // Uncomment if component exists

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [doctorId, setDoctorId] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    gender: "male",
    age: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
    },
    chronicConditions: "",
    allergies: "",
    symptoms: "",
  });

  // Fetch doctorId from localStorage once component mounts
  useEffect(() => {
    const id = localStorage.getItem("doctorId");
    setDoctorId(id);
  }, []);

  // Fetch patients after doctorId is available
  useEffect(() => {
    if (!doctorId) return;
    fetchPatients();
  }, [doctorId]);

  // Fetch all patients of the logged-in doctor
  const fetchPatients = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/patient?doctorId=${doctorId}`
      );
      setPatients(res.data.patients);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  // Handle input for normal and nested fields
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit form to create new patient
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorId) return alert("Doctor ID not found");

    try {
      await axios.post("http://localhost:5001/api/patient/add", {
        ...form,
        doctorId,
        age: Number(form.age),
        chronicConditions: form.chronicConditions
          .split(",")
          .map((s) => s.trim()),
        allergies: form.allergies.split(",").map((s) => s.trim()),
        symptoms: form.symptoms.split(",").map((s) => s.trim()),
      });

      setForm({
        fullname: "",
        email: "",
        password: "",
        gender: "male",
        age: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "India",
        },
        chronicConditions: "",
        allergies: "",
        symptoms: "",
      });

      fetchPatients(); // Refresh list
    } catch (err) {
      console.error("Error adding patient:", err);
      alert("Error adding patient");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Doctor Dashboard</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 max-w-2xl mb-8"
        >
          <input
            name="fullname"
            value={form.fullname}
            placeholder="Full Name"
            className="border p-2"
            onChange={handleInput}
          />
          <input
            name="email"
            value={form.email}
            placeholder="Email"
            className="border p-2"
            onChange={handleInput}
          />
          <input
            name="password"
            value={form.password}
            placeholder="Password"
            type="password"
            className="border p-2"
            onChange={handleInput}
          />
          <input
            name="age"
            value={form.age}
            placeholder="Age"
            type="number"
            className="border p-2"
            onChange={handleInput}
          />
          <input
            name="phone"
            value={form.phone}
            placeholder="Phone"
            className="border p-2"
            onChange={handleInput}
          />
          <input
            name="gender"
            value={form.gender}
            placeholder="Gender"
            className="border p-2"
            onChange={handleInput}
          />
          <input
            name="chronicConditions"
            value={form.chronicConditions}
            placeholder="Chronic Conditions (comma separated)"
            className="border p-2"
            onChange={handleInput}
          />
          <input
            name="allergies"
            value={form.allergies}
            placeholder="Allergies (comma separated)"
            className="border p-2"
            onChange={handleInput}
          />
          <input
            name="symptoms"
            value={form.symptoms}
            placeholder="Symptoms (comma separated)"
            className="border p-2"
            onChange={handleInput}
          />

          <h2 className="text-lg font-semibold mt-4">Address</h2>
          <input
            name="address.street"
            value={form.address.street}
            placeholder="Street"
            className="border p-2"
            onChange={handleInput}
          />
          <input
            name="address.city"
            value={form.address.city}
            placeholder="City"
            className="border p-2"
            onChange={handleInput}
          />
          <input
            name="address.state"
            value={form.address.state}
            placeholder="State"
            className="border p-2"
            onChange={handleInput}
          />
          <input
            name="address.zip"
            value={form.address.zip}
            placeholder="ZIP Code"
            className="border p-2"
            onChange={handleInput}
          />

          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Add Patient
          </button>
        </form>

        <h2 className="text-2xl font-semibold mb-2">Patients</h2>
        <ul className="space-y-2">
          {patients.map((p: any) => (
            <li key={p._id} className="border p-3 rounded">
              <strong>{p.fullname}</strong> — Age: {p.age}, Gender: {p.gender},
              Symptoms: {p.symptoms.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
