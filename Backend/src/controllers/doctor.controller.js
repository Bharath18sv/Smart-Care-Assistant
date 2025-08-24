import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { Doctor } from "../models/doctor.models.js";
import { Patient } from "../models/patient.models.js";

const registerDoctor = asyncHandler(async (req, res) => {
  const { email, password, fullname, gender, age, phone, address } = req.body;

  //check whether all fields are passed from the request
  if (
    [email, password, fullname, gender, phone].some(
      (field) => typeof field !== "string" || !field.trim()
    ) ||
    typeof age !== "number" ||
    !address ||
    typeof address !== "object"
  ) {
    throw new ApiError(400, "Validation failed: Missing required fields");
  }

  //check if user already exist
  const DoctorAlreadyExist = await Doctor.findOne({
    email,
  });

  if (DoctorAlreadyExist) {
    throw new ApiError(400, `User with email: ${email} already exist`);
  }

  if (age < 1 || age > 100) {
    throw new ApiError(400, "Age is invalid");
  }

  //get the profile picture path
  const profilePicLocalPath = req.files?.profilePic?.[0]?.path;

  //upload image to cloudinary
  let profilePic;
  if (profilePicLocalPath) {
    try {
      profilePic = await uploadOnCloudinary(profilePicLocalPath);
      console.log("Profile picture uploaded successfully");
    } catch (error) {
      console.log("profile pic upload failed", error);
      throw new ApiError(500, "Failed to upload Profile picture");
    }
  }

  //create the doctor
  try {
    const newDoctor = await Doctor.create({
      email,
      fullname,
      password,
      profilePic: profilePic?.url || "",
      gender,
      age,
      phone,
      address,
    });

    const createdDoctor = await Doctor.findById(newDoctor.id).select(
      "-password -refreshToken"
    );

    if (!createdDoctor) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, createdDoctor, "User registered Successfully")
      );
  } catch (error) {
    console.log("User creation failed", error);
    if (profilePic) {
      deleteFromCloudinary(profilePic.public_id);
    }
    throw new ApiError(
      500,
      "Something went wrong while creating the user and images were deleted"
    );
  }
});

const generateAccessRefreshToken = async (DoctorId) => {
  try {
    const Doctor = await Doctor.findById(DoctorId);

    if (!Doctor) {
      console.log(`No Doctor with Doctor id: ${DoctorId}`);
      throw new ApiError(400, `No Doctor with Doctor id: ${DoctorId}`);
    }

    const refreshToken = await Doctor.generateRefreshToken();
    const accessToken = await Doctor.generateAccessToken();

    if (!refreshToken && !accessToken) {
      console.log("Error while generating tokens");
      throw new ApiError(500, "Error while generating tokens");
    }

    //store the refreshToken for the Doctor
    Doctor.refreshToken = refreshToken;

    //save the Doctor data without validating everything again
    await Doctor.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    console.log(`Error while generating or saving the tokens: ${error}`);
    throw new ApiError(
      500,
      `Error while generating or saving the tokens: ${error}`
    );
  }
};

const loginDoctor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const doctor = await Doctor.findOne({ email });

  if (!doctor) {
    console.log(`User with email: ${email} doesn't exist`);
    throw new ApiError(401, `User with email: ${email} doesn't exist`);
  }

  if (!Doctor.isPasswordCorrect(password)) {
    console.log("Password doesn't match");
    throw new ApiError(400, "Password doesn't match");
  }
  const { refreshToken, accessToken } = await generateAccessRefreshToken(
    doctor._id
  );

  //get the logged in Doctor details to send the response
  const loggedInDoctor = await Doctor.findById(doctor._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF
    maxAge: 1000 * 60 * 60, // 1h
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInDoctor, accessToken, refreshToken },
        "Doctor logged in successfully"
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //accept the refresh token from the user for verification
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    console.log("Refresh Token is required");
    throw new ApiError(400, "Refresh Token is required");
  }

  const decodedPayload = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const Doctor = await Doctor.findById(decodedPayload._id);

  if (!Doctor) {
    console.log(
      `Can't find the user with the given refreshtoken: ${incomingRefreshToken}`
    );
    throw new ApiError(
      401,
      `Can't find the user with the given refreshtoken: ${incomingRefreshToken}`
    );
  }

  //check whether token matches
  if (incomingRefreshToken !== Doctor?.refreshToken) {
    console.log(`Tokens did not match/Invalid refresh Token`);
    throw new ApiError(401, `Tokens did not match/Invalid refresh Token`);
  }

  //if token matches, generate the access token
  const { refreshToken, accessToken } = await generateAccessRefreshToken(
    Doctor._id
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: refreshToken },
        "Successfully refreshed Access token"
      )
    );
});

//*** do this later **

// const isAvailable = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     throw new ApiError("Doctor mail is required");
//   }
//   const doctor = await Doctor.findOne({ email });
// });

const addPatient = asyncHandler(async (req, res) => {
  const {
    fullname,
    email,
    password,
    gender,
    age,
    phone,
    address,
    chronicConditions,
    allergies,
    symptoms,
    doctorId,
  } = req.body;

  const patient = await Patient.create({
    fullname,
    email,
    password,
    gender,
    age,
    phone,
    address,
    chronicConditions,
    allergies,
    symptoms,
    doctorId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, patient, "Patient created successfully"));
});

// Get all patients for a doctor
const getPatientsForDoctor = async (req, res) => {
  const { doctorId } = req.query; // as this is a get request we pass the doctor id in the url itself.

  const patients = await Patient.find({ doctorId }).sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { patients },
        "All patients of the doctor fetched successfully"
      )
    );
};

const getCurrentDoctor = asyncHandler(async (req, res) => {
  const { email } = req.user; // Assuming user details are stored in req.user after authentication
  if (!email) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const user = await Doctor.findOne({ email }).select(
    "-password -refreshToken"
  );

  res
    .status(200)
    .json(new ApiResponse(200, user, "User details fetched successfully"));
});

export {
  registerDoctor,
  loginDoctor,
  refreshAccessToken,
  addPatient,
  getPatientsForDoctor,
  getCurrentDoctor,
};
