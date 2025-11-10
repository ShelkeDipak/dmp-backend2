import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

dotenv.config();

const app = express();

// 🧩 Middleware
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "*" }));
app.use(express.json());

// 🧩 Database Connection
connectDB();

// 🧩 Root Test Route
app.get("/", (_, res) => res.send("✅ Backend running with MongoDB + JWT"));

// 🧩 Main Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);

// 🧩 Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
