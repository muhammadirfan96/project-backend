import express from "express";
import {
  showScheduleLimaes,
  findScheduleLimaes,
  createScheduleLimaes,
  updateScheduleLimaes,
  deleteScheduleLimaes,
  uploadEvidenceLimaes,
  deleteEvidenceLimaes,
} from "../controllers/ScheduleLimaesControllers.js";
import {
  showScheduleLimaesValidation,
  findScheduleLimaesValidation,
  createScheduleLimaesValidation,
  updateScheduleLimaesValidation,
  deleteScheduleLimaesValidation,
  uploadEvidenceLimaesValidation,
  deleteEvidenceLimaesValidation,
} from "../validations/ScheduleLimaesValidation.js";
import verifyToken from "../../../middlewares/verifyToken.js";

const ScheduleLimaesRouter = express.Router();

ScheduleLimaesRouter.get(
  "/schedule-limaes/:id",
  verifyToken,
  showScheduleLimaesValidation,
  showScheduleLimaes
);

ScheduleLimaesRouter.get(
  "/schedule-limaes",
  verifyToken,
  findScheduleLimaesValidation,
  findScheduleLimaes
);

ScheduleLimaesRouter.post(
  "/schedule-limaes",
  verifyToken,
  createScheduleLimaesValidation,
  createScheduleLimaes
);

ScheduleLimaesRouter.patch(
  "/schedule-limaes/:id",
  verifyToken,
  updateScheduleLimaesValidation,
  updateScheduleLimaes
);

ScheduleLimaesRouter.delete(
  "/schedule-limaes/:id",
  verifyToken,
  deleteScheduleLimaesValidation,
  deleteScheduleLimaes
);

ScheduleLimaesRouter.post(
  "/schedule-limaes/:id/upload-evidence",
  verifyToken,
  uploadEvidenceLimaesValidation,
  uploadEvidenceLimaes
);

ScheduleLimaesRouter.delete(
  "/schedule-limaes/:id/delete-evidence",
  verifyToken,
  deleteEvidenceLimaesValidation,
  deleteEvidenceLimaes
);

export default ScheduleLimaesRouter;
