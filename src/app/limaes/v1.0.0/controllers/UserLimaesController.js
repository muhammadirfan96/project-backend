import UserLimaesModel from "../models/UserLimaesModel.js";
import CustomError from "../../../../utils/CustomError.js";
import { unlinkSync, unlink, existsSync } from "fs";
import { upload } from "../../../../middlewares/imageUpload.js";

const showUserLimaes = async (req, res, next) => {
  try {
    res.status(200).json(req.data);
  } catch (err) {
    next(err);
  }
};

const findUserLimaes = async (req, res, next) => {
  try {
    // Parsing query parameters
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * (page - 1);

    const nip = req.query.nip;
    const fullname = req.query.fullname;
    const jabatanlimaes_id = req.query.jabatanlimaes_id;
    const bagianlimaes_id = req.query.bagianlimaes_id;

    const filter = {
      ...(nip && { nip: { $regex: nip, $options: "i" } }),
      ...(fullname && { fullname: { $regex: fullname, $options: "i" } }),
      ...(jabatanlimaes_id && { jabatanlimaes_id }),
      ...(bagianlimaes_id && { bagianlimaes_id }),
      // ...(req.role !== "admin" && { createdBy: req.uid }),
    };

    const order = req.query.order === "desc" ? -1 : 1;
    const sortBy = req.query.sortBy ?? "_id";
    const sort = { [sortBy]: order };

    const all_data = await UserLimaesModel.countDocuments(filter);
    const data = await UserLimaesModel.find(filter)
      .sort(sort)
      .skip(offset)
      .limit(limit);

    const result = {
      all_data: all_data,
      all_page: Math.ceil(all_data / limit),
      crr_page: page,
      data: data,
    };

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const createUserLimaes = async (req, res, next) => {
  try {
    const data = {
      user_id: req.uid,
      nip: req.body.nip,
      fullname: req.body.fullname,
      jabatanlimaes_id: req.body.jabatanlimaes_id,
      bagianlimaes_id: req.body.bagianlimaes_id,
      createdBy: req.uid,
      updatedBy: req.uid,
    };

    const newUserLimaes = new UserLimaesModel(data);
    const savedUserLimaes = await newUserLimaes.save();

    res.status(201).json(savedUserLimaes);
  } catch (err) {
    next(err);
  }
};

const updateUserLimaes = async (req, res, next) => {
  // validasi bahwa data yg akan di update merupakan data milik user yg sedang login
  if (req.role !== "admin" && req.data.user_id.toString() !== req.uid) {
    return next(
      new CustomError("you are not allowed to update this data", 403)
    );
  }
  try {
    const response = req.data;

    const data = {
      // user_id: req.uid,
      nip: req.body.nip,
      fullname: req.body.fullname,
      jabatanlimaes_id: req.body.jabatanlimaes_id,
      bagianlimaes_id: req.body.bagianlimaes_id,
      // createdBy: req.uid,
      updatedBy: req.uid,
    };

    const updatedUserLimaes = await UserLimaesModel.findByIdAndUpdate(
      response.id,
      data,
      { new: true }
    );

    res.status(200).json(updatedUserLimaes);
  } catch (err) {
    next(err);
  }
};

const deleteUserLimaes = async (req, res, next) => {
  // validasi bahwa hanya admin yang bisa menghapus data user
  if (req.role !== "admin") {
    return next(new CustomError("only admin can delete data", 403));
  }
  try {
    const response = req.data;

    const deletedUserLimaes = await UserLimaesModel.findByIdAndDelete(
      response.id
    );

    if (existsSync(response.ttd)) unlinkSync(response.ttd);
    if (existsSync(response.picture)) unlinkSync(response.picture);

    res.status(200).json(deletedUserLimaes);
  } catch (err) {
    next(err);
  }
};

const uploadPicture = async (req, res, next) => {
  // validasi bahwa hanya user yang bisa mengupload picture miliknya
  if (req.role !== "admin" && req.data.user_id.toString() !== req.uid) {
    return next(new CustomError("you are not allowed to upload picture", 403));
  }

  upload.single("picture")(req, res, (err) => {
    if (err) return next(new CustomError(400, err.message));

    if (!req.file) return next(new CustomError(400, "No picture uploaded"));

    const response = req.data;
    if (existsSync(response.picture))
      unlink(response.picture, (err) => {
        if (err) return next(new CustomError(500, err.message));
      });

    UserLimaesModel.findByIdAndUpdate(
      req.data.id,
      {
        picture: req.file.path,
      },
      { new: true }
    )
      .then((result) => res.status(200).json(result))
      .catch((e) => next(e));
  });
};

const uploadTtd = async (req, res, next) => {
  // validasi bahwa hanya user yang bisa mengupload ttd miliknya
  if (req.role !== "admin" && req.data.user_id.toString() !== req.uid) {
    return next(new CustomError("you are not allowed to upload ttd", 403));
  }

  upload.single("ttd")(req, res, (err) => {
    if (err) return next(new CustomError(400, err.message));

    if (!req.file) return next(new CustomError(400, "No ttd uploaded"));

    const response = req.data;
    if (existsSync(response.ttd))
      unlink(response.ttd, (err) => {
        if (err) return next(new CustomError(500, err.message));
      });

    UserLimaesModel.findByIdAndUpdate(
      req.data.id,
      {
        ttd: req.file.path,
      },
      { new: true }
    )
      .then((result) => res.status(200).json(result))
      .catch((e) => next(e));
  });
};

export {
  showUserLimaes,
  findUserLimaes,
  createUserLimaes,
  updateUserLimaes,
  deleteUserLimaes,
  uploadPicture,
  uploadTtd,
};
