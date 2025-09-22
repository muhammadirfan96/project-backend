import ServiceRequestModel from "../models/ServiceRequestModel.js";

const showServiceRequest = async (req, res, next) => {
  try {
    res.status(200).json(req.data);
  } catch (err) {
    next(err);
  }
};

const findServiceRequest = async (req, res, next) => {
  try {
    // Parsing query parameters
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * (page - 1);

    // service_request: Number, // auto increment
    // summary: String,
    // status: String, // fixed status ==> "NEW, QUEUED"
    // wo_number: String, // fixed wo number ==> null
    // asset_number: String, // fixed asset number ==> "SPGY-TU-20HFB32AF001"
    // equipment_rbd_num: String, // fixed equipment rbd number ==> null
    // asset_description: String, // fixed asset description ==> "COAL FEEDER 2F"
    // location: String, // fixed location ==> 290300020105
    // report_by_name: String, // fixed report by name ==> "MUHAMMAD IRFAN"
    // work_group: String, // fixed work group ==> "OPRUNIT"
    // shift: String, // fixed shift ==> "A"
    // site: String, // fixed site ==> "PY"
    // fault_priority: String, // fixed fault priority ==> "URGENT"
    // fault_type: String, // fixed fault type ==> "PDM"
    // reported_date: Date,
    // needdowntime: Boolean, // fixed needdowntime ==> null

    const service_request = req.query.service_request;
    const summary = req.query.summary;
    const status = req.query.status;
    const wo_number = req.query.wo_number;
    const asset_number = req.query.asset_number;
    const equipment_rbd_num = req.query.equipment_rbd_num;
    const asset_description = req.query.asset_description;
    const location = req.query.location;
    const report_by_name = req.query.report_by_name;
    const work_group = req.query.work_group;
    const shift = req.query.shift;
    const site = req.query.site;
    const fault_priority = req.query.fault_priority;
    const fault_type = req.query.fault_type;
    const reported_date = req.query.reported_date;
    const needdowntime = req.query.needdowntime;

    const filter = {
      ...(service_request && {
        service_request: { $regex: service_request, $options: "i" },
      }),
      ...(summary && { summary: { $regex: summary, $options: "i" } }),
      ...(status && { status: { $regex: status, $options: "i" } }),
      ...(wo_number && { wo_number: { $regex: wo_number, $options: "i" } }),
      ...(asset_number && {
        asset_number: { $regex: asset_number, $options: "i" },
      }),
      ...(equipment_rbd_num && {
        equipment_rbd_num: { $regex: equipment_rbd_num, $options: "i" },
      }),
      ...(asset_description && {
        asset_description: { $regex: asset_description, $options: "i" },
      }),
      ...(location && { location: { $regex: location, $options: "i" } }),
      ...(report_by_name && {
        report_by_name: { $regex: report_by_name, $options: "i" },
      }),
      ...(work_group && { work_group: { $regex: work_group, $options: "i" } }),
      ...(shift && { shift: { $regex: shift, $options: "i" } }),
      ...(site && { site: { $regex: site, $options: "i" } }),
      ...(fault_priority && {
        fault_priority: { $regex: fault_priority, $options: "i" },
      }),
      ...(fault_type && { fault_type: { $regex: fault_type, $options: "i" } }),
      ...(needdowntime && { needdowntime: needdowntime === "true" }),
      ...(reported_date &&
        reported_date.includes("@") && {
          reported_date: {
            $gte: reported_date.split("@")[0],
            $lte: reported_date.split("@")[1],
          },
        }),
    };

    const order = req.query.order === "desc" ? -1 : 1;
    const sortBy = req.query.sortBy ?? "_id";
    const sort = { [sortBy]: order };

    const all_data = await ServiceRequestModel.countDocuments(filter);
    const data = await ServiceRequestModel.find(filter)
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

// SPGY-TU-00PAA10AE001,	COARSE SCREEN A,
// SPGY-TU-00PAA20AE001,	COARSE SCREEN C,
// SPGY-TU-00PAA10AE002,	COARSE SCREEN B,
// SPGY-TU-00PAA20AE002,	COARSE SCREEN D,

// 290300000212
// 29030000021201
// 290300000212
// 29030000021201

const createServiceRequest = async (req, res, next) => {
  try {
    // const data = [
    //   {
    //     summary: req.body.summary[0],
    //     status: "NEW",
    //     wo_number: null,
    //     asset_number: "SPGY-TU-00PAA10AE001",
    //     equipment_rbd_num: null,
    //     asset_description: "COARSE SCREEN A",
    //     location: "290300000212",
    //     report_by_name: "MUHAMMAD IRFAN",
    //     work_group: "OPRUNIT",
    //     shift: "A",
    //     site: "PY",
    //     fault_priority: "URGENT",
    //     fault_type: "PDM",
    //     reported_date: new Date(),
    //     needdowntime: null,
    //   },
    //   {
    //     summary: req.body.summary[1],
    //     status: "NEW",
    //     wo_number: null,
    //     asset_number: "SPGY-TU-00PAA20AE001",
    //     equipment_rbd_num: null,
    //     asset_description: "COARSE SCREEN C",
    //     location: "29030000021201",
    //     report_by_name: "MUHAMMAD IRFAN",
    //     work_group: "OPRUNIT",
    //     shift: "A",
    //     site: "PY",
    //     fault_priority: "URGENT",
    //     fault_type: "PDM",
    //     reported_date: new Date(),
    //     needdowntime: null,
    //   },
    //   {
    //     summary: req.body.summary[2],
    //     status: "NEW",
    //     wo_number: null,
    //     asset_number: "SPGY-TU-00PAA10AE002",
    //     equipment_rbd_num: null,
    //     asset_description: "COARSE SCREEN B",
    //     location: "290300000212",
    //     report_by_name: "MUHAMMAD IRFAN",
    //     work_group: "OPRUNIT",
    //     shift: "A",
    //     site: "PY",
    //     fault_priority: "URGENT",
    //     fault_type: "PDM",
    //     reported_date: new Date(),
    //     needdowntime: null,
    //   },
    //   {
    //     summary: req.body.summary[3],
    //     status: "NEW",
    //     wo_number: null,
    //     asset_number: "SPGY-TU-00PAA20AE002",
    //     equipment_rbd_num: null,
    //     asset_description: "COARSE SCREEN D",
    //     location: "29030000021201",
    //     report_by_name: "MUHAMMAD IRFAN",
    //     work_group: "OPRUNIT",
    //     shift: "A",
    //     site: "PY",
    //     fault_priority: "URGENT",
    //     fault_type: "PDM",
    //     reported_date: new Date(),
    //     needdowntime: null,
    //   },
    // ];

    // // Simpan semua sekaligus
    // const savedServiceRequests = await ServiceRequestModel.insertMany(data);

    // res.status(201).json(savedServiceRequests);
    const data = {
      summary: req.body.summary,
      status: "NEW",
      wo_number: null,
      asset_number: req.body.asset_number, // "SPGY-TU-20HFB32AF001"
      equipment_rbd_num: null,
      asset_description: req.body.asset_description, // "COAL FEEDER 2F"
      location: req.body.location, // "290300020105"
      report_by_name: req.body.report_by_name, // "MUHAMMAD IRFAN"
      work_group: req.body.work_group, // "OPRUNIT"
      shift: req.body.shift, // "A"
      site: req.body.site, // "PY"
      fault_priority: req.body.fault_priority, // "URGENT"
      fault_type: req.body.fault_type, // "PDM"
      reported_date: new Date(),
      needdowntime: req.body.needdowntime, // null
      createdBy: req.uid,
      updatedBy: req.uid,
    };

    const newServiceRequest = new ServiceRequestModel(data);
    const savedServiceRequest = await newServiceRequest.save();

    res.status(201).json(savedServiceRequest);
  } catch (err) {
    next(err);
  }
};

const updateServiceRequest = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can update data", 403));

  try {
    const response = req.data;

    const data = {
      status: req.body.status,
      summary: req.body.summary,
      createdBy: req.uid,
      updatedBy: req.uid,
    };

    const updatedServiceRequest = await ServiceRequestModel.findByIdAndUpdate(
      response.id,
      data,
      { new: true }
    );

    res.status(200).json(updatedServiceRequest);
  } catch (err) {
    next(err);
  }
};

const deleteServiceRequest = async (req, res, next) => {
  if (req.role !== "admin")
    return next(new CustomError("only admin can delete data", 403));
  try {
    const response = req.data;

    const deletedServiceRequest = await ServiceRequestModel.findByIdAndDelete(
      response.id
    );

    res.status(200).json(deletedServiceRequest);
  } catch (err) {
    next(err);
  }
};

export {
  showServiceRequest,
  findServiceRequest,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
};
