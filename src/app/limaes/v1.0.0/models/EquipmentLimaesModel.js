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

const EquipmentLimaesModel = mongoose.model("equipmentlimaes", schema);

export default EquipmentLimaesModel;
