import { Router } from "express";
import { DonorController } from "../../controller/admin/index.js";

const router = Router();
// Location Routes
router.get("/", DonorController.getAllDonors);
router.get("/:id", DonorController.getDonorById);

export default router;
