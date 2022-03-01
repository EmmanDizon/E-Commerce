const ErrorHandler = require("../utils/error_handler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  let error = err;

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    error = new ErrorHandler(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    const message = `This ${Object.keys(
      err.keyValue
    )} is already existing in the database.`;
    error = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = "JSON web token is invalid.";
    error = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = "JSON web token is expired.";
    error = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};
