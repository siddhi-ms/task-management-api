const express = require('express');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const handleValidationErrors = require('../middleware/validationMiddleware');
const {
  createTaskValidator,
  updateTaskValidator,
} = require('../validators/taskValidators');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

router.use(protect, authorize('admin', 'user'));

router
  .route('/')
  .post(createTaskValidator, handleValidationErrors, createTask)
  .get(getTasks);
router
  .route('/:id')
  .get(getTaskById)
  .put(updateTaskValidator, handleValidationErrors, updateTask)
  .delete(deleteTask);

module.exports = router;
