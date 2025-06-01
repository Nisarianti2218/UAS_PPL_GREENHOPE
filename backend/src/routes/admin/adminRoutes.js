import { Router } from "express";
import { Auth } from "../../controller/admin/index.js";

const router = Router();
// Admin Routes
router.get("/me", Auth.me);
router.post("/login", Auth.login);
router.post("/logout", Auth.logout);
router.post("/forgot-password", Auth.forgotPassword);
router.post("/reset-password/:token", Auth.resetPassword);

export default router;
