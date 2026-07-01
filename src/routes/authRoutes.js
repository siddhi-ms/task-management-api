const express = require('express');
const { register, login } = require('../controllers/authController');
const handleValidationErrors = require('../middleware/validationMiddleware');
const {
	registerValidator,
	loginValidator,
} = require('../validators/authValidators');

const router = express.Router();

router.post('/register', registerValidator, handleValidationErrors, register);
router.post('/login', loginValidator, handleValidationErrors, login);

module.exports = router;
