require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./configs/corsConfigs");
const csrf = require("csurf");
const connectDB = require("./configs/databaseConfigs");
const createAdminUser = require("./utils/initializeAdmin");
const csrfProtection = require("./configs/csrfProtectionConfigs")
const { applySecurityHeaders } = require("./utils/helmetSecurity");
const { limiter } = require("./configs/rateLimiterConfig");
const routes = require("./routes");

const app = express();
const SERVER_PORT = process.env.SERVER_PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(csrfProtection);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(applySecurityHeaders);
app.use(limiter);

const csrfMiddleware = csrf({ cookie: true });
app.use(csrfMiddleware);
app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    next();
});

connectDB(CONNECTION_STRING)
    .then(async () => {
        console.log("Database connected!");
        await createAdminUser();

        app.use(routes);

        app.listen(SERVER_PORT, () => {
            console.log(`Server running on: http://localhost:${SERVER_PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to start server:", err);
        process.exit(1);
    });
