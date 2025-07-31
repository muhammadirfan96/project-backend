import express from "express";
import {
  showUserLimaes,
  findUserLimaes,
  createUserLimaes,
  updateUserLimaes,
  deleteUserLimaes,
  uploadPicture,
  uploadTtd,
} from "../controllers/UserLimaesController.js";
import {
  showUserLimaesValidation,
  findUserLimaesValidation,
  createUserLimaesValidation,
  updateUserLimaesValidation,
  deleteUserLimaesValidation,
  uploadPictureValidation,
  uploadTtdValidation,
} from "../validations/UserLimaesValidation.js";
import verifyToken from "../../../../middlewares/verifyToken.js";

const UserLimaesRouter = express.Router();

UserLimaesRouter.get(
  "/user-limaes/:id",
  verifyToken,
  showUserLimaesValidation,
  showUserLimaes
);

UserLimaesRouter.get(
  "/user-limaes",
  verifyToken,
  findUserLimaesValidation,
  findUserLimaes
);

UserLimaesRouter.post(
  "/user-limaes",
  verifyToken,
  createUserLimaesValidation,
  createUserLimaes
);

UserLimaesRouter.patch(
  "/user-limaes/:id",
  verifyToken,
  updateUserLimaesValidation,
  updateUserLimaes
);

UserLimaesRouter.delete(
  "/user-limaes/:id",
  verifyToken,
  deleteUserLimaesValidation,
  deleteUserLimaes
);

UserLimaesRouter.post(
  "/user-limaes/:id/upload-picture",
  verifyToken,
  uploadPictureValidation,
  uploadPicture
);

UserLimaesRouter.post(
  "/user-limaes/:id/upload-ttd",
  verifyToken,
  uploadTtdValidation,
  uploadTtd
);

export default UserLimaesRouter;
