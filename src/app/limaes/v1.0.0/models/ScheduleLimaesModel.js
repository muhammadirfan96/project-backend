import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    tanggal: Date,
    equipmentlimaes_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "equipmentlimaes",
    },
    pelaksana: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userslimaes",
      },
    ],
    status: Number,
    evidence: Object,
    penilaian: Object,
    bagianlimaes_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bagianlimaes",
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const ScheduleLimaesModel = mongoose.model("schedulelimaes", schema);

export default ScheduleLimaesModel;
