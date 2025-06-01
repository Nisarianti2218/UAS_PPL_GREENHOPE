import { cleanEnv } from "envalid";
import { str, port } from "envalid/dist/validators.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Validate environment variables
export default function validateEnv() {
  const env = cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    JWT_SECRET: str(),
    MONGO_DB_NAME: str(),
    SECRET_SESSION_KEY: str(),
    ALLOWED_ORIGIN: str(),
  });

  return env;
}
// This function will throw an error if any of the required environment variables are missing or invalid
// You can call this function at the start of your application to ensure all required environment variables are set
// Example usage:
// import validateEnv from './utils/validateEnv.js';
// const env = validateEnv();
