require("dotenv").config();
const express = require("express");
const path = require("path");

const corsOptions = require("./configs/security/corsConfigs");
const connectDB = require("./configs/others/database/databaseConfigs");
const csrfProtection = require("./configs/security/csrfProtectionConfigs");
const { limiter } = require("./configs/security/rateLimiterConfig");
const configureMorgan = require("./configs/others/morganConfigs/index");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const { applySecurityHeaders } = require("./utils/security/helmetSecurity");
const csrfCookieMiddleware = require("./middlewares/security/csrfCookieMiddleware");
const { initialStockCheck } = require('./utils/others/products/stockMonitor');

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
