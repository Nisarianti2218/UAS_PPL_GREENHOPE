import { Donasi, Donor } from "../../models/index.js";
import { Types } from "mongoose";

export const DonorController = {
  getAllDonors: async (req, res) => {
    try {
      const donors = await Donor.find().sort({ createdAt: -1 });
      res.json(donors);
    } catch (error) {
      console.error("Error fetching donors:", error);
      res.status(500).json({ message: "Error fetching donors", error });
    }
  },
  getDonorById: async (req, res) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid donor ID" });
    }

    try {
      const donor = await Donor.findById(id);
      if (!donor) {
        return res.status(404).json({ message: "Donor not found" });
      }
      res.json(donor);
    } catch (error) {
      console.error("Error fetching donor by ID:", error);
      res.status(500).json({ message: "Error fetching donor", error });
    }
  },
};
