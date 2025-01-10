require("dotenv").config();

const SERVER_PORT = process.env.SERVER_PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

const express = require("express");
const app = express();

const connectDB = require("./configs/databaseConfigs");
const createAdminUser = require("./utils/initializeAdmin");

connectDB(CONNECTION_STRING).then(async () => {
    console.log("Database was connected!");
    await createAdminUser();

    app.listen(SERVER_PORT, () => {
        console.log(`Server is running on: http://localhost:${SERVER_PORT}`);
    });
}).catch((err) => {
    console.error("Failed to start server:", err);
});
