import mongoose, { Schema } from "mongoose";

const donasiSchema = new Schema(
  {
    donor: { type: Schema.Types.ObjectId, ref: "Donor", required: true },
    amount: { type: Number, required: true, min: 0 },
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    paymentProof: { type: String }, // path file
    paymentProofHistory: [
      {
        file: String,
        uploadedAt: Date,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    donationDate: { type: Date, default: Date.now },
    metode: {
      type: String,
      enum: ["transfer", "cash", "ewallet", "qris"],
      default: "transfer",
    },
    jumlahBayar: { type: Number, default: 0 }, // Jumlah biaya yang dibayarkan
  },
  {
    timestamps: true,
  }
);

const Donasi = mongoose.model("Donasi", donasiSchema);
export default Donasi;
// This code defines a Mongoose schema and model for a Donasi (donation) in a MongoDB database.
