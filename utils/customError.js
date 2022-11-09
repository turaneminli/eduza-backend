class customError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}

module.exports = customError;
