const fs = require("fs");
const path = require("path");

// handling clear image from the server if it is updated
const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

module.exports = clearImage;
