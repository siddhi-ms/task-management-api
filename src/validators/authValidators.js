const { body } = require('express-validator');
const {
  emailValidator,
  passwordValidator,
} = require('./commonValidators');

const registerValidator = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .bail()
    .isString()
    .withMessage('Name must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  emailValidator,
  passwordValidator,
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
];

const loginValidator = [emailValidator, passwordValidator];

module.exports = {
  registerValidator,
  loginValidator,
};
