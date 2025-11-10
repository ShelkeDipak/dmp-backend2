import express from "express";
import { registerPatient, loginPatient } from "../controllers/patientController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Public routes
router.post("/register", registerPatient);
router.post("/login", loginPatient);

// 🔹 Example protected route (optional)
router.get("/profile", protect, (req, res) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json({ message: "Welcome Patient!", user: req.user });
});

export default router;
