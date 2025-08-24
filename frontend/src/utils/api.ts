import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { getUserRole } from "@/utils/roles";
import { ROUTES } from "@/utils/routes";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
}

class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth headers if needed
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Only redirect if we have a user role stored
      const currentRole = getUserRole();
      if (currentRole) {
        if (currentRole === "admin") {
          window.location.href = ROUTES.ADMIN_LOGIN;
        } else if (currentRole === "doctor") {
          window.location.href = ROUTES.DOCTOR_LOGIN;
        } else if (currentRole === "patient") {
          window.location.href = ROUTES.PATIENT_LOGIN;
        } else {
          window.location.href = ROUTES.HOME;
        }
      }
    }
    return Promise.reject(error);
  }
);

// Generic API call function using axios
const apiCall = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  config?: any
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.request({
      method,
      url: endpoint,
      data,
      ...config,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        throw new ApiError(
          error.response.data?.message ||
            `HTTP error! status: ${error.response.status}`,
          error.response.status
        );
      } else if (error.request) {
        // Request was made but no response received
        throw new ApiError("No response received from server");
      } else {
        // Something else happened
        throw new ApiError("Request setup error");
      }
    }
    throw new ApiError("Network error occurred");
  }
};

// Patient API calls
export const patientApi = {
  // Authentication
  login: async (email: string, password: string) => {
    const response = await apiCall<{ accessToken: string }>(
      "/patients/login",
      "POST",
      {
        email,
        password,
      }
    );
    if (response.data?.accessToken) {
      setAuthToken(response.data.accessToken, "patient");
    }
    return response;
  },

  register: async (userData: any) => {
    return await apiCall("/patients/register", "POST", userData);
  },

  logout: async () => {
    await apiCall("/patients/logout", "POST");
    removeAuthToken();
  },

  // Profile
  getCurrentPatient: async () => {
    return await apiCall("/patients/me");
  },

  // Appointments (requires backend endpoints)
  getAppointments: async () => {
    return await apiCall("/patients/appointments");
  },

  // Medications (requires backend endpoints)
  getMedications: async () => {
    return await apiCall("/patients/medications");
  },

  // Symptom logs (requires backend endpoints)
  getSymptomLogs: async () => {
    return await apiCall("/patients/symptomLogs");
  },

  // Update profile
  updateProfile: async (profileData: any) => {
    return await apiCall("/patients/profile", "PUT", profileData);
  },
};

// Doctor API calls
export const doctorApi = {
  login: async (email: string, password: string) => {
    const response = await apiCall<{ accessToken: string }>(
      "/doctors/login",
      "POST",
      {
        email,
        password,
      }
    );
    if (response.data?.accessToken) {
      setAuthToken(response.data.accessToken, "doctor");
    }
    return response;
  },

  register: async (userData: any) => {
    return await apiCall("/doctors/register", "POST", userData);
  },

  logout: async () => {
    await apiCall("/doctors/logout", "POST");
    removeAuthToken();
  },

  // Patient Management
  addPatient: async (patientData: any) => {
    return await apiCall("/doctors/addPatient", "POST", patientData);
  },

  getPatients: async (doctorId?: string) => {
    const endpoint = doctorId ? `/doctors?doctorId=${doctorId}` : "/doctors";
    return await apiCall(endpoint);
  },

  // Profile
  getCurrentDoctor: async () => {
    return await apiCall("/doctors/currentDoctor");
  },
};

// Admin API calls
export const adminApi = {
  login: async (email: string, password: string) => {
    const response = await apiCall<{ accessToken: string }>(
      "/admin/login",
      "POST",
      {
        email,
        password,
      }
    );
    if (response.data?.accessToken) {
      setAuthToken(response.data.accessToken, "admin");
    }
    return response;
  },

  logout: async () => {
    await apiCall("/admin/logout", "POST");
    removeAuthToken();
  },

  // Current admin profile
  getCurrentAdmin: async () => {
    return await apiCall("/admin/me");
  },

  // Doctor Management
  addDoctor: async (doctorData: any) => {
    // Align with backend route: POST /admin/doctors
    return await apiCall("/admin/doctors", "POST", doctorData);
  },

  getDoctors: async () => {
    return await apiCall("/admin/doctors");
  },

  // Patient Management
  getPatients: async () => {
    return await apiCall("/admin/patients");
  },
};

// Utility functions
export const authUtils: any = {
  isAuthenticated: async () => {
    try {
      const role = getUserRole();
      if (!role) return false;
      const res = await apiClient.get(`/${role}/me`);
      return res.status === 200;
    } catch (error) {
      return false;
    }
  },
  isDoctor: () => {
    const role = getUserRole();
    return role === "doctor";
  },
  isPatient: () => {
    const role = getUserRole();
    return role === "patient";
  },
  isAdmin: () => {
    const role = getUserRole();
    return role === "admin";
  },
};

// Auth token management functions
export const setAuthToken = (token: string, role: string) => {
  // Set the token in cookies (handled by backend)
  // Also store role in localStorage for client-side access
  localStorage.setItem("userRole", role);
};

export const removeAuthToken = () => {
  // Remove role from localStorage
  localStorage.removeItem("userRole");
  // Clear any other auth-related data
  localStorage.removeItem("user");
};

export const getAuthToken = (): string | null => {
  // Token is stored in cookies by backend, so we don't need to return it
  // This function exists for compatibility but returns null
  return null;
};

export { ApiError };
