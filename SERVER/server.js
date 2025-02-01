require("dotenv").config();

const SERVER_PORT = process.env.SERVER_PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./configs/corsConfigs");
const express = require("express");
const csrf = require("csurf");
const csrfProtection = require('./configs/csrfProtectionConfigs');
const csrfErrorHandler = require('./middlewares/csurfMiddleware')
const app = express();
const routes = require("./routes");

const connectDB = require("./configs/databaseConfigs");
const createAdminUser = require("./utils/initializeAdmin");
const { applySecurityHeaders } = require("./utils/helmetSecurity");
const { limiter } = require("./configs/rateLimiterConfig");

const csrfCookies = csrf({ cookie: true });

app.set("trust proxy", 1);

connectDB(CONNECTION_STRING)
  .then(async () => {
    console.log("Database was connected!");
    await createAdminUser();

    app.listen(SERVER_PORT, () => {
      console.log(`Server is running on: http://localhost:${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(applySecurityHeaders);
app.use(limiter);
app.use(csrfCookies);
app.use(csrfProtection)
app.use(routes);
app.use(csrfErrorHandler);
