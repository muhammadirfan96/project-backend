import express from "express";
import {
  showBagianLimaes,
  findBagianLimaes,
  createBagianLimaes,
  updateBagianLimaes,
  deleteBagianLimaes,
} from "../controllers/BagianLimaesController.js";
import {
  showBagianLimaesValidation,
  findBagianLimaesValidation,
  createBagianLimaesValidation,
  updateBagianLimaesValidation,
  deleteBagianLimaesValidation,
} from "../validations/BagianLimaesValidation.js";
import verifyToken from "../../../../middlewares/verifyToken.js";

const BagianLimaesRouter = express.Router();

BagianLimaesRouter.get(
  "/bagian-limaes/:id",
  verifyToken,
  showBagianLimaesValidation,
  showBagianLimaes
);

BagianLimaesRouter.get(
  "/bagian-limaes",
  verifyToken,
  findBagianLimaesValidation,
  findBagianLimaes
);

BagianLimaesRouter.post(
  "/bagian-limaes",
  verifyToken,
  createBagianLimaesValidation,
  createBagianLimaes
);

BagianLimaesRouter.patch(
  "/bagian-limaes/:id",
  verifyToken,
  updateBagianLimaesValidation,
  updateBagianLimaes
);

BagianLimaesRouter.delete(
  "/bagian-limaes/:id",
  verifyToken,
  deleteBagianLimaesValidation,
  deleteBagianLimaes
);

export default BagianLimaesRouter;
