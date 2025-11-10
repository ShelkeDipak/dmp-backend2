import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import googleTTS from "google-tts-api";
import ffmpeg from "fluent-ffmpeg";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post("/generate", protect, upload.array("images", 10), async (req, res) => {
  const { instructions = "", title = "Prescription", lang = "en" } = req.body;
  const images = req.files;

  if (!instructions || images.length === 0)
    return res.status(400).json({ error: "Provide instructions and at least one image" });

  const tmpDir = path.join(process.cwd(), "tmp", Date.now().toString());
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    const ttsUrl = googleTTS.getAudioUrl(instructions, { lang });
    const audioPath = path.join(tmpDir, "tts.mp3");
    const resAudio = await fetch(ttsUrl);
    const fileStream = fs.createWriteStream(audioPath);
    await new Promise((resolve, reject) => {
      resAudio.body.pipe(fileStream);
      fileStream.on("finish", resolve);
      fileStream.on("error", reject);
    });

    const videoPath = path.join(tmpDir, "output.mp4");
    const ff = ffmpeg();
    images.forEach((img) => ff.input(img.path));
    ff.addInput(audioPath)
      .outputOptions(["-c:v libx264", "-c:a aac", "-shortest"])
      .on("error", (err) => console.error("FFmpeg error:", err))
      .on("end", () => res.download(videoPath, `${title}.mp4`))
      .save(videoPath);
  } catch (err) {
    res.status(500).json({ error: "Video generation failed", details: err.message });
  }
});

export default router;
