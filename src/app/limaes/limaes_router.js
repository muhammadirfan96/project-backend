import express from "express";
import EquipmentLimaesRouter from "./v1.0.0/routes/EquipmentLimaesRouter.js";
import JabatanLimaesRouter from "./v1.0.0/routes/JabatanLimaesRouter.js";
import ScheduleLimaesRouter from "./v1.0.0/routes/ScheduleLimaesRouter.js";
import UserLimaesRouter from "./v1.0.0/routes/UserLimaesRouter.js";

const limaes_router = express.Router();

[
  EquipmentLimaesRouter,
  JabatanLimaesRouter,
  ScheduleLimaesRouter,
  UserLimaesRouter,
].forEach((router) => {
  limaes_router.use("/v1.0.0", router);
});

export default limaes_router;
