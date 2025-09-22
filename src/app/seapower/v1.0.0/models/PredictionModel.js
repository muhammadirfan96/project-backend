import mongoose from "mongoose";

const PredictionSchema = new mongoose.Schema(
  {
    summary: {
      type: String,
    },
    recomendation: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  { timestamps: true }
);

const Prediction = mongoose.model("prediction", PredictionSchema);

export default Prediction;
