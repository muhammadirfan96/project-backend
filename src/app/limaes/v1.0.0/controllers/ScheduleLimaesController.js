import ScheduleLimaesModel from "../models/ScheduleLimaesModel.js";
import CustomError from "../../../../utils/CustomError.js";
import { unlinkSync, unlink, existsSync } from "fs";
import { upload } from "../../../../middlewares/imageUpload.js";

const showScheduleLimaes = async (req, res, next) => {
  try {
    res.status(200).json(req.data);
  } catch (err) {
    next(err);
  }
};

const findScheduleLimaes = async (req, res, next) => {
  try {
    // Parsing query parameters
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * (page - 1);

    const tanggal = req.query.tanggal;
    const eqipmentlimaes_id = req.query.eqipmentlimaes_id;
    const bagianlimaes_id = req.query.bagianlimaes_id;
    const pelaksana = req.query.pelaksana;
    const status = req.query.status;

    const filter = {
      ...(tanggal &&
        tanggal.includes("@") && {
          tanggal: {
            $gte: tanggal.split("@")[0],
            $lte: tanggal.split("@")[1],
          },
        }),
      ...(eqipmentlimaes_id && { eqipmentlimaes_id }),
      ...(bagianlimaes_id && { bagianlimaes_id }),
      ...(Array.isArray(pelaksana) &&
        pelaksana.length > 0 && {
          pelaksana: { $in: pelaksana },
        }),
      ...(status && { status: { $regex: status, $options: "i" } }),
      // ...(req.role !== "admin" && { createdBy: req.uid }),
    };

    const order = req.query.order === "desc" ? -1 : 1;
    const sortBy = req.query.sortBy ?? "_id";
    const sort = { [sortBy]: order };

    const all_data = await ScheduleLimaesModel.countDocuments(filter);
    const data = await ScheduleLimaesModel.find(filter)
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

const createScheduleLimaes = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can create data", 403));
  try {
    const data = {
      tanggal: req.body.tanggal,
      equipmentlimaes_id: req.body.equipmentlimaes_id,
      bagianlimaes_id: req.body.bagianlimaes_id,
      pelaksana: [
        // userlimaes_id yang akan mengerjakan schedule
      ],
      status: 0,
      penilaian: [
        // { key: "kualitas", value: 0 },
        // { key: "ketepatan_waktu", value: 0 },
        // { key: "efisiensi", value: 0 },
      ],
      createdBy: req.uid,
      updatedBy: req.uid,
    };

    const newScheduleLimaes = new ScheduleLimaesModel(data);
    const savedScheduleLimaes = await newScheduleLimaes.save();

    res.status(201).json(savedScheduleLimaes);
  } catch (err) {
    next(err);
  }
};

const updateScheduleLimaes = async (req, res, next) => {
  try {
    const response = req.data;

    const data = {
      // tanggal: req.body.tanggal,
      equipmentlimaes_id: req.body.equipmentlimaes_id,
      bagianlimaes_id: req.body.bagianlimaes_id,
      pelaksana: req.body.pelaksana,
      status: req.body.status,
      penilaian: req.body.penilaian,
      // createdBy: req.uid,
      updatedBy: req.uid,
    };

    const updatedJabatanLimaes = await ScheduleLimaesModel.findByIdAndUpdate(
      response.id,
      data,
      { new: true }
    );

    res.status(200).json(updatedJabatanLimaes);
  } catch (err) {
    next(err);
  }
};

const deleteScheduleLimaes = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can delete data", 403));
  try {
    const response = req.data;

    // Hapus data dari database
    const deletedSchedule = await ScheduleLimaesModel.findByIdAndDelete(
      response.id
    );

    // Pastikan evidence berupa array dan hapus semua file yang ada
    if (Array.isArray(response.evidence)) {
      response.evidence.forEach((filePath) => {
        if (existsSync(filePath)) {
          unlinkSync(filePath);
        }
      });
    }

    res.status(200).json(deletedSchedule);
  } catch (err) {
    next(err);
  }
};

const uploadEvidenceLimaes = async (req, res, next) => {
  upload.single("evidence")(req, res, async (err) => {
    if (err) return next(new CustomError(400, err.message));

    const response = req.data;

    // Pastikan ada file yang diupload
    if (!req.file) {
      return next(new CustomError(400, "No evidence uploaded"));
    }

    const newFilePath = req.file.path;

    // Ambil array evidence lama, pastikan bentuknya array
    const oldEvidence = Array.isArray(response.evidence)
      ? response.evidence
      : [];

    const updatedEvidence = [...oldEvidence, newFilePath];

    try {
      const updated = await ScheduleLimaesModel.findByIdAndUpdate(
        response.id,
        { evidence: updatedEvidence },
        { new: true }
      );

      res.status(200).json(updated);
    } catch (e) {
      next(e);
    }
  });
};

const deleteEvidenceLimaes = async (req, res, next) => {
  try {
    const response = req.data;
    const filename = req.filename;

    // Hapus file dari sistem file
    if (existsSync(filename)) {
      unlinkSync(filename);
    }

    // Hapus filePath dari array evidence[]
    const updatedEvidence = response.evidence.filter(
      (item) => item !== filename
    );

    // Simpan kembali ke database
    const updatedSchedule = await ScheduleLimaesModel.findByIdAndUpdate(
      response.id,
      { evidence: updatedEvidence },
      { new: true }
    );
    res.status(200).json(updatedSchedule);
  } catch (err) {
    next(err);
  }
};

export {
  showScheduleLimaes,
  findScheduleLimaes,
  createScheduleLimaes,
  updateScheduleLimaes,
  deleteScheduleLimaes,
  uploadEvidenceLimaes,
  deleteEvidenceLimaes,
};
