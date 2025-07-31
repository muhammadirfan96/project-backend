import express from "express";
import {
  showJabatanLimaes,
  findJabatanLimaes,
  createJabatanLimaes,
  updateJabatanLimaes,
  deleteJabatanLimaes,
} from "../controllers/JabatanLimaesController.js";
import {
  showJabatanLimaesValidation,
  findJabatanLimaesValidation,
  createJabatanLimaesValidation,
  updateJabatanLimaesValidation,
  deleteJabatanLimaesValidation,
} from "../validations/JabatanLimaesValidation.js";
import verifyToken from "../../../../middlewares/verifyToken.js";

const JabatanLimaesRouter = express.Router();

JabatanLimaesRouter.get(
  "/jabatan-limaes/:id",
  verifyToken,
  showJabatanLimaesValidation,
  showJabatanLimaes
);

JabatanLimaesRouter.get(
  "/jabatan-limaes",
  verifyToken,
  findJabatanLimaesValidation,
  findJabatanLimaes
);

JabatanLimaesRouter.post(
  "/jabatan-limaes",
  verifyToken,
  createJabatanLimaesValidation,
  createJabatanLimaes
);

JabatanLimaesRouter.patch(
  "/jabatan-limaes/:id",
  verifyToken,
  updateJabatanLimaesValidation,
  updateJabatanLimaes
);

JabatanLimaesRouter.delete(
  "/jabatan-limaes/:id",
  verifyToken,
  deleteJabatanLimaesValidation,
  deleteJabatanLimaes
);

export default JabatanLimaesRouter;
