const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

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

// Get token from localStorage or cookies
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("doctorToken") ||
      localStorage.getItem("patientToken")
    );
  }
  return null;
};

// Set token in localStorage
const setAuthToken = (
  token: string,
  role: "doctor" | "patient" | "admin"
): void => {
  if (typeof window !== "undefined") {
    const key = `${role}Token`;
    localStorage.setItem(key, token);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userRole", role);
  }
};

// Remove token from localStorage
const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("patientToken");
    localStorage.removeItem("userRole");
  }
};

// Get user role
const getUserRole = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userRole");
  }
  return null;
};

// Generic API call function
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        window.location.href = "/login";
        throw new ApiError("Unauthorized access", 401);
      }
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred");
  }
};

// Patient API calls
export const patientApi = {
  // Authentication
  login: async (email: string, password: string) => {
    const response = await apiCall("/patients/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (response.data?.accessToken) {
      setAuthToken(response.data.accessToken, "patient");
    }
    return response;
  },

  register: async (userData: any) => {
    return await apiCall("/patients/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    await apiCall("/patients/logout", { method: "POST" });
    removeAuthToken();
  },

  // Profile
  getCurrentPatient: async () => {
    return await apiCall("/patients/currentPatient");
  },

  // Appointments (requires backend endpoints)
  getAppointments: async () => {
    return await apiCall("/patients/appointments");
  },

  // Medications (requires backend endpoints)
  getMedications: async () => {
    return await apiCall("/patients/medications");
  },

  updateInfo: async (userData: any) => {
    return await apiCall("/patients/updateInfo", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  updatePassword: async (oldPassword: string, newPassword: string) => {
    return await apiCall("/patients/updatePassword", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  },

  updateProfilePic: async (formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/patients/updateProfilePic`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return await response.json();
  },
};

// Doctor API calls
export const doctorApi = {
  // Authentication
  login: async (email: string, password: string) => {
    const response = await apiCall("/doctors/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (response.data?.accessToken) {
      setAuthToken(response.data.accessToken, "doctor");
    }
    return response;
  },

  register: async (userData: any) => {
    return await apiCall("/doctors/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    await apiCall("/doctors/logout", { method: "POST" });
    removeAuthToken();
  },

  // Patient Management
  addPatient: async (patientData: any) => {
    return await apiCall("/doctors/addPatient", {
      method: "POST",
      body: JSON.stringify(patientData),
    });
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
    const response = await apiCall("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (response.data?.accessToken) {
      setAuthToken(response.data.accessToken, "admin");
    }
    return response;
  },

  logout: async () => {
    await apiCall("/admin/logout", { method: "POST" });
    removeAuthToken();
  },

  // Current admin profile
  getCurrentAdmin: async () => {
    return await apiCall("/admin/me");
  },

  // Doctor Management
  addDoctor: async (doctorData: any) => {
    // Align with backend route: POST /admin/doctors
    return await apiCall("/admin/doctors", {
      method: "POST",
      body: JSON.stringify(doctorData),
    });
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
export const authUtils = {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getUserRole,
  isAuthenticated: () => !!getAuthToken(),
  isDoctor: () => getUserRole() === "doctor",
  isPatient: () => getUserRole() === "patient",
  isAdmin: () => getUserRole() === "admin",
};

export { ApiError };
