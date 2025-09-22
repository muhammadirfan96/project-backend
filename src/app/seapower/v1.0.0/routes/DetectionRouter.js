import express from "express";
import {
  findDetection,
  showDetection,
  updateDetection,
  deleteDetection,
} from "../controllers/DetectionController.js";

import {
  showDetectionValidation,
  findDetectionValidation,
  createDetectionValidation,
  updateDetectionValidation,
  deleteDetectionValidation,
} from "../validations/DetectionValidation.js";

import verifyToken from "../../../../middlewares/verifyToken.js";

const DetectionRouter = express.Router();

DetectionRouter.get(
  "/detection",
  verifyToken,
  findDetectionValidation,
  findDetection
);

DetectionRouter.get(
  "/detection/:id",
  verifyToken,
  showDetectionValidation,
  showDetection
);

DetectionRouter.delete(
  "/detection/:id",
  verifyToken,
  deleteDetectionValidation,
  deleteDetection
);

DetectionRouter.patch(
  "/detection/:id",
  verifyToken,
  updateDetectionValidation,
  updateDetection
);

export default DetectionRouter;
