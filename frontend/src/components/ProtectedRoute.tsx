"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("patient" | "doctor" | "admin")[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ["patient", "doctor", "admin"],
  redirectTo = "/login"
}: ProtectedRouteProps) {
  const { user, loading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
      } else if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole as any)) {
        // Redirect to appropriate dashboard based on user role
        switch (userRole) {
          case "patient":
            router.push("/patient/dashboard");
            break;
          case "doctor":
            router.push("/doctor/dashboard");
            break;
          case "admin":
            router.push("/admin/dashboard");
            break;
          default:
            router.push(redirectTo);
        }
      }
    }
  }, [user, loading, userRole, allowedRoles, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole as any)) {
    return null;
  }

  return <>{children}</>;
} 