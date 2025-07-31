import JabatanLimaesModel from "../models/JabatanLimaesModel.js";

const showJabatanLimaes = async (req, res, next) => {
  try {
    res.status(200).json(req.data);
  } catch (err) {
    next(err);
  }
};

const findJabatanLimaes = async (req, res, next) => {
  try {
    // Parsing query parameters
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * (page - 1);

    const nama = req.query.nama;
    const atasan = req.query.atasan;
    const bawahan = req.query.bawahan;

    const filter = {
      ...(nama && { nama: { $regex: nama, $options: "i" } }),
      ...(atasan && { atasan: { $regex: atasan, $options: "i" } }),
      ...(bawahan && { bawahan: { $regex: bawahan, $options: "i" } }),
      // ...(req.role !== "admin" && { createdBy: req.uid }),
    };

    const order = req.query.order === "desc" ? -1 : 1;
    const sortBy = req.query.sortBy ?? "_id";
    const sort = { [sortBy]: order };

    const all_data = await JabatanLimaesModel.countDocuments(filter);
    const data = await JabatanLimaesModel.find(filter)
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

const createJabatanLimaes = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can create data", 403));
  try {
    const data = {
      nama: req.body.nama,
      atasan: req.body.atasan,
      bawahan: req.body.bawahan,
      createdBy: req.uid,
      updatedBy: req.uid,
    };

    const newJabatanLimaes = new JabatanLimaesModel(data);
    const savedJabatanLimaes = await newJabatanLimaes.save();

    res.status(201).json(savedJabatanLimaes);
  } catch (err) {
    next(err);
  }
};

const updateJabatanLimaes = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can update data", 403));
  try {
    const response = req.data;

    const data = {
      nama: req.body.nama,
      atasan: req.body.atasan,
      bawahan: req.body.bawahan,
      // createdBy: req.uid,
      updatedBy: req.uid,
    };

    const updatedJabatanLimaes = await JabatanLimaesModel.findByIdAndUpdate(
      response.id,
      data,
      { new: true }
    );

    res.status(200).json(updatedJabatanLimaes);
  } catch (err) {
    next(err);
  }
};

const deleteJabatanLimaes = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can delete data", 403));
  try {
    const response = req.data;

    const deletedJabatanLimaes = await JabatanLimaesModel.findByIdAndDelete(
      response.id
    );

    res.status(200).json(deletedJabatanLimaes);
  } catch (err) {
    next(err);
  }
};

export {
  showJabatanLimaes,
  findJabatanLimaes,
  createJabatanLimaes,
  updateJabatanLimaes,
  deleteJabatanLimaes,
};
