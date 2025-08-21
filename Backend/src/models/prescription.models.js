import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // auto-set when not provided
  },
  medications: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      dosage: {
        type: String,
        required: true,
      },
      frequency: {
        type: String,
        required: true,
      },
      duration: {
        type: String, // e.g., "5 days"
      },
      notes: {
        type: String, // optional remarks like "after meals"
      },
    },
  ],
});

PrescriptionSchema.index({ patientId: 1, date: -1 });

export const Prescription = mongoose.model("Prescription", PrescriptionSchema);
