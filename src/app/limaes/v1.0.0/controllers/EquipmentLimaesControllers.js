import CustomError from "../../../../utils/CustomError.js";
import EquipmentLimaesModel from "../models/EquipmentLimaesModel.js";

const showEquipmentLimaes = async (req, res, next) => {
  try {
    res.status(200).json(req.data);
  } catch (err) {
    next(err);
  }
};

const findEquipmentLimaes = async (req, res, next) => {
  try {
    // Parsing query parameters
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * (page - 1);

    const nama = req.query.nama;
    const area = req.query.area;
    const status = req.query.status;

    const filter = {
      ...(nama && { nama: { $regex: nama, $options: "i" } }),
      ...(area && { area: { $regex: area, $options: "i" } }),
      ...(status && { status: { $regex: status, $options: "i" } }),
      //   ...(req.role !== "admin" && { createdBy: req.uid }),
    };

    const order = req.query.order === "desc" ? -1 : 1;
    const sortBy = req.query.sortBy ?? "_id";
    const sort = { [sortBy]: order };

    const all_data = await EquipmentLimaesModel.countDocuments(filter);
    const data = await EquipmentLimaesModel.find(filter)
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

const createEquipmentLimaes = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can create data", 403));
  try {
    const data = {
      nama: req.body.nama,
      area: req.body.area,
      status: req.body.status || 1,
      createdBy: req.uid,
      updatedBy: req.uid,
    };

    const newEquipmentLimaes = new EquipmentLimaesModel(data);
    const savedEquipmentLimaes = await newEquipmentLimaes.save();

    res.status(201).json(savedEquipmentLimaes);
  } catch (err) {
    next(err);
  }
};

const updateEquipmentLimaes = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can update data", 403));
  try {
    const response = req.data;

    const data = {
      nama: req.body.nama,
      area: req.body.area,
      status: req.body.status || 1,
      //   createdBy: req.uid,
      updatedBy: req.uid,
    };

    const updatedEquipmentLimaes = await EquipmentLimaesModel.findByIdAndUpdate(
      response.id,
      data,
      { new: true }
    );

    res.status(200).json(updatedEquipmentLimaes);
  } catch (err) {
    next(err);
  }
};

const deleteEquipmentLimaes = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can delete data", 403));
  try {
    const response = req.data;

    const deletedEquipmentLimaes = await EquipmentLimaesModel.findByIdAndDelete(
      response.id
    );

    res.status(200).json(deletedEquipmentLimaes);
  } catch (err) {
    next(err);
  }
};

export {
  showEquipmentLimaes,
  findEquipmentLimaes,
  createEquipmentLimaes,
  updateEquipmentLimaes,
  deleteEquipmentLimaes,
};
