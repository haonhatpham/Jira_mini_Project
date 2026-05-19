function notFoundHandler(req, res) {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const responseBody = {
    message: err.message || "Internal server error",
  };

  if (err.errors) {
    responseBody.errors = err.errors;
  }

  res.status(statusCode).json(responseBody);
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
