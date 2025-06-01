import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    photoBefore: { type: String, required: true }, // path file
    photoAfter: { type: String, required: true }, // path file
    description: { type: String },
    reportDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
// This code defines a Mongoose schema and model for a Report in a MongoDB database.
