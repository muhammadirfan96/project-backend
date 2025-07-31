import { body, param, query } from "express-validator";
import ScheduleLimaesModel from "../models/ScheduleLimaesModel.js";
import runValidation from "../../../../middlewares/runValidation.js";
import UsersModel from "../../../../models/UsersModel.js";
import EquipmentLimaesModels from "../models/EquipmentLimaesModel.js";

const showScheduleLimaesValidation = [
  param("id")
    .isMongoId()
    .withMessage("invalid ID")
    .bail()
    .custom(async (value, { req }) => {
      try {
        let filter = { _id: value };
        // if (req.role !== "admin") filter.createdBy = req.uid;
        const data = await ScheduleLimaesModel.findOne(filter);
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

const findScheduleLimaesValidation = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit min: 1 and max: 100"),
  query("page").optional().isInt().withMessage("page must integer"),
  runValidation,
];

const createScheduleLimaesValidation = [
  body("tanggal")
    .isISO8601()
    .withMessage("tanggal must be a valid date")
    .bail(),
  body("equipmentlimaes_id")
    .isMongoId()
    .withMessage("invalid equipmentlimaes_id")
    .bail()
    .custom(async (value) => {
      try {
        const equipment = await EquipmentLimaesModels.findOne({ _id: value });
        if (!equipment) throw new Error("equipmentlimaes_id not found");
      } catch (err) {
        throw new Error(err.message);
      }
      return true;
    }),
  body("pelaksana").custom(async (value, { req }) => {
    try {
      if (!Array.isArray(value)) throw new Error("pelaksana must be an array");
      // buat looping isi value hanya jika value adalah array. isi looping dengan validasi apakah index array ada di database userslimaes
      for (const pelaksanaId of value) {
        const pelaksana = await UsersModel.findOne({ _id: pelaksanaId });
        if (!pelaksana) throw new Error("pelaksana not found");
      }
    } catch (err) {
      throw new Error(err.message);
    }
    return true;
  }),
  body("status")
    .notEmpty()
    .isInt({ min: 0, max: 2 })
    .withMessage("status must be an integer between 0 and 2"),
  body("evidence").custom((value) => {
    try {
      if (!Array.isArray(value)) throw new Error("evidence must be an array");
      // buat looping isi value hanya jika value adalah array. isi looping dengan validasi apakah index array adalah objek dengan key dan value
      for (const evidence of value) {
        if (
          typeof evidence !== "object" ||
          !evidence.hasOwnProperty("key") ||
          !evidence.hasOwnProperty("value")
        ) {
          throw new Error("evidence must be an object with key and value");
        }
      }
    } catch (err) {
      throw new Error(err.message);
    }
    return true;
  }),
  body("penilaian").custom((value) => {
    try {
      if (!Array.isArray(value)) throw new Error("penilaian must be an array");
      // buat looping isi value hanya jika value adalah array. isi looping dengan validasi apakah index array adalah objek dengan key dan value
      for (const penilaian of value) {
        if (
          typeof penilaian !== "object" ||
          !penilaian.hasOwnProperty("key") ||
          !penilaian.hasOwnProperty("value")
        ) {
          throw new Error("penilaian must be an object with key and value");
        }
      }
    } catch (err) {
      throw new Error(err.message);
    }
    return true;
  }),
  runValidation,
];

const updateScheduleLimaesValidation = [
  ...showScheduleLimaesValidation,
  ...createScheduleLimaesValidation,
];
const deleteScheduleLimaesValidation = [...showScheduleLimaesValidation];
const uploadEvidenceLimaesValidation = [...showScheduleLimaesValidation];
const deleteEvidenceLimaesValidation = [...showScheduleLimaesValidation];

export {
  showScheduleLimaesValidation,
  findScheduleLimaesValidation,
  createScheduleLimaesValidation,
  updateScheduleLimaesValidation,
  deleteScheduleLimaesValidation,
  uploadEvidenceLimaesValidation,
  deleteEvidenceLimaesValidation,
};
