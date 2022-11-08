const express = require("express");

const mongoose = require("mongoose");
require("dotenv").config();

const bodyParser = require("body-parser");
const cors = require("cors");

const courseRoutes = require("./routes/course");

const app = express();
const path = require("path");

// middleware
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// CORS configuration
app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// routes
app.use(courseRoutes);

// database connnection
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const connectionString = `mongodb+srv://${username}:${password}@eduza-cluster.i7xuimv.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(connectionString)
  .then((result) => {
    // console.log(result);
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
