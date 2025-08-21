import { NextRequest, NextResponse } from "next/server";

// Mock data - in a real app, this would come from your backend
const mockPatientData = {
  fullName: "John Doe",
  profilePic: "/default-profile.png",
  phone: "123-456-7890",
  address: "123 Main St, Anytown, USA",
  chronicConditions: ["Diabetes", "Hypertension"],
  allergies: ["Peanuts", "Penicillin"],
  symptoms: ["Fatigue", "Headache", "Chest pain"],
  age: 45,
  gender: "Male",
  email: "john.doe@example.com",
};

const mockAppointments = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-01-15",
    time: "10:00 AM",
    type: "Check-up",
    status: "Upcoming",
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    date: "2024-01-20",
    time: "2:30 PM",
    type: "Follow-up",
    status: "Confirmed",
  },
];

const mockMedications = [
  {
    id: "1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: "2024-01-01",
  },
  {
    id: "2",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    startDate: "2024-01-01",
  },
];

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Get the user token from the request headers
    // 2. Validate the token
    // 3. Fetch data from your backend API

    const url = new URL(request.url);
    const type = url.searchParams.get("type");

    switch (type) {
      case "profile":
        return NextResponse.json({
          success: true,
          data: mockPatientData,
        });

      case "appointments":
        return NextResponse.json({
          success: true,
          data: mockAppointments,
        });

      case "medications":
        return NextResponse.json({
          success: true,
          data: mockMedications,
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            profile: mockPatientData,
            appointments: mockAppointments,
            medications: mockMedications,
          },
        });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch patient data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In a real app, you would:
    // 1. Validate the request body
    // 2. Update the data in your backend
    // 3. Return the updated data

    return NextResponse.json({
      success: true,
      message: "Data updated successfully",
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update data" },
      { status: 500 }
    );
  }
}
