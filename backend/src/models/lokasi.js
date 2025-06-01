import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 150, unique: true },
    address: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    description: { type: String },
    image: { type: String },
    status: { type: String, enum: ["aktif", "nonaktif"], default: "aktif" },
  },
  {
    timestamps: true,
  }
);

const Location = mongoose.model("Location", locationSchema);
export default Location;
// This code defines a Mongoose schema and model for a Location in a MongoDB database.
