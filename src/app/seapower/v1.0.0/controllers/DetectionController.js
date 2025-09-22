import ffmpeg from "fluent-ffmpeg";
import axios from "axios";
import fs from "fs";
import path from "path";
import DetectionModel from "../models/DetectionModel.js";
import { rtspUrl, visionServiceUrl } from "../../../../config/vision.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const snapshotDir = path.join(__dirname, "..", "snapshots");

// Buat folder snapshots jika belum ada
if (!fs.existsSync(snapshotDir)) {
  fs.mkdirSync(snapshotDir);
}

// Fungsi untuk mengambil snapshot dan mengirimkannya untuk deteksi
const captureAndDetect = async () => {
  const timestamp = new Date().getTime();
  const filename = `snapshot-${timestamp}.jpg`;
  const snapshotPath = path.join(snapshotDir, filename);

  try {
    const waktuSkip = new Date(Date.now() - 1 * 60 * 60 * 1000);
    const dataTerbaru = await DetectionModel.find({
      timestamp: { $gte: waktuSkip },
    });

    if (dataTerbaru.length > 0)
      // return next(new Error("data with timestamp > 1 hours ago exists"));
      throw new Error("data with timestamp > 1 hours ago exists");

    // Ambil snapshot dari aliran RTSP
    await new Promise((resolve, reject) => {
      ffmpeg(rtspUrl)
        .inputOptions("-rtsp_transport", "tcp")
        .on("end", () => resolve())
        .on("error", (err) => reject(new Error(`FFmpeg error: ${err.message}`)))
        .screenshots({
          timestamps: ["00:00:01"],
          filename: filename,
          folder: snapshotDir,
          size: "640x480",
        });
    });

    console.log(`✅ Snapshot saved: ${snapshotPath}`);

    // Baca file gambar dan ubah ke base64
    const imageData = fs.readFileSync(snapshotPath);
    const base64Image = imageData.toString("base64");

    // Kirim gambar ke layanan Python
    const response = await axios.post(visionServiceUrl, { image: base64Image });
    const { detections } = response.data;

    if (detections && detections.length > 0) {
      console.log(`✨ Detections found: ${detections.length} objects.`);
      for (const det of detections) {
        const newDetection = new DetectionModel({
          biota_type: det.class_name,
          confidence: det.confidence,
          recomendation: det.recomendation,
          image_path: snapshotPath,
          status: 0,
        });
        await newDetection.save();
        console.log(
          `💾 Saved to DB: ${
            det.class_name
          } with confidence ${det.confidence.toFixed(2)}`
        );
      }
    } else {
      console.log("❌ No biota detected.");
      // Hapus gambar jika tidak ada deteksi
      fs.unlinkSync(snapshotPath);
    }
  } catch (error) {
    console.error(`🔴 An error occurred: ${error.message}`);
    if (fs.existsSync(snapshotPath)) {
      fs.unlinkSync(snapshotPath);
    }
  }
};

// Fungsi untuk memulai proses deteksi secara berkala
const startCaptureAndDetect = () => {
  // Jalankan program setiap 5 detik
  setInterval(captureAndDetect, 5000);
};

// Fungsi controller untuk mendapatkan semua data deteksi
const findDetection = async (req, res, next) => {
  try {
    // Parsing query parameters
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * (page - 1);

    const biota_type = req.query.biota_type;
    const confidence = req.query.confidence;
    // const recomendation = req.query.recomendation;
    const timestamp = req.query.timestamp;

    const filter = {
      ...(biota_type && {
        biota_type: { $regex: biota_type, $options: "i" },
      }),
      ...(confidence && { confidence: { $regex: confidence, $options: "i" } }),
      // ...(recomendation && {
      //   recomendation: { $regex: recomendation, $options: "i" },
      // }),
      ...(timestamp &&
        timestamp.includes("@") && {
          timestamp: {
            $gte: timestamp.split("@")[0],
            $lte: timestamp.split("@")[1],
          },
        }),
    };

    const order = req.query.order === "desc" ? -1 : 1;
    const sortBy = req.query.sortBy ?? "_id";
    const sort = { [sortBy]: order };

    const all_data = await DetectionModel.countDocuments(filter);
    const data = await DetectionModel.find(filter)
      .sort(sort)
      .skip(offset)
      .limit(limit);

    const result = {
      all_data: all_data,
      all_page: Math.ceil(all_data / limit),
      crr_page: page,
      data: data,
    };

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const showDetection = async (req, res, next) => {
  try {
    res.status(200).json(req.data);
  } catch (err) {
    next(err);
  }
};

const updateDetection = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can update data", 403));
  try {
    const response = req.data;
    const data = {
      recomendation: req.body.recomendation,
      status: req.body.status,
    };
    const updatedDetection = await DetectionModel.findByIdAndUpdate(
      response.id,
      data,
      { new: true }
    );
    res.status(200).json(updatedDetection);
  } catch (err) {
    next(err);
  }
};

const deleteDetection = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can delete data", 403));
  try {
    const response = req.data;

    const deletedDetection = await DetectionModel.findByIdAndDelete(
      response.id
    );

    res.status(200).json(deletedDetection);
  } catch (err) {
    next(err);
  }
};

export {
  startCaptureAndDetect,
  findDetection,
  showDetection,
  deleteDetection,
  updateDetection,
};
