import express from "express";
import ServiceRequestRouter from "./v1.0.0/routes/ServiceRequestRouter.js";
import DetectionRouter from "./v1.0.0/routes/DetectionRouter.js";
import PredictionRouter from "./v1.0.0/routes/PredictionRouter.js";

const seapower_router = express.Router();

[ServiceRequestRouter, DetectionRouter, PredictionRouter].forEach((router) => {
  seapower_router.use("/v1.0.0", router);
});

export default seapower_router;
