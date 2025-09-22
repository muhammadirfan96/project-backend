import { body, param, query } from "express-validator";
import ServiceRequestModel from "../models/ServiceRequestModel.js";
import runValidation from "../../../../middlewares/runValidation.js";

const showServiceRequestValidation = [
  param("id")
    .isMongoId()
    .withMessage("invalid ID")
    .bail()
    .custom(async (value, { req }) => {
      try {
        let filter = { _id: value };
        // if (req.role !== "admin") filter.createdBy = req.uid;
        const data = await ServiceRequestModel.findOne(filter);
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

const findServiceRequestValidation = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit min: 1 and max: 100"),
  query("page").optional().isInt().withMessage("page must integer"),
  runValidation,
];

const createServiceRequestValidation = [
  //must array
  // summary: [
  //     "Masalah di coarse screen A",
  //     "Masalah di coarse screen C",
  //     "Masalah di coarse screen B",
  //     "Masalah di coarse screen D"
  //   ],
  // body("summary")
  //   .isArray({ min: 4 })
  //   .withMessage("summary must be an array with minimum 4 items"),
  runValidation,
];

const updateServiceRequestValidation = [
  ...showServiceRequestValidation,
  ...createServiceRequestValidation,
];
const deleteServiceRequestValidation = [...showServiceRequestValidation];

export {
  showServiceRequestValidation,
  findServiceRequestValidation,
  createServiceRequestValidation,
  updateServiceRequestValidation,
  deleteServiceRequestValidation,
};
