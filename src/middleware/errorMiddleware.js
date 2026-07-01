const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let errors;

  if (error.type === 'validation') {
    statusCode = 400;
    message = 'Validation failed';
    errors = error.details;
  }

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(error.errors || {}).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ObjectId';
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'Email already in use';
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Unauthorized: invalid token';
  }

  const response = {
    success: false,
    message,
  };

  if (errors && errors.length) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler,
};