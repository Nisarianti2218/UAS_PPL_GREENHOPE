import express from "express";
import validateEnv from "./utils/validateEnv.js";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { corsConfig, sessionConfig } from "./config/index.js";
import mongoose from "mongoose";
import { httpStatusCodes } from "./data/statusCode.js";
import adminRoutesAll from "./routes/admin/index.js";
import { isHttpError } from "http-errors";

// Konversi __filename dan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate environment variables
const env = validateEnv();

const app = express();
const port = env.PORT || 5000;
const mongoStr = env.MONGO_CONNECTION_STRING;
const JWT_SECRET = env.JWT_SECRET;

// file upload
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);
app.use(
  "/media/bukti",
  express.static(path.join(__dirname, "media/bukti"), {
    maxAge: "1d", // Cache for one day
    etag: false, // Disable etag for faster responses
  })
);
app.use("/media/lokasi", express.static(path.join(__dirname, "media/lokasi")));
app.use(
  "/media/laporan",
  express.static(path.join(__dirname, "media/laporan"))
);

// Body parser
app.use(
  bodyParser.json({
    limit: "10mb", // Set limit for JSON body size
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10mb", // Set limit for URL-encoded body size
  })
);

// Session Configuration
app.use(sessionConfig);
// CORS Configuration
app.use(cors(corsConfig));
app.options("*", cors()); // Preflight requests

// Routes
app.use("/api/admin", adminRoutesAll);

mongoose.connect(`${mongoStr}`).then(() => {
  console.log("Connected to MongoDB");
  app.listen(port, "0.0.0.0", () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});

// Fungsi untuk mencari pesan berdasarkan status code
function getMessageForStatusCode(statusCode) {
  const status = httpStatusCodes.find((item) => item.statusCode === statusCode);
  return status ? status.message : "Unknown Status Code";
}

app.use((error, req, res, next) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  let text = "";
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
    text = getMessageForStatusCode(statusCode);
  }
  res.status(statusCode).json({ error: errorMessage });
});
