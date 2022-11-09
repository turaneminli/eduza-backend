const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");
require("dotenv").config({ path: "../.env" });
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    throw new customError("Not authenticated. ", 401);
  }

  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    throw new customError("Not authenticated. ", 401);
  }

  req.userId = decodedToken.userId;
  next();
};
