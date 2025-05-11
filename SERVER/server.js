require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const corsOptions = require("./configs/corsConfigs");
const connectDB = require("./configs/databaseConfigs");
const createAdminUser = require("./utils/initializeAdmin");
const csrfProtection = require("./configs/csrfProtectionConfigs");
const { applySecurityHeaders } = require("./utils/helmetSecurity");
const { limiter } = require("./configs/rateLimiterConfig");
const routes = require("./routes");
const csrfCookieMiddleware = require("./middlewares/csrfCookieMiddleware");
const configureMorgan = require("./configs/morganConfigs");

const app = express();
const SERVER_PORT = process.env.SERVER_PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(csrfProtection);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { logsPath } = configureMorgan(app, __dirname);

app.use(applySecurityHeaders);
app.use(limiter);

app.use(csrfCookieMiddleware);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB(CONNECTION_STRING)
    .then(async () => {
        console.log("Database connected!");
        await createAdminUser();

        app.use(routes);

        app.listen(SERVER_PORT, () => {
            console.log(`Server running on: http://localhost:${SERVER_PORT}`);
            console.log(`Detailed logs available at: ${logsPath}`);
        });
    })
    .catch((err) => {
        console.error("Failed to start server:", err);
        process.exit(1);
    });
