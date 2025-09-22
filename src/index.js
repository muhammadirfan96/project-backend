import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { port } from "./config/app.js";
import logger from "./config/logger.js";
import database, { uri } from "./config/database.js";

import UsersRouter from "./routers/UsersRouter.js";
import logsMeta from "./middlewares/logsMeta.js";

import jual_beli_router from "./app/jual_beli/jual_beli_router.js";
import limaes_router from "./app/limaes/limaes_router.js";
import seapower_router from "./app/seapower/seapower_router.js";

import { startCaptureAndDetect } from "./app/seapower/v1.0.0/controllers/DetectionController.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

/** Allow CORS from local domains */
const allowedOrigins = [
  "http://jual_beli.plnnusantarapower.co.id",
  "http://limaes.plnnusantarapower.co.id",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://seapower.plnnusantarapower.co.id",
  "http://seapower-dashboard.plnnusantarapower.co.id",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(logsMeta);

/** Logging route access */
app.use((req, res, next) => {
  logger.info("Route accessed", { meta: req.logMeta });
  next();
});

/** Routers */
app.use(UsersRouter);
app.use("/jual_beli", jual_beli_router);
app.use("/limaes", limaes_router);
app.use("/seapower", seapower_router);

/** Static File Serving */
app.use("/public", express.static(path.join(__dirname, "public")));

/** Global Error Handler */
app.use((err, req, res, next) => {
  logger.error(err.stack, { meta: req.logMeta });
  res.status(err.status || 500).json({ error: err.message });
});

/** Database & Server Start */
database()
  .then(() => {
    console.log(`✅ Database connected: ${uri}`);
    // Mulai proses deteksi setelah koneksi DB berhasil
    // startCaptureAndDetect();
  })
  .catch((err) => console.error("❌ Failed to connect database:", err));

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
