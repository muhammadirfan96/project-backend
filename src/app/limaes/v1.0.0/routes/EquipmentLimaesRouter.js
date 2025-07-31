import express from "express";
import {
  showEquipmentLimaes,
  findEquipmentLimaes,
  createEquipmentLimaes,
  updateEquipmentLimaes,
  deleteEquipmentLimaes,
} from "../controllers/EquipmentLimaesControllers.js";
import {
  showEquipmentLimaesValidation,
  findEquipmentLimaesValidation,
  createEquipmentLimaesValidation,
  updateEquipmentLimaesValidation,
  deleteEquipmentLimaesValidation,
} from "../validations/EquipmentLimaesValidation.js";
import verifyToken from "../../../middlewares/verifyToken.js";

const EquipmentLimaesRouter = express.Router();

EquipmentLimaesRouter.get(
  "/equipment-limaes/:id",
  verifyToken,
  showEquipmentLimaesValidation,
  showEquipmentLimaes
);

EquipmentLimaesRouter.get(
  "/equipment-limaes",
  verifyToken,
  findEquipmentLimaesValidation,
  findEquipmentLimaes
);

EquipmentLimaesRouter.post(
  "/equipment-limaes",
  verifyToken,
  createEquipmentLimaesValidation,
  createEquipmentLimaes
);

EquipmentLimaesRouter.patch(
  "/equipment-limaes/:id",
  verifyToken,
  updateEquipmentLimaesValidation,
  updateEquipmentLimaes
);

EquipmentLimaesRouter.delete(
  "/equipment-limaes/:id",
  verifyToken,
  deleteEquipmentLimaesValidation,
  deleteEquipmentLimaes
);

export default EquipmentLimaesRouter;
