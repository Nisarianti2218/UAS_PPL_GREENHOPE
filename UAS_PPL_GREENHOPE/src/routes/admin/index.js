import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import locationRoutes from "./locationRoutes.js";
import reportRoutes from "./reportRoutes.js";
import statistikRoutes from "./statistikRoutes.js";
import donationRoutes from "./donationRoutes.js";
import donorRoutes from "./donorRoutes.js";

const router = Router();
// Admin Routes

router.use(adminRoutes);
router.use("/locations", locationRoutes);
router.use("/reports", reportRoutes);
router.use("/statistik", statistikRoutes);
router.use("/donations", donationRoutes);
router.use("/donors", donorRoutes);

export default router;
