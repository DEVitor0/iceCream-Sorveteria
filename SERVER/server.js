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

require('events').EventEmitter.defaultMaxListeners = 20;

const app = express();
const SERVER_PORT = process.env.SERVER_PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

function configureServer() {
  app.set("trust proxy", 1);

  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  app.use(csrfProtection);
  app.use(csrfCookieMiddleware);
  app.use(limiter);
  app.use(applySecurityHeaders);

  const { logsPath } = configureMorgan(app, __dirname);
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  return { logsPath };
}

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

async function startServer() {
    try {
        const { logsPath } = configureServer();

        await connectDB(CONNECTION_STRING);
        console.log("Database connected successfully!");

        app.use(routes);

        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        });

        const server = app.listen(SERVER_PORT, () => {
            console.log(`Server running on: http://localhost:${SERVER_PORT}`);
            console.log(`Detailed logs available at: ${logsPath}`);
        });

        await initialStockCheck();
        console.log('Initial stock check completed successfully');

        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully');
            server.close(() => {
                console.log('Process terminated');
            });
        });

        return server;
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
