import { Router } from "express";
import { StatistikController } from "../../controller/admin/index.js";

const router = Router();
// Statistik Routes
router.get("/summary", StatistikController.getSummaryStats);
router.get("/monthly", StatistikController.getMonthlyDonationStats);
router.get(
  "/distribution",
  StatistikController.getDonationDistributionByLocation
);
router.get("/donor-count", StatistikController.getTreeLocationDonorStats);

export default router;
