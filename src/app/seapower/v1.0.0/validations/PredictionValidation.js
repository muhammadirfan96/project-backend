import { body, param, query } from "express-validator";
import PredictionModel from "../models/PredictionModel.js";
import runValidation from "../../../../middlewares/runValidation.js";

const showPredictionValidation = [
  param("id")
    .isMongoId()
    .withMessage("invalid ID")
    .bail()
    .custom(async (value, { req }) => {
      try {
        let filter = { _id: value };
        // if (req.role !== "admin") filter.createdBy = req.uid;
        const data = await PredictionModel.findOne(filter);
        if (!data) throw new Error("data not found");
        req.data = data;
      } catch (err) {
        throw new Error(err.message);
      }
      return true;
    })
    .bail({ level: "request" }),
  runValidation,
];

const findPredictionValidation = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit min: 1 and max: 100"),
  query("page").optional().isInt().withMessage("page must integer"),
  runValidation,
];

const createPredictionValidation = [
  body("summary").notEmpty().withMessage("summary is required"),
  body("recomendation").notEmpty().withMessage("recomendation is required"),
  body("status").isIn([0, 1]).withMessage("status must be 0 or 1"),
  runValidation,
];

const updatePredictionValidation = [
  ...showPredictionValidation,
  ...createPredictionValidation,
];

const deletePredictionValidation = [...showPredictionValidation];

export {
  showPredictionValidation,
  findPredictionValidation,
  createPredictionValidation,
  updatePredictionValidation,
  deletePredictionValidation,
};
