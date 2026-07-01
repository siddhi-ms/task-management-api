const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const error = new Error('Validation failed');
  error.statusCode = 400;
  error.type = 'validation';
  error.details = errors.array().map((errorItem) => ({
      field: errorItem.path,
      message: errorItem.msg,
    }));

  return next(error);
};

module.exports = handleValidationErrors;
