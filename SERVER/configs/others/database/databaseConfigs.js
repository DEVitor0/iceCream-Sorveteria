const mongoose = require("mongoose");

const connectDB = (connectionString) => {
  return mongoose
    .connect(connectionString)
    .then(() => {
      console.log("The database connection is ready");
    })
    .catch((err) => {
      console.error("An error occurred during connection: ", err);
      process.exit(1);
    });
};

module.exports = connectDB;
