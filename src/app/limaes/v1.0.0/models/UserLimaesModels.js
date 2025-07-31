import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    nip: String,
    fullname: String,
    ttd: String,
    picture: String,
    jabatanlimaes_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jabatanlimaes",
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const UserLimaesModels = mongoose.model("userlimaes", schema);

export default UserLimaesModels;
