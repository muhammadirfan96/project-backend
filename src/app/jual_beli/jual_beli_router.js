import express from "express";
import BarangRouter from "./v1.0.0/routes/BarangRouter.js";
import PembeliRouter from "./v1.0.0/routes/PembeliRouter.js";
import PenjualRouter from "./v1.0.0/routes/PenjualRouter.js";
import TransaksiPembelianRouter from "./v1.0.0/routes/TransaksiPembelianRouter.js";
import TransaksiPenjualanRouter from "./v1.0.0/routes/TransaksiPenjualanRouter.js";

const jual_beli_router = express.Router();

jual_beli_router.use("/v1.0.0", BarangRouter);
jual_beli_router.use("/v1.0.0", PembeliRouter);
jual_beli_router.use("/v1.0.0", PenjualRouter);
jual_beli_router.use("/v1.0.0", TransaksiPembelianRouter);
jual_beli_router.use("/v1.0.0", TransaksiPenjualanRouter);

export default jual_beli_router;
