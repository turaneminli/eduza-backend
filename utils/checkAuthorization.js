const customError = require("../utils/customError");

const checkAuthorization = (course, req, property) => {
  // checking authorization for the review objects
  if (property === "review") {
    if (course.author.toString() !== req.userId) {
      throw new customError("Not authorized", 403);
    }
  }

  // checking authorization for the course objects
  if (property === "course") {
    if (course.creator.toString() !== req.userId) {
      throw new customError("Not authorized", 403);
    }
  }
};

module.exports = checkAuthorization;
