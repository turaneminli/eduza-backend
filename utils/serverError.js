const serverError500 = (err, next) => {
  if (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

module.exports = serverError500;
