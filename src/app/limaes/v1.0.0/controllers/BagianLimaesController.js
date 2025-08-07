import BagianLimaesModel from "../models/BagianLimaesModel.js";

const showBagianLimaes = async (req, res, next) => {
  try {
    res.status(200).json(req.data);
  } catch (err) {
    next(err);
  }
};

const findBagianLimaes = async (req, res, next) => {
  try {
    // Parsing query parameters
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * (page - 1);

    const nama = req.query.nama;

    const filter = {
      ...(nama && { nama: { $regex: nama, $options: "i" } }),
      // ...(req.role !== "admin" && { createdBy: req.uid }),
    };

    const order = req.query.order === "desc" ? -1 : 1;
    const sortBy = req.query.sortBy ?? "_id";
    const sort = { [sortBy]: order };

    const all_data = await BagianLimaesModel.countDocuments(filter);
    const data = await BagianLimaesModel.find(filter)
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

const createBagianLimaes = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can create data", 403));
  try {
    const data = {
      nama: req.body.nama,
      createdBy: req.uid,
      updatedBy: req.uid,
    };

    const newBagianLimaes = new BagianLimaesModel(data);
    const savedBagianLimaes = await newBagianLimaes.save();

    res.status(201).json(savedBagianLimaes);
  } catch (err) {
    next(err);
  }
};

const updateBagianLimaes = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can update data", 403));
  try {
    const response = req.data;

    const data = {
      nama: req.body.nama,
      // createdBy: req.uid,
      updatedBy: req.uid,
    };

    const updatedBagianLimaes = await BagianLimaesModel.findByIdAndUpdate(
      response.id,
      data,
      { new: true }
    );

    res.status(200).json(updatedBagianLimaes);
  } catch (err) {
    next(err);
  }
};

const deleteBagianLimaes = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can delete data", 403));
  try {
    const response = req.data;

    const deletedBagianLimaes = await BagianLimaesModel.findByIdAndDelete(
      response.id
    );

    res.status(200).json(deletedBagianLimaes);
  } catch (err) {
    next(err);
  }
};

export {
  showBagianLimaes,
  findBagianLimaes,
  createBagianLimaes,
  updateBagianLimaes,
  deleteBagianLimaes,
};
