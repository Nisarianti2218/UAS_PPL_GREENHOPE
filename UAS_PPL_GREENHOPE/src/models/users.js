import mongoose, { Document, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 150 },
    username: { type: String, required: true, unique: true, maxLength: 150 },
    email: { type: String, maxlength: 150, unique: true, required: true },
    password: { type: String, required: true, maxLength: 128 },
    profilePath: { type: String, default: "" },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
// This code defines a Mongoose schema and model for a User in a MongoDB database.
