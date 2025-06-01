import mongoose, { Document, Schema } from "mongoose";

const donorSchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 150 },
    email: { type: String, maxlength: 150, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

const Donor = mongoose.model("Donor", donorSchema);
export default Donor;
// This code defines a Mongoose schema and model for a Donor in a MongoDB database.
