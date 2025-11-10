import express from "express";
import { registerDoctor, loginDoctor } from "../controllers/doctorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🔹 Register a new doctor
 * POST /api/doctors/register
 */
router.post("/register", registerDoctor);

/**
 * 🔹 Login a doctor
 * POST /api/doctors/login
 */
router.post("/login", loginDoctor);

/**
 * 🔹 Protected route (test only)
 * GET /api/doctors/profile
 */
router.get("/profile", protect, (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied - not a doctor" });
  }

  res.json({
    success: true,
    message: "Welcome Doctor!",
    user: req.user,
  });
});

export default router;
