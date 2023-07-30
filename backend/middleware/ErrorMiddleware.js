const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode === 2000 ? 500 : res.statusCode;
  let message = error.message;

  // If Mongoose not found error, set to 404 and change message
  if (error.name === "CastError" && error.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource Not Found";
  }

  res.status(statusCode).json({
    message,
    stack: "development" === "production" ? null : error.stack,
  });
};

module.exports = {
  errorHandler,
  notFound,
};
