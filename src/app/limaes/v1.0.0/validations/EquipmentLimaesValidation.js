import { body, param, query } from "express-validator";
import EquipmentLimaesModel from "../models/EquipmentLimaesModel.js";
import runValidation from "../../../../middlewares/runValidation.js";

const showEquipmentLimaesValidation = [
  param("id")
    .isMongoId()
    .withMessage("invalid ID")
    .bail()
    .custom(async (value, { req }) => {
      try {
        let filter = { _id: value };
        // if (req.role !== "admin") filter.createdBy = req.uid;
        const data = await EquipmentLimaesModel.findOne(filter);
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

const findEquipmentLimaesValidation = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit min: 1 and max: 100"),
  query("page").optional().isInt().withMessage("page must integer"),
  runValidation,
];

const createEquipmentLimaesValidation = [
  body("nama")
    .trim()
    .notEmpty()
    .withMessage("nama required")
    .bail()
    .isString()
    .withMessage("nama must be a string")
    .isLength({ min: 3, max: 100 })
    .withMessage("nama must be between 3 and 100 characters"),
  body("area")
    .trim()
    .notEmpty()
    .withMessage("area required")
    .bail()
    .isString()
    .withMessage("area must be a string")
    .isLength({ min: 3, max: 100 })
    .withMessage("nip must be between 3 and 100 characters"),
  body("status").notEmpty().isIn([0, 1]).withMessage("status must be 0 or 1"),
  runValidation,
];

const updateEquipmentLimaesValidation = [
  ...showEquipmentLimaesValidation,
  ...createEquipmentLimaesValidation,
];
const deleteEquipmentLimaesValidation = [...showEquipmentLimaesValidation];

export {
  showEquipmentLimaesValidation,
  findEquipmentLimaesValidation,
  createEquipmentLimaesValidation,
  updateEquipmentLimaesValidation,
  deleteEquipmentLimaesValidation,
};
