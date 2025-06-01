import { Donor, Donasi, Location, Report } from "../../models/index.js";
import mongoose from "mongoose";

export const StatistikController = {
  // 1. Summary Statistik
  getSummaryStats: async (req, res) => {
    try {
      const [
        totalUsers,
        totalDonations,
        totalLocations,
        totalReports,
        totalDonationAmount,
      ] = await Promise.all([
        Donor.countDocuments(),
        Donasi.countDocuments(),
        Location.countDocuments(),
        Report.countDocuments(),
        Donasi.aggregate([
          { $match: { status: "accepted" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]);

      res.json({
        totalUsers,
        totalDonations: totalDonationAmount[0]?.total || 0,
        totalLocations,
        totalReports,
      });
    } catch (err) {
      console.error("Error fetching summary statistics:", err);
      res.status(500).json({
        message: "Gagal mengambil ringkasan statistik",
        error: err.message,
      });
    }
  },

  // 2. Statistik Donasi per Bulan (Grafik Garis)
  getMonthlyDonationStats: async (req, res) => {
    try {
      const monthlyStats = await Donasi.aggregate([
        {
          $match: { status: "accepted" },
        },
        {
          $group: {
            _id: { $month: "$donationDate" },
            total: { $sum: "$amount" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      res.json(monthlyStats);
    } catch (err) {
      console.error("Error fetching monthly donation statistics:", err);
      res.status(500).json({
        message: "Gagal mengambil statistik donasi bulanan",
        error: err.message,
      });
    }
  },

  // 3. Distribusi Donasi per Lokasi (Pie/Bar Chart)
  getDonationDistributionByLocation: async (req, res) => {
    try {
      const stats = await Donasi.aggregate([
        {
          $match: { status: "accepted" },
        },
        {
          $group: {
            _id: "$location",
            total: { $sum: "$amount" },
          },
        },
        {
          $lookup: {
            from: "locations",
            localField: "_id",
            foreignField: "_id",
            as: "locationData",
          },
        },
        {
          $unwind: "$locationData",
        },
        {
          $project: {
            _id: 0,
            location: "$locationData.name",
            total: "$total",
          },
        },
        {
          $sort: { total: -1 },
        },
      ]);

      res.json(stats);
    } catch (err) {
      console.error("Error fetching donation distribution by location:", err);
      res.status(500).json({
        message: "Gagal mengambil distribusi donasi",
        error: err.message,
      });
    }
  },
  // 4. Statistik Pohon, Lokasi Aktif, dan Donatur
  getTreeLocationDonorStats: async (req, res) => {
    try {
      const [totalTreesAccepted, totalActiveLocations, totalDonors] =
        await Promise.all([
          Donasi.aggregate([
            { $match: { status: "accepted" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ]),
          Location.countDocuments({ status: "aktif" }),
          Donor.countDocuments(),
        ]);

      res.json({
        totalTreesAccepted: totalTreesAccepted[0]?.total || 0,
        totalActiveLocations,
        totalDonors,
      });
    } catch (err) {
      console.error("Error fetching tree/location/donor stats:", err);
      res.status(500).json({
        message: "Gagal mengambil statistik pohon, lokasi aktif, dan donatur",
        error: err.message,
      });
    }
  },
};
