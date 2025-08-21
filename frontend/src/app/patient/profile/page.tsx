"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { patientApi } from "@/utils/api";

// Patient Profile Page
// - Displays the patient's personal information
// - Provides an Edit mode to update fields
// - Contains a Logout button that uses AuthContext
export default function PatientProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load latest profile on mount
  useEffect(() => {
    const load = async () => {
      if (loading) return;
      if (!user) {
        router.replace("/patient/login");
        return;
      }
      try {
        const res = await patientApi.getCurrentPatient();
        if (res.success && res.data) {
          setForm(res.data);
        }
      } catch (e: any) {
        setError(e.message || "Failed to load profile");
      }
    };
    load();
  }, [loading, user, router]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({
      ...prev,
      address: { ...(prev.address || {}), [name]: value },
    }));
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // Backend already has updateInfo route; re-use it
      const payload = {
        fullname: form.fullname,
        phone: form.phone,
        age: form.age,
        gender: form.gender,
        address: form.address,
      };
      const res = await patientApi.updateInfo(payload);
      if (!res.success) throw new Error(res.message || "Update failed");
      setSuccess("Profile updated successfully");
    } catch (e: any) {
      setError(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Patient Profile</h1>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSave}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              name="fullname"
              value={form.fullname || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={form.age || 0}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <input
                name="gender"
                value={form.gender || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                value={form.email || ""}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Street"
                name="street"
                value={form.address?.street || ""}
                onChange={handleAddressChange}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                placeholder="City"
                name="city"
                value={form.address?.city || ""}
                onChange={handleAddressChange}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                placeholder="State"
                name="state"
                value={form.address?.state || ""}
                onChange={handleAddressChange}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                placeholder="Zip"
                name="zip"
                value={form.address?.zip || ""}
                onChange={handleAddressChange}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                placeholder="Country"
                name="country"
                value={form.address?.country || ""}
                onChange={handleAddressChange}
                className="px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
