import express from "express";
import EquipmentLimaesRouter from "./v1.0.0/routes/EquipmentLimaesRouter.js";
import JabatanLimaesRouter from "./v1.0.0/routes/JabatanLimaesRouter.js";
import ScheduleLimaesRouter from "./v1.0.0/routes/ScheduleLimaesRouter.js";
import UserLimaesRouter from "./v1.0.0/routes/UserLimaesRouter.js";
import BagianLimaesRouter from "./v1.0.0/routes/BagianLimaesRouter.js";

const limaes_router = express.Router();

[
  EquipmentLimaesRouter,
  JabatanLimaesRouter,
  ScheduleLimaesRouter,
  UserLimaesRouter,
  BagianLimaesRouter,
].forEach((router) => {
  limaes_router.use("/v1.0.0", router);
});

export default limaes_router;
