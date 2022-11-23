const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const multer = require("multer");
const cors = require("cors");

// swagger ui
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// image uploads
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // replace : with - because Windows does not support ":"
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

// CORS configuration
app.use(cors());
app.use(cors({ origin: "*" }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

// middleware
app.use(bodyParser.json());

// routes
const courseRoutes = require("./routes/course");
const authRoutes = require("./routes/auth");

app.use(courseRoutes);
app.use("/auth", authRoutes);

// error handling
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data, statusCode: status });
});

// database connnection
require("dotenv").config();
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const connectionString = `mongodb+srv://${username}:${password}@eduza-cluster.i7xuimv.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(connectionString)
  .then((result) => {
    // console.log(result);
    app.listen(80);
  })
  .catch((err) => {
    console.log(err);
  });
