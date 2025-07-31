// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import UsersRouter from "./routers/UsersRouter.js";
// import logsMeta from "./middlewares/logsMeta.js";
// import { fileURLToPath } from "url";
// import path, { dirname } from "path";
// import { port } from "./config/app.js";
// import logger from "./config/logger.js";
// import database, { uri } from "./config/database.js";
// import jual_beli_router from "./app/jual_beli/jual_beli_router.js";
// import limaes_router from "./app/limaes/limaes_router.js";

// const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const allowedOrigins = [
//   "http://jual_beli.local.test",
//   "http://limaes.local.test",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(cookieParser());
// app.use(logsMeta);

// app.use((req, res, next) => {
//   logger.info("route accessed...", { meta: req.logMeta });
//   next();
// });

// app.use(UsersRouter);
// app.use("/jual_beli", jual_beli_router);
// app.use("/limaes", limaes_router);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use("/public", express.static("public"));

// app.use((err, req, res, next) => {
//   logger.error(err.stack, { meta: req.logMeta });
//   res.status(err.status || 500).json({ error: err.message });
// });

// database()
//   .then(() => console.log(`database connected ${uri}`))
//   .catch((err) => console.log("database not connect !"));

// app.listen(port, () => console.log(`server running on port ${port}`));

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

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

/** Allow CORS from local domains */
const allowedOrigins = [
  "http://jual_beli.local.test",
  "http://limaes.local.test",
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

/** Static File Serving */
// app.use("/public", express.static("public"));
app.use("/public", express.static(path.join(__dirname, "public")));

/** Global Error Handler */
app.use((err, req, res, next) => {
  logger.error(err.stack, { meta: req.logMeta });
  res.status(err.status || 500).json({ error: err.message });
});

/** Database & Server Start */
database()
  .then(() => console.log(`✅ Database connected: ${uri}`))
  .catch((err) => console.error("❌ Failed to connect database:", err));

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
