require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// connect to mongoDB
const { connectToDatabase } = require("./utils/db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Setup routes
const routes = require("./routes");
app.use('/api',routes);

// home route
app.get("/", async (req, res) => {
  const client = await connectToDatabase();
  const result = await client.sql`SELECT 1`;
  console.log(result);
  res.send(`Database connected successfully: ${result}`);
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
