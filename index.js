import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

dotenv.config();

const app = express();

// ✅ Allow both local and deployed frontend origins
const allowedOrigins = [
  "http://localhost:5173",                 // local development
  "https://patienthelpproject.netlify.app" // deployed frontend
];

// ✅ Clean & secure CORS middleware (only once)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman or server-to-server requests with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Parse JSON
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Test route
app.get("/", (_, res) => res.send("✅ Backend running with MongoDB + JWT"));

// ✅ Routes
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
