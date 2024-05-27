const mongoose = require("mongoose");

mongoose
  .connect(process.env.NODE_ENV !== "development" ? process.env.MONGODB_URL : process.env.MONGODB_URL_DEV)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database not connected", err));

module.exports = mongoose;