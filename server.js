require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// connect to mongoDB
const mongoose = require("./utils/db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Setup routes
const routes = require("./routes");
app.use('/api',routes);

// api/test will be removed after production.
app.post("/api/test", async (req, res) => {
  try {
    console.log("api-test hit POST");
    console.log("req.body-------------");
    console.log(req.body);
    console.log("req.params-------------");
    console.log(req.params);
    console.log("req.query-------------");
    console.log(req.query);
    res.json({ message: "test API Hit successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "test API failed" });
  }
});

// not found middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

// Start the server
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
