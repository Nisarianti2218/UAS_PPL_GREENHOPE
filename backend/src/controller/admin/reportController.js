import { Donasi, Donor, Location, Report } from "../../models/index.js";
import { Types } from "mongoose";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import { fileURLToPath } from "url";
// import { create } from "connect-mongo";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ReportController = {
  getAllReports: async (req, res) => {
    try {
      const reports = await Report.find()
        .populate("location", "name")
        .sort({ reportDate: -1 });
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Error fetching reports", error });
    }
  },
  getReportsByLocation: async (req, res) => {
    const { locationId } = req.params;

    if (!Types.ObjectId.isValid(locationId)) {
      return res.status(400).json({ message: "Invalid location ID" });
    }

    try {
      const reports = await Report.find({ location: locationId }).sort({
        reportDate: -1,
      });

      if (reports.length === 0) {
        return res
          .status(404)
          .json({ message: "No reports found for this location" });
      }

      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports by location:", error);
      res.status(500).json({ message: "Error fetching reports", error });
    }
  },

  createReport: async (req, res) => {
    const { locationId, description } = req.body;

    if (!locationId || !description) {
      return res
        .status(400)
        .json({ message: "Location ID and description are required" });
    }

    if (!Types.ObjectId.isValid(locationId)) {
      return res.status(400).json({ message: "Invalid location ID" });
    }

    if (!req.files?.photoBefore || !req.files?.photoAfter) {
      return res
        .status(400)
        .json({ message: "Foto sebelum dan sesudah wajib diunggah" });
    }

    try {
      const location = await Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ message: "Lokasi tidak ditemukan" });
      }

      const photoBeforeFile = req.files.photoBefore;
      const photoAfterFile = req.files.photoAfter;

      const filenameBefore = `before_${Date.now()}_${photoBeforeFile.name}`;
      const filenameAfter = `after_${Date.now()}_${photoAfterFile.name}`;

      const dir = path.join(__dirname, "../../media/laporan");

      const pathBefore = path.join(dir, filenameBefore);
      const pathAfter = path.join(dir, filenameAfter);

      // Create the directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Compress and save the image using sharp
      await sharp(photoBeforeFile.data)
        .toFormat("jpg") // Ensure same format
        .jpeg({ quality: 80 }) // Compress with 80% quality
        .toFile(pathBefore); // Save compressed image

      // Compress and save the image using sharp
      await sharp(photoAfterFile.data)
        .toFormat("jpg") // Ensure same format
        .jpeg({ quality: 80 }) // Compress with 80% quality
        .toFile(pathAfter); // Save compressed image

      const report = new Report({
        location: locationId,
        photoBefore: `laporan/${filenameBefore}`,
        photoAfter: `laporan/${filenameAfter}`,
        description,
        reportDate: new Date(),
      });

      await report.save();
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Error creating report", error });
    }
  },
  deleteReport: async (req, res) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    try {
      const report = await Report.findByIdAndDelete(id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      // Optionally, delete the associated files
      const pathBefore =
        __dirname + `../../media/laporan/${report.photoBefore}`;
      const pathAfter = __dirname + `../../media/laporan/${report.photoAfter}`;
      fs.unlinkSync(pathBefore);
      fs.unlinkSync(pathAfter);

      res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
      console.error("Error deleting report:", error);
      res.status(500).json({ message: "Error deleting report", error });
    }
  },
};
