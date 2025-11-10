import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Doctor } from "../models/Doctor.js";

/**
 * Register a new doctor
 */
export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if already registered
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // ✅ Don't hash manually — Mongoose will hash automatically
    const doctor = await Doctor.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Login doctor
 */
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found" });
    }

    // ✅ Use method defined in Doctor model
    const isMatch = await doctor.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
