"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      // Simulate fetching user data with token (mocked here)
      setUser("John Doe");
    }
  }, [router]);

  if (!user) {
    return <div className="p-4 text-center">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-10 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, {user}!
        </h1>
        <p className="text-gray-600">This is your patient dashboard.</p>
      </div>
    </div>
  );
}
