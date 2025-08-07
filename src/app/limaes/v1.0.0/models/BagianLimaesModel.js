import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    nama: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const BagianLimaesModel = mongoose.model("bagianlimaes", schema);

export default BagianLimaesModel;
