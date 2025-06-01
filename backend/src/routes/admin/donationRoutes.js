import { Router } from "express";
import { DonationController } from "../../controller/admin/index.js";

const router = Router();
// Location Routes
router.get("/", DonationController.getAllDonations);
router.get("/:id", DonationController.getDonationById);
router.post("/", DonationController.createDonation);
router.put("/:id/status", DonationController.updateDonationStatus);
router.delete("/:id", DonationController.deleteDonation);
router.post("/:id/upload-proof", DonationController.uploadPaymentProof);

export default router;
