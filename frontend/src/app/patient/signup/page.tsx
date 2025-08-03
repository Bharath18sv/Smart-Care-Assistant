"use client";

import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect, useCallback, memo } from "react";
import axios from "axios";
import { CHRONIC_CONDITIONS, ALLERGIES, SYMPTOMS } from "@/app/constants";

type FormData = {
  email: string;
  password: string;
  fullname: string;
  phone: string;
  gender: string;
  age: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  chronicConditions: string[];
  allergies: string[];
  symptoms: string[];
};

// Memoized input component for better performance
const MemoizedInput = memo(
  ({
    label,
    error,
    errorMessage,
    ...props
  }: {
    label: string;
    error?: boolean;
    errorMessage?: string;
    [key: string]: any;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent ${
          error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      />
      {error && errorMessage && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  )
);

MemoizedInput.displayName = "MemoizedInput";

export default function PatientSignupPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: "onBlur", // Changed from "onChange" to "onBlur" for better performance
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Memoize options to prevent unnecessary re-renders
  const createOptions = useCallback(
    (arr: string[]) => arr.map((item) => ({ label: item, value: item })),
    []
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: FormData) => {
    console.log(`Submitted data: ${data}`);

    // Additional validation before submission
    if (data.age < 1 || data.age > 100) {
      setMessage("Age must be between 1 and 100");
      return;
    }

    if (!/^[0-9]{10,15}$/.test(data.phone)) {
      setMessage("Please enter a valid phone number (10-15 digits)");
      return;
    }

    // Validate city, state, and country
    const textPattern = /^[a-zA-Z\s]+$/;

    if (!textPattern.test(data.address.city)) {
      setMessage("City must contain only letters and spaces");
      return;
    }

    if (!textPattern.test(data.address.state)) {
      setMessage("State must contain only letters and spaces");
      return;
    }

    if (!textPattern.test(data.address.country)) {
      setMessage("Country must contain only letters and spaces");
      return;
    }

    if (data.address.city.length < 2 || data.address.city.length > 50) {
      setMessage("City must be between 2 and 50 characters");
      return;
    }

    if (data.address.state.length < 2 || data.address.state.length > 50) {
      setMessage("State must be between 2 and 50 characters");
      return;
    }

    if (data.address.country.length < 2 || data.address.country.length > 50) {
      setMessage("Country must be between 2 and 50 characters");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5001/api/patients/register", data);
      setMessage("Patient registered successfully!");
      reset();
    } catch (error: any) {
      console.error(error);
      setMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Patient Registration
          </h1>
          <p className="text-gray-600 text-lg">
            Join our healthcare platform and get the care you deserve
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* full name */}
                <MemoizedInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  error={!!errors.fullname}
                  errorMessage={errors.fullname?.message}
                  {...register("fullname", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Full name must be at least 2 characters",
                    },
                  })}
                />

                {/* email */}
                <MemoizedInput
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  error={!!errors.email}
                  errorMessage={errors.email?.message}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                />

                {/* password */}
                <MemoizedInput
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  error={!!errors.password}
                  errorMessage={errors.password?.message}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />

                {/* phone number */}
                <MemoizedInput
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  error={!!errors.phone}
                  errorMessage={errors.phone?.message}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message:
                        "Please enter a valid phone number (10-15 digits)",
                    },
                  })}
                />

                {/* age */}
                <MemoizedInput
                  label="Age"
                  type="number"
                  placeholder="Enter your age"
                  error={!!errors.age}
                  errorMessage={errors.age?.message}
                  {...register("age", {
                    required: "Age is required",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Age must be at least 1",
                    },
                    max: {
                      value: 100,
                      message: "Age must be 100 or less",
                    },
                  })}
                />

                {/* gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    {...register("gender", { required: "Gender is required" })}
                    className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.gender
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select your gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                Address Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* street address */}
                <div className="md:col-span-2">
                  <MemoizedInput
                    label="Street Address"
                    placeholder="Enter your street address"
                    error={!!errors.address?.street}
                    errorMessage={errors.address?.street?.message}
                    {...register("address.street", {
                      required: "Street address is required",
                    })}
                  />
                </div>

                {/* city */}
                <MemoizedInput
                  label="City"
                  placeholder="Enter your city"
                  error={!!errors.address?.city}
                  errorMessage={errors.address?.city?.message}
                  {...register("address.city", {
                    required: "City is required",
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "City must contain only letters and spaces",
                    },
                    minLength: {
                      value: 2,
                      message: "City must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "City must be less than 50 characters",
                    },
                  })}
                />

                {/* state */}
                <MemoizedInput
                  label="State"
                  placeholder="Enter your state"
                  error={!!errors.address?.state}
                  errorMessage={errors.address?.state?.message}
                  {...register("address.state", {
                    required: "State is required",
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "State must contain only letters and spaces",
                    },
                    minLength: {
                      value: 2,
                      message: "State must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "State must be less than 50 characters",
                    },
                  })}
                />

                {/* zip code */}
                <MemoizedInput
                  label="Zip Code"
                  placeholder="Enter your zip code"
                  error={!!errors.address?.zip}
                  errorMessage={errors.address?.zip?.message}
                  {...register("address.zip", {
                    required: "Zip code is required",
                    pattern: {
                      value: /^[0-9]{5,10}$/,
                      message: "Please enter a valid zip code",
                    },
                  })}
                />

                {/* country */}
                <MemoizedInput
                  label="Country"
                  placeholder="Enter your country"
                  error={!!errors.address?.country}
                  errorMessage={errors.address?.country?.message}
                  {...register("address.country", {
                    required: "Country is required",
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Country must contain only letters and spaces",
                    },
                    minLength: {
                      value: 2,
                      message: "Country must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Country must be less than 50 characters",
                    },
                  })}
                />
              </div>
            </div>

            {/* Medical Information Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                Medical Information
              </h2>

              <div className="space-y-6">
                {/* chronic conditions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chronic Conditions
                  </label>
                  {isMounted ? (
                    <Controller
                      control={control}
                      name="chronicConditions"
                      render={({ field }) => (
                        <Select<{ label: string; value: string }, true>
                          options={createOptions(CHRONIC_CONDITIONS)}
                          isMulti
                          className="basic-multi-select"
                          classNamePrefix="select"
                          value={
                            field.value
                              ? createOptions(CHRONIC_CONDITIONS).filter(
                                  (option) => field.value.includes(option.value)
                                )
                              : []
                          }
                          onChange={(selected) =>
                            field.onChange(
                              selected ? selected.map((opt) => opt.value) : []
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          isSearchable={false}
                          closeMenuOnSelect={false}
                        />
                      )}
                    />
                  ) : (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                      Loading...
                    </div>
                  )}
                </div>

                {/* allergies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies
                  </label>
                  {isMounted ? (
                    <Controller
                      control={control}
                      name="allergies"
                      render={({ field }) => (
                        <Select<{ label: string; value: string }, true>
                          {...field}
                          options={createOptions(ALLERGIES)}
                          isMulti
                          className="basic-multi-select"
                          classNamePrefix="select"
                          value={
                            field.value
                              ? createOptions(ALLERGIES).filter((option) =>
                                  field.value.includes(option.value)
                                )
                              : []
                          }
                          onChange={(selected) =>
                            field.onChange(
                              selected ? selected.map((opt) => opt.value) : []
                            )
                          }
                          isSearchable={false}
                          closeMenuOnSelect={false}
                        />
                      )}
                    />
                  ) : (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                      Loading...
                    </div>
                  )}
                </div>

                {/* symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms
                  </label>
                  {isMounted ? (
                    <Controller
                      control={control}
                      name="symptoms"
                      render={({ field }) => (
                        <Select<{ label: string; value: string }, true>
                          {...field}
                          options={createOptions(SYMPTOMS)}
                          isMulti
                          className="basic-multi-select"
                          classNamePrefix="select"
                          value={
                            field.value
                              ? createOptions(SYMPTOMS).filter((option) =>
                                  field.value.includes(option.value)
                                )
                              : []
                          }
                          onChange={(selected) =>
                            field.onChange(
                              selected ? selected.map((opt) => opt.value) : []
                            )
                          }
                          isSearchable={false}
                          closeMenuOnSelect={false}
                        />
                      )}
                    />
                  ) : (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                      Loading...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-lg font-semibold text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`text-center p-4 rounded-lg ${
                  message.includes("successfully")
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
