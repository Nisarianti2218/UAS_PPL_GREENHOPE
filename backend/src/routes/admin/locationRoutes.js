import { Router } from "express";
import { LocationController } from "../../controller/admin/index.js";

const router = Router();
// Location Routes
router.get("/", LocationController.getAllLocations);
router.get("/:id", LocationController.getLocationById);
router.post("/", LocationController.createLocation);
router.put("/:id", LocationController.updateLocation);
router.delete("/:id", LocationController.deleteLocation);

export default router;
