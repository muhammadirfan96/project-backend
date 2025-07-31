import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    nama: String,
    area: String,
    status: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const EquipmentLimaesModels = mongoose.model("equipmentlimaes", schema);

export default EquipmentLimaesModels;
