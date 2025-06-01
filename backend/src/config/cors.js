import cors from "cors";
import validateEnv from "../utils/validateEnv.js";

const env = validateEnv();

var allowedOrigins = env.ALLOWED_ORIGIN.split(",");
const allowOrigin = (origin, callback) => {
  // allow requests with no origin
  // periksa jika wildcard origin
  if (allowedOrigins.includes("*")) {
    return callback(null, true);
  }
  // (like mobile apps or curl requests)
  if (!origin) return callback(null, true);
  // check if the origin is in the allowed origins
  if (allowedOrigins.indexOf(origin) === -1) {
    var msg =
      "The CORS policy for this site does not " +
      "allow access from the specified Origin.";
    return callback(new Error(msg), false);
  }
  return callback(null, true);
};

const corsConfig = {
  origin: allowOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Access-Control-Allow-Credentials", "Set-Cookie"],
};

export default corsConfig;
// This configuration allows CORS requests from specified origins
