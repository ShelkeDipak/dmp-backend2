import express from "express";
import jwt from "jsonwebtoken";
import { Doctor } from "../models/Doctor.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Doctor.findOne({ email });
    if (existing) return res.status(400).json({ message: "Doctor already exists" });

    const doctor = await Doctor.create({ name, email, password });
    res.json({ message: "Doctor registered", doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor || !(await doctor.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: doctor._id, email: doctor.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
