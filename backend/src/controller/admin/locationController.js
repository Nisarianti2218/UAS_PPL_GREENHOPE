import { get } from "http";
import { Location } from "../../models/index.js";
import { Types } from "mongoose";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { fileURLToPath } from "url";

// Konversi __filename dan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const LocationController = {
  // Get all locations
  getAllLocations: async (req, res) => {
    try {
      const locations = await Location.find();
      res.status(200).json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ message: "Error fetching locations", error });
    }
  },

  // Get location by ID
  getLocationById: async (req, res) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid location ID" });
    }

    try {
      const location = await Location.findById(id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.status(200).json(location);
    } catch (error) {
      console.error("Error fetching detail location:", error);
      res.status(500).json({ message: "Error fetching location", error });
    }
  },

  // Create a new location
  createLocation: async (req, res) => {
    try {
      const { name, address, description, status } = req.body;
      if (!name || !description || !address || !status) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (req.files && req.files.image) {
        const image = req.files.image;
        const fileExtension = path.extname(image.name);

        // Define the directory and file path
        const filename = name.replace(/\s+/g, "_").toLowerCase();
        const dir = path.join(__dirname, "../../media/lokasi");
        const filePath = path.join(dir, `${filename}${fileExtension}`);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Compress and save the image using sharp
        await sharp(image.data)
          .toFormat("jpg") // Ensure same format
          .jpeg({ quality: 80 }) // Compress with 80% quality
          .toFile(filePath); // Save compressed image

        const imageName = `lokasi/${filename}${fileExtension}`;

        const newLocation = new Location({
          name,
          address,
          description,
          image: imageName, // kamu bisa atur path upload di middleware
          status: status || "aktif",
        });

        await newLocation.save();
        res.status(201).json(newLocation);
      } else {
        const newLocation = new Location({
          name,
          address,
          description,
          status: status || "aktif",
        });

        await newLocation.save();
        res.status(201).json(newLocation);
      }
    } catch (error) {
      console.error("Error creating location:", error);
      res.status(500).json({ message: "Error creating location", error });
    }
  },

  // Update location by ID
  updateLocation: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, address, description, status } = req.body;
      const updatedData = { name, address, description, status };

      // Ambil data lokasi lama untuk cek dan hapus gambar lama jika ada
      const oldLocation = await Location.findById(id);
      if (!oldLocation) {
        return res.status(404).json({ message: "Lokasi tidak ditemukan" });
      }

      // Jika ada gambar baru dan gambar lama ada, hapus file gambar lama
      let imageName = null;
      if (req.files && req.files.image) {
        const oldImagePath = path.join(
          __dirname,
          "../../media",
          oldLocation.image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        const image = req.files.image;
        const fileExtension = path.extname(image.name);

        // Define the directory and file path
        const filename = name.replace(/\s+/g, "_").toLowerCase();
        const dir = path.join(__dirname, "../../media/lokasi");
        const filePath = path.join(dir, `${filename}${fileExtension}`);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Compress and save the image using sharp
        await sharp(image.data)
          .toFormat("jpg") // Ensure same format
          .jpeg({ quality: 80 }) // Compress with 80% quality
          .toFile(filePath); // Save compressed image

        imageName = `lokasi/${filename}${fileExtension}`;
      }
      if (imageName) {
        updatedData.image = imageName;
      }

      const location = await Location.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!location)
        return res.status(404).json({ message: "Lokasi tidak ditemukan" });
      res.status(200).json(location);
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ message: "Error updating location", error });
    }
  },

  // Delete location by ID
  deleteLocation: async (req, res) => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid location ID" });
      }

      const location = await Location.findByIdAndDelete(id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
      console.error("Error deleting location:", error);
      res.status(500).json({ message: "Error deleting location", error });
    }
  },
};
