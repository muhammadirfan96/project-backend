import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    nama: String,
    atasan: String,
    bawahan: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const JabatanLimaesModels = mongoose.model("jabatanlimaes", schema);

export default JabatanLimaesModels;
