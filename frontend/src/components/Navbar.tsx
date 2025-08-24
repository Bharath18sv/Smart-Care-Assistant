// File: components/Navbar.tsx
// Purpose: Reusable top navigation bar for authenticated areas.
// - Shows app title and user greeting
// - Provides quick link to the patient's Profile page
// - Includes Logout action
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";

interface User {
  fullname?: string;
  fullName?: string;
  profilePic?: string;
  phone?: string;
  address?: any;
  chronicConditions?: string[];
  allergies?: string[];
  symptoms?: string[];
  role?: string;
}

const Navbar = ({ user }: { user: User }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // NOTE: We only navigate here; actual token clearing is done by AuthContext.logout.
    // If this component is used outside AuthContext, consider clearing localStorage too.
    router.push(ROUTES.PATIENT_LOGIN);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Care Assistant
            </h1>
            <span className="ml-4 text-sm text-gray-500">Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {user?.fullname || user?.fullName || "User"}
            </span>
            {/* Link to dedicated Patient Profile page */}
            <Link
              href={ROUTES.PATIENT_PROFILE}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
