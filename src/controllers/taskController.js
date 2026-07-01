const Task = require('../models/Task');

const buildTaskFilter = (req, taskId) => {
  const filter = {};

  if (taskId) {
    filter._id = taskId;
  }

  if (req.user.role !== 'admin') {
    filter.createdBy = req.user._id;
  }

  return filter;
};

const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while creating task',
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find(buildTaskFilter(req)).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks',
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne(buildTaskFilter(req, req.params.id));

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task id',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching task',
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.findOneAndUpdate(
      buildTaskFilter(req, req.params.id),
      { title, description, status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task id',
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while updating task',
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete(buildTaskFilter(req, req.params.id));

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task id',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while deleting task',
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
