import mongoose from "mongoose";

const VitalsSchema = new mongoose.Schema(
  {
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
    },
    sugar: Number,
  },
  { _id: false }
);

const SymptomLogSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // auto-set when not provided
  },
  symptoms: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  vitals: VitalsSchema,
});

// helpful for queries like "get patient logs sorted by date"
SymptomLogSchema.index({ patientId: 1, date: -1 });

export const SymptomLog = mongoose.model("SymptomLog", SymptomLogSchema);
