class customError extends Error {
  constructor(message, statusCode, data) {
    super(message);

    this.statusCode = statusCode;
    this.data = data;

    // capturing the stack trace keeps the reference to your error class
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, customError);
    }
  }
}

module.exports = customError;
