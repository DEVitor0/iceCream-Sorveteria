require("dotenv").config();
const express = require("express");
const path = require("path");

const corsOptions = require("./configs/corsConfigs");
const connectDB = require("./configs/databaseConfigs");
const csrfProtection = require("./configs/csrfProtectionConfigs");
const { limiter } = require("./configs/rateLimiterConfig");
const configureMorgan = require("./configs/morganConfigs");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const { applySecurityHeaders } = require("./utils/helmetSecurity");
const csrfCookieMiddleware = require("./middlewares/csrfCookieMiddleware");
const createAdminUser = require("./utils/initializeAdmin");
const { initialStockCheck } = require('./utils/stockMonitor');

const routes = require("./routes");

const app = express();
const SERVER_PORT = process.env.SERVER_PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

function configureServer() {
    app.set("trust proxy", 1);

    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(csrfProtection);
    app.use(applySecurityHeaders);
    app.use(limiter);
    app.use(csrfCookieMiddleware);

    const { logsPath } = configureMorgan(app, __dirname);
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    return { logsPath };
}

async function startServer() {
    try {
        const { logsPath } = configureServer();

        await connectDB(CONNECTION_STRING);
        console.log("Database connected!");

        await createAdminUser();

        app.use(routes);
        const server = app.listen(SERVER_PORT, () => {
            console.log(`Server running on: http://localhost:${SERVER_PORT}`);
            console.log(`Detailed logs available at: ${logsPath}`);
        });

        await initialStockCheck();
        console.log('Initial stock check completed');

        return server;
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
