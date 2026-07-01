const { body } = require('express-validator');
const {
  titleRequiredValidator,
  titleOptionalValidator,
  descriptionOptionalValidator,
  statusOptionalValidator,
} = require('./commonValidators');

const createTaskValidator = [
  titleRequiredValidator,
  descriptionOptionalValidator,
  statusOptionalValidator,
];

const updateTaskValidator = [
  titleOptionalValidator,
  descriptionOptionalValidator,
  statusOptionalValidator,
  body().custom((value, { req }) => {
    const { title, description, status } = req.body || {};
    const hasAnyField =
      title !== undefined || description !== undefined || status !== undefined;

    if (!hasAnyField) {
      throw new Error(
        'At least one field is required: title, description, or status'
      );
    }

    return true;
  }),
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
};
