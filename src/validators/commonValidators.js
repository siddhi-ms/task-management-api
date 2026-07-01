const { body } = require('express-validator');

const emailValidator = body('email')
  .exists({ checkFalsy: true })
  .withMessage('Email is required')
  .bail()
  .isEmail()
  .withMessage('Please provide a valid email')
  .bail()
  .normalizeEmail();

const passwordValidator = body('password')
  .exists({ checkFalsy: true })
  .withMessage('Password is required')
  .bail()
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long');

const titleRequiredValidator = body('title')
  .exists({ checkFalsy: true })
  .withMessage('Title is required')
  .bail()
  .isString()
  .withMessage('Title must be a string')
  .bail()
  .trim()
  .notEmpty()
  .withMessage('Title is required');

const titleOptionalValidator = body('title')
  .optional()
  .isString()
  .withMessage('Title must be a string')
  .bail()
  .trim()
  .notEmpty()
  .withMessage('Title cannot be empty');

const descriptionOptionalValidator = body('description')
  .optional()
  .isString()
  .withMessage('Description must be a string')
  .bail()
  .trim();

const statusOptionalValidator = body('status')
  .optional()
  .isIn(['Pending', 'In Progress', 'Completed'])
  .withMessage('Status must be one of: Pending, In Progress, Completed');

module.exports = {
  emailValidator,
  passwordValidator,
  titleRequiredValidator,
  titleOptionalValidator,
  descriptionOptionalValidator,
  statusOptionalValidator,
};
