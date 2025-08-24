"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authUtils, patientApi, doctorApi, adminApi } from "@/utils/api";
import { getUserRole, setUserRole } from "@/utils/roles";

interface User {
  _id: string;
  fullname: string;
  email: string;
  profilePic?: string;
  phone?: string;
  address?: any;
  age?: number;
  gender?: string;
  role: "patient" | "doctor" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    role: "patient" | "doctor" | "admin"
  ) => Promise<void>;
  logout: () => void;
  register: (userData: any, role: "patient" | "doctor") => Promise<void>;
  isAuthenticated: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRoleState] = useState<string | null>(null);

  // Check if user is authenticated on mount
  const checkAuthStatus = async () => {
    try {
      const role = getUserRole();
      if (role) {
        setUserRoleState(role);
        // Try to fetch current user data
        await fetchCurrentUser(role);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async (role: string) => {
    try {
      let userData;
      switch (role) {
        case "patient":
          const patientResponse = await patientApi.getCurrentPatient();
          userData = { ...(patientResponse.data || {}), role: "patient" };
          break;
        case "doctor":
          const doctorResponse = await doctorApi.getCurrentDoctor();
          userData = { ...(doctorResponse.data || {}), role: "doctor" };
          break;
        case "admin":
          // Validate admin session by fetching current admin profile
          const adminResponse = await adminApi.getCurrentAdmin();
          userData = { ...(adminResponse.data || {}), role: "admin" } as any;
          break;
        default:
          throw new Error("Invalid user role");
      }

      setUser(userData);
    } catch (error) {
      console.error("Error fetching current user:", error);
      // Clear invalid session
      setUserRole(null);
      authUtils.removeAuthToken();
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (
    email: string,
    password: string,
    role: "patient" | "doctor" | "admin"
  ) => {
    try {
      let response;
      switch (role) {
        case "patient":
          response = await patientApi.login(email, password);
          break;
        case "doctor":
          response = await doctorApi.login(email, password);
          break;
        case "admin":
          response = await adminApi.login(email, password);
          break;
        default:
          throw new Error("Invalid role");
      }

      if (response.success && response.data) {
        // Map API payload to a normalized user object based on role
        const payload: any = response.data;
        let userData: any = null;
        if (role === "admin") {
          // Admin login payload structure: { admin, accessToken, refreshToken }
          userData = { ...(payload.admin || {}), role };
        } else if (role === "doctor") {
          // Doctor login payload might be { doctor } or { user }
          userData = { ...(payload.doctor || payload.user || {}), role };
        } else if (role === "patient") {
          // Patient login payload might be { patient } or { user }
          userData = { ...(payload.patient || payload.user || {}), role };
        }

        if (!userData || !userData._id) {
          throw new Error("Invalid login response payload");
        }

        // Set user role in localStorage and state
        setUserRole(role);
        setUserRoleState(role);
        setUser(userData as User);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (userRole) {
        switch (userRole) {
          case "patient":
            await patientApi.logout();
            break;
          case "doctor":
            await doctorApi.logout();
            break;
          case "admin":
            await adminApi.logout();
            break;
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all auth data
      setUserRole(null);
      setUserRoleState(null);
      setUser(null);
      authUtils.removeAuthToken();
    }
  };

  const register = async (userData: any, role: "patient" | "doctor") => {
    try {
      let response;
      switch (role) {
        case "patient":
          response = await patientApi.register(userData);
          break;
        case "doctor":
          response = await doctorApi.register(userData);
          break;
        default:
          throw new Error("Invalid role");
      }

      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user && !!userRole,
    userRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
