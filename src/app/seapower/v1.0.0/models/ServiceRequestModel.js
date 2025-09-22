// make schema service request
// ecmascript modules
// {
//     "Service Request":310079,
//     "Summary":"[UNIT 2][TURBIN][DEBRIS FILTER A][NARASINYA]",
//     "Status":"RESOLVED",
//     "WO Number":"WO1442",
//     "Asset Number":"SPGY-TU-10PAB21AT001",
//     "Equipment RBD Num":null,
//     "Asset Description":"DEBRIS FILTER A",
//     "Location":290300020105,
//     "Report By Name":"BACHRUL ULUM DJ",
//     "Work Group":"OPRUNIT",
//     "Shift":"A",
//     "Site":"PY",
//     "Fault Priority":"URGENT",
//     "Fault Type":"CM",
//     "Reported Date":"1\/27\/23 5:08 PM",
//     "Needdowntime?":null
// }

// UNIT 1	SPGY-TU-10PAB21AT001	DEBRIS FILTER A
// UNIT 1	SPGY-TU-10PAB22AT001	DEBRIS FILTER B
// UNIT 2	SPGY-TU-20PAB21AT001	DEBRIS FILTER A
// UNIT 2	SPGY-TU-20PAB22AT001	DEBRIS FILTER B

// [
//   {
//     area: "UNIT 1",
//     asset_number: "SPGY-TU-10PAB21AT001",
//     asset_description: "DEBRIS FILTER A",
//   },
//   {
//     area: "UNIT 1",
//     asset_number: "SPGY-TU-10PAB22AT001",
//     asset_description: "DEBRIS FILTER B",
//   },
//   {
//     area: "UNIT 2",
//     asset_number: "SPGY-TU-20PAB21AT001",
//     asset_description: "DEBRIS FILTER A",
//   },
//   {
//     area: "UNIT 2",
//     asset_number: "SPGY-TU-20PAB22AT001",
//     asset_description: "DEBRIS FILTER B",
//   },
// ];

import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    service_request: Number, // auto increment
    summary: String,
    status: String, // fixed status ==> "NEW, QUEUED"
    wo_number: String, // fixed wo number ==> null
    asset_number: String, // fixed asset number ==> "SPGY-TU-20HFB32AF001"
    equipment_rbd_num: String, // fixed equipment rbd number ==> null
    asset_description: String, // fixed asset description ==> "COAL FEEDER 2F"
    location: String, // fixed location ==> 290300020105
    report_by_name: String, // fixed report by name ==> "MUHAMMAD IRFAN"
    work_group: String, // fixed work group ==> "OPRUNIT"
    shift: String, // fixed shift ==> "A"
    site: String, // fixed site ==> "PY"
    fault_priority: String, // fixed fault priority ==> "URGENT"
    fault_type: String, // fixed fault type ==> "PDM"
    reported_date: Date,
    needdowntime: Boolean, // fixed needdowntime ==> null
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const ServiceRequestModel = mongoose.model("servicerequests", schema);
export default ServiceRequestModel;
