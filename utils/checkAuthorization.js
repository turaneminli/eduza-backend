const customError = require("../utils/customError");

const checkAuthorization = (course, req) => {
  if (course.creator.toString() !== req.userId) {
    throw new customError("Not authorized", 403);
  }
};

module.exports = checkAuthorization;
