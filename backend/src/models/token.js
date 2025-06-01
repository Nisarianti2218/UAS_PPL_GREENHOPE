import mongoose, { Document, Schema } from "mongoose";

const tokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: { expires: "2h" } },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model("Token", tokenSchema);
export default Token;
// This code defines a Mongoose schema and model for a Token in a MongoDB database.
