import express from "express";
import {
  showServiceRequest,
  findServiceRequest,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
} from "../controllers/ServiceRequestController.js";
import {
  showServiceRequestValidation,
  findServiceRequestValidation,
  createServiceRequestValidation,
  updateServiceRequestValidation,
  deleteServiceRequestValidation,
} from "../validations/ServiceRequestValidation.js";
import verifyToken from "../../../../middlewares/verifyToken.js";

const ServiceRequestRouter = express.Router();

ServiceRequestRouter.get(
  "/service-request/:id",
  verifyToken,
  showServiceRequestValidation,
  showServiceRequest
);

ServiceRequestRouter.get(
  "/service-request",
  verifyToken,
  findServiceRequestValidation,
  findServiceRequest
);

ServiceRequestRouter.post(
  "/service-request",
  // verifyToken,
  createServiceRequestValidation,
  createServiceRequest
);

ServiceRequestRouter.patch(
  "/service-request/:id",
  verifyToken,
  updateServiceRequestValidation,
  updateServiceRequest
);

ServiceRequestRouter.delete(
  "/service-request/:id",
  verifyToken,
  deleteServiceRequestValidation,
  deleteServiceRequest
);

export default ServiceRequestRouter;
