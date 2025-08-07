import { body, param, query } from "express-validator";
import ScheduleLimaesModel from "../models/ScheduleLimaesModel.js";
import runValidation from "../../../../middlewares/runValidation.js";
import UsersModel from "../../../../models/UsersModel.js";
import EquipmentLimaesModels from "../models/EquipmentLimaesModel.js";
import BagianLimaesModel from "../models/BagianLimaesModel.js";
import { existsSync } from "fs";

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
    .bail()
    // unique validation for tanggal
    .custom(async (value, { req }) => {
      try {
        const existingSchedule = await ScheduleLimaesModel.findOne({
          tanggal: value,
        });
        if (existingSchedule) {
          throw new Error("Schedule with this date already exists");
        }
      } catch (err) {
        throw new Error(err.message);
      }
      return true;
    }),
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
  body("bagianlimaes_id")
    .isMongoId()
    .withMessage("invalid bagianlimaes_id")
    .bail()
    .custom(async (value) => {
      try {
        const bagian = await BagianLimaesModel.findOne({ _id: value });
        if (!bagian) throw new Error("bagianlimaes_id not found");
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
  ...createScheduleLimaesValidation.filter((_, index) => index !== 0), // skip tanggal validation
];
const deleteScheduleLimaesValidation = [...showScheduleLimaesValidation];
const uploadEvidenceLimaesValidation = [...showScheduleLimaesValidation];
const deleteEvidenceLimaesValidation = [
  ...showScheduleLimaesValidation,
  query("filename").custom(async (value, { req }) => {
    if (!value) throw new Error("filename is required");
    // contoh filename atau value : "public/image/1754291741816-code.png"
    // (.jpg, .jpeg, .png)
    const validExtensions = [".jpg", ".jpeg", ".png"];
    const hasValidExtension = validExtensions.some((ext) =>
      value.endsWith(ext)
    );
    if (!hasValidExtension) {
      throw new Error(
        "filename must have a valid image extension (.jpg, .jpeg, .png)"
      );
    }
    // check bahwa value merupakan index dari array evidence
    const response = req.data;
    if (!response.evidence || !Array.isArray(response.evidence)) {
      throw new Error("evidence not found or not an array");
    }
    if (!response.evidence.includes(value)) {
      throw new Error("filename not found in evidence array");
    }
    // check if file exists
    if (!existsSync(value)) {
      throw new Error("file does not exist");
    }
    req.filename = value; // store filename in req for later use
    return true;
  }),
  runValidation,
];

export {
  showScheduleLimaesValidation,
  findScheduleLimaesValidation,
  createScheduleLimaesValidation,
  updateScheduleLimaesValidation,
  deleteScheduleLimaesValidation,
  uploadEvidenceLimaesValidation,
  deleteEvidenceLimaesValidation,
};
