import express from "express";
import {
  showPrediction,
  findPrediction,
  createPrediction,
  updatePrediction,
  deletePrediction,
} from "../controllers/PredictionController.js";
import {
  showPredictionValidation,
  findPredictionValidation,
  createPredictionValidation,
  updatePredictionValidation,
  deletePredictionValidation,
} from "../validations/PredictionValidation.js";
import verifyToken from "../../../../middlewares/verifyToken.js";

const PredictionRouter = express.Router();

PredictionRouter.get(
  "/prediction/:id",
  verifyToken,
  showPredictionValidation,
  showPrediction
);

PredictionRouter.get(
  "/prediction",
  verifyToken,
  findPredictionValidation,
  findPrediction
);

PredictionRouter.post(
  "/prediction",
  // verifyToken,
  createPredictionValidation,
  createPrediction
);

PredictionRouter.patch(
  "/prediction/:id",
  verifyToken,
  updatePredictionValidation,
  updatePrediction
);

PredictionRouter.delete(
  "/prediction/:id",
  verifyToken,
  deletePredictionValidation,
  deletePrediction
);

export default PredictionRouter;
