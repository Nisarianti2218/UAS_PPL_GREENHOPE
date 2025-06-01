import { Router } from "express";
import { ReportController } from "../../controller/admin/index.js";

const router = Router();
// Report Routes
router.get("/", ReportController.getAllReports);
router.get("/location/:locationId", ReportController.getReportsByLocation);
router.post("/", ReportController.createReport);
router.delete("/:id", ReportController.deleteReport);

export default router;
