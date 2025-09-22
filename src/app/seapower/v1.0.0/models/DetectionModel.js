import mongoose from "mongoose";

const DetectionSchema = new mongoose.Schema(
  {
    biota_type: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
    recomendation: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    image_path: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  { timestamps: true }
);

const Detection = mongoose.model("detection", DetectionSchema);

export default Detection;
