import PredictionModel from "../models/PredictionModel.js";

const createPrediction = async (req, res, next) => {
  try {
    const waktuDelapanJamLalu = new Date(Date.now() - 8 * 60 * 60 * 1000);
    const dataTerbaru = await PredictionModel.find({
      timestamp: { $gte: waktuDelapanJamLalu },
    });

    if (dataTerbaru.length > 0)
      return next(new Error("data with timestamp > 8 hours ago exists"));

    const data = {
      summary: req.body.summary,
      recomendation: req.body.recomendation,
      status: 0,
      timestamp: new Date(),
    };

    const newPrediction = new PredictionModel(data);
    const savedPrediction = await newPrediction.save();

    res.status(201).json(savedPrediction);
  } catch (err) {
    next(err);
  }
};

const updatePrediction = async (req, res, next) => {
  try {
    const response = req.data;

    const data = {
      summary: req.body.summary,
      recomendation: req.body.recomendation,
      status: req.body.status,
    };

    const updatedPrediction = await PredictionModel.findByIdAndUpdate(
      response.id,
      data,
      { new: true }
    );

    res.status(200).json(updatedPrediction);
  } catch (err) {
    next(err);
  }
};

// Fungsi controller untuk mendapatkan semua data deteksi
const findPrediction = async (req, res, next) => {
  try {
    // Parsing query parameters
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * (page - 1);

    const summary = req.query.summary;
    const recomendation = req.query.recomendation;
    const timestamp = req.query.timestamp;
    const status = req.query.status;

    const filter = {
      ...(summary && {
        summary: { $regex: summary, $options: "i" },
      }),
      ...(recomendation && {
        recomendation: { $regex: recomendation, $options: "i" },
      }),
      ...(timestamp &&
        timestamp.includes("@") && {
          timestamp: {
            $gte: timestamp.split("@")[0],
            $lte: timestamp.split("@")[1],
          },
        }),
      ...(status && {
        status: { $regex: status, $options: "i" },
      }),
    };

    const order = req.query.order === "desc" ? -1 : 1;
    const sortBy = req.query.sortBy ?? "_id";
    const sort = { [sortBy]: order };

    const all_data = await PredictionModel.countDocuments(filter);
    const data = await PredictionModel.find(filter)
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
  } catch (error) {
    next(error);
  }
};

const showPrediction = async (req, res, next) => {
  try {
    res.status(200).json(req.data);
  } catch (err) {
    next(err);
  }
};

const deletePrediction = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can delete data", 403));
  try {
    const response = req.data;

    const deletedPrediction = await PredictionModel.findByIdAndDelete(
      response.id
    );

    res.status(200).json(deletedPrediction);
  } catch (err) {
    next(err);
  }
};

export {
  createPrediction,
  updatePrediction,
  findPrediction,
  showPrediction,
  deletePrediction,
};
