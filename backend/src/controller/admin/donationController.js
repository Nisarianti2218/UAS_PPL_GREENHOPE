import { Donasi, Donor, Location } from "../../models/index.js";
import { Types } from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import sharp from "sharp";

// Konversi __filename dan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DonationController = {
  getAllDonations: async (req, res) => {
    try {
      const donations = await Donasi.find()
        .populate("donor", "name")
        .populate("location", "name")
        .sort({ createdAt: -1 });

      res.status(200).json(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ message: "Error fetching donations", error });
    }
  },
  getDonationById: async (req, res) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    try {
      const donation = await Donasi.findById(id)
        .populate("donor")
        .populate("location");
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      res.status(200).json(donation);
    } catch (error) {
      console.error("Error fetching donation:", error);
      res.status(500).json({ message: "Error fetching donation", error });
    }
  },
  createDonation: async (req, res) => {
    const { donorName, donorEmail, locationId, amount, donationDate } =
      req.body;

    if (!donorName || !donorEmail || !locationId || !amount || !donationDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      // Cari atau buat donor
      let donor = await Donor.findOne({
        $or: [{ name: donorName }, { email: donorEmail }],
      });
      if (!donor) {
        donor = new Donor({ name: donorName, email: donorEmail || undefined });
        await donor.save();
      }

      let donationImage = null;
      if (req.files && req.files.paymentProof) {
        const file = req.files.paymentProof;
        const filename = `${Date.now()}_${file.name}`;
        const dir = path.join(__dirname, "../../media/bukti");
        const uploadPath = path.join(dir, filename);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Compress and save the image using sharp
        await sharp(file.data)
          .toFormat("jpg") // Ensure same format
          .jpeg({ quality: 80 }) // Compress with 80% quality
          .toFile(uploadPath); // Save compressed image

        donationImage = `bukti/${filename}`;
      }

      // Validasi lokasi
      const location = await Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ message: "Lokasi tidak ditemukan" });
      }

      const newDonation = new Donasi({
        donor: donor._id,
        location: location._id,
        amount,
        donationDate: donationDate ? new Date(donationDate) : new Date(),
        paymentProof: donationImage,
        paymentProofHistory: donationImage
          ? [{ file: donationImage, uploadedAt: new Date() }]
          : [],
        status: "pending",
      });

      await newDonation.save();
      res.status(201).json({
        message: "Donation created successfully",
        donation: newDonation,
      });
    } catch (error) {
      console.error("Error creating donation:", error);
      res.status(500).json({ message: "Error creating donation", error });
    }
  },
  updateDonationStatus: async (req, res) => {
    const { status } = req.body; // accepted / rejected
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    try {
      const donation = await Donasi.findById(id);

      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }

      donation.status = status;
      await donation.save();

      res.status(200).json({
        message: `Donasi berhasil di-${status}`,
        donation,
      });
    } catch (error) {
      console.error("Error updating donation status :", error);
      res
        .status(500)
        .json({ message: "Error updating donation status ", error });
    }
  },
  deleteDonation: async (req, res) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    try {
      const deletedDonation = await Donasi.findByIdAndDelete(id);
      if (!deletedDonation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      res.status(200).json({ message: "Donation deleted successfully" });
    } catch (error) {
      console.error("Error deleting donation:", error);
      res.status(500).json({ message: "Error deleting donation", error });
    }
  },
  uploadPaymentProof: async (req, res) => {
    try {
      const { id } = req.params;
      const objectId = new Types.ObjectId(id);

      const donation = await Donasi.findById(objectId);
      if (!donation)
        return res.status(404).json({ message: "Donasi tidak ditemukan" });

      if (!req.files || !req.files.paymentProof) {
        return res
          .status(400)
          .json({ message: "File bukti pembayaran tidak ditemukan" });
      }
      let donationImage = null;
      const proofFile = req.files.paymentProof;
      const filename = `${Date.now()}_${proofFile.name}`;
      const dir = path.join(__dirname, "../../media/bukti");
      const uploadPath = path.join(dir, filename);

      // Create the directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Compress and save the image using sharp
      await sharp(proofFile.data)
        .toFormat("jpg") // Ensure same format
        .jpeg({ quality: 80 }) // Compress with 80% quality
        .toFile(uploadPath); // Save compressed image

      donationImage = `bukti/${filename}`;

      // Simpan riwayat
      donation.paymentProofHistory.push({
        file: donationImage,
        uploadedAt: new Date(),
      });

      donation.paymentProof = donationImage;
      donation.status = "pending"; // reset status ke pending jika re-upload
      await donation.save();

      res.json({
        message: "Bukti pembayaran berhasil diunggah ulang",
        donation,
      });
    } catch (err) {
      console.error("Error uploading payment proof:", err);
      res.status(500).json({
        message: "Gagal mengunggah bukti pembayaran",
        error: err.message,
      });
    }
  },
};
