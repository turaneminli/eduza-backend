const express = require("express");

const mongoose = require("mongoose");
require("dotenv").config();

const bodyParser = require("body-parser");
const cors = require("cors");

const courseRoutes = require("./routes/course");

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());

// routes
app.use(courseRoutes);

// database connnection
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const connectionString = `mongodb+srv://${username}:${password}@eduza-cluster.i7xuimv.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(connectionString)
  .then((result) => {
    console.log(result);
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
