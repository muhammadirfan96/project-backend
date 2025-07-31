import { body, param, query } from "express-validator";
import UserLimaesModel from "../models/UserLimaesModel.js";
import runValidation from "../../../../middlewares/runValidation.js";
import UsersModel from "../../../../models/UsersModel.js";
import JabatanLimaesModel from "../models/JabatanLimaesModel.js";

const showUserLimaesValidation = [
  param("id")
    .isMongoId()
    .withMessage("invalid ID")
    .bail()
    .custom(async (value, { req }) => {
      try {
        let filter = { _id: value };
        // if (req.role !== "admin") filter.createdBy = req.uid;
        const data = await UserLimaesModel.findOne(filter);
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

const findUserLimaesValidation = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit min: 1 and max: 100"),
  query("page").optional().isInt().withMessage("page must integer"),
  runValidation,
];

const createUserLimaesValidation = [
  body("user_id")
    .isMongoId()
    .withMessage("invalid ID")
    .bail()
    .custom(async (value) => {
      try {
        const user = await UsersModel.findOne({
          _id: value,
        });
        if (!user) throw new Error("user_id not found");
      } catch (err) {
        throw new Error(err.message);
      }
      return true;
    }),
  body("nip")
    .trim()
    .notEmpty()
    .withMessage("nip required")
    .bail()
    .isString()
    .withMessage("nip must be a string")
    .isLength({ min: 3, max: 15 })
    .withMessage("nip must be between 3 and 15 characters"),
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("fullname required")
    .bail()
    .isString()
    .withMessage("fullname must be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("fullname must be between 3 and 50 characters"),
  body("jabatanlimaes_id")
    .isMongoId()
    .withMessage("invalid ID")
    .bail()
    .custom(async (value) => {
      try {
        const jabatanlimaes = await JabatanLimaesModel.findOne({
          _id: value,
        });
        if (!jabatanlimaes) throw new Error("jabatanlimaes_id not found");
      } catch (err) {
        throw new Error(err.message);
      }
      return true;
    }),
  runValidation,
];

const updateUserLimaesValidation = [
  ...showUserLimaesValidation,
  ...createUserLimaesValidation,
];
const deleteUserLimaesValidation = [...showUserLimaesValidation];
const uploadPictureValidation = [...showUserLimaesValidation];
const uploadTtdValidation = [...showUserLimaesValidation];

export {
  showUserLimaesValidation,
  findUserLimaesValidation,
  createUserLimaesValidation,
  updateUserLimaesValidation,
  deleteUserLimaesValidation,
  uploadPictureValidation,
  uploadTtdValidation,
};
