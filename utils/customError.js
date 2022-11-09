class customError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);

    this.statusCode = statusCode;
    this.data = data;
  }
}

module.exports = customError;
