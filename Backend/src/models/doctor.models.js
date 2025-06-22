import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SPECIALIZATION } from "../constants.js";
import { QUALIFICATIONS } from "../constants.js";

const doctorSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    profilePic: {
      type: String, //cloudinary url
    },
    specialization: {
      type: [String],
      enum: SPECIALIZATION,
      required: true,
    },
    qualifications: {
      type: [String], // e.g. ["MBBS", "MD"]
      enum: QUALIFICATIONS,
      required: true,
    },
    experience: {
      type: Number, // in years
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    patients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient", // Reference to patient model
      },
    ],
    about: {
      type: String,
      required: true,
    },
    phone: {
      type: String
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//only hash the password if it is modified(hashes when created also, because creation != modification)
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//a method for checking the password
doctorSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

//methods for generating tokens
doctorSchema.methods.generateAccessToken = async function () {
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

doctorSchema.methods.generateRefreshToken = async function () {
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Doctor = mongoose.model("Doctor", doctorSchema);
