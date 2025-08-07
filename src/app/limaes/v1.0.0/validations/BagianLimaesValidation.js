import { body, param, query } from "express-validator";
import BagianLimaesModel from "../models/BagianLimaesModel.js";
import runValidation from "../../../../middlewares/runValidation.js";

const showBagianLimaesValidation = [
  param("id")
    .isMongoId()
    .withMessage("invalid ID")
    .bail()
    .custom(async (value, { req }) => {
      try {
        let filter = { _id: value };
        // if (req.role !== "admin") filter.createdBy = req.uid;
        const data = await BagianLimaesModel.findOne(filter);
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

const findBagianLimaesValidation = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit min: 1 and max: 100"),
  query("page").optional().isInt().withMessage("page must integer"),
  runValidation,
];

const createBagianLimaesValidation = [
  body("nama")
    .trim()
    .notEmpty()
    .withMessage("nama required")
    .bail()
    .isString()
    .withMessage("nama must be a string")
    .isLength({ min: 3, max: 100 })
    .withMessage("nama must be between 3 and 100 characters"),
  runValidation,
];

const updateBagianLimaesValidation = [
  ...showBagianLimaesValidation,
  ...createBagianLimaesValidation,
];
const deleteBagianLimaesValidation = [...showBagianLimaesValidation];

export {
  showBagianLimaesValidation,
  findBagianLimaesValidation,
  createBagianLimaesValidation,
  updateBagianLimaesValidation,
  deleteBagianLimaesValidation,
};
