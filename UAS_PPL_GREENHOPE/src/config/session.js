import session from "express-session";
import MongoStore from "connect-mongo";
import validateEnv from "../utils/validateEnv.js";
const env = validateEnv();

const sessionConfig = session({
  secret: env.SECRET_SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000, // 2 jam dalam milidetik
    secure: false, // Set to true if using HTTPS
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  },
  rolling: true, // Refresh the session cookie on every request
  store: MongoStore.create({
    mongoUrl: env.MONGO_CONNECTION_STRING,
  }),
});

export default sessionConfig;
// This configuration sets up session management using express-session and connect-mongo
