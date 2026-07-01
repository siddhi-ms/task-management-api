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

const createTask = async (req, res, next) => {
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
    return next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const parsedPage = Number.parseInt(req.query.page, 10);
    const parsedLimit = Number.parseInt(req.query.limit, 10);

    const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
    const limit = Number.isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit;

    const filter = buildTaskFilter(req);

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      filter.title = {
        $regex: req.query.search,
        $options: 'i',
      };
    }

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = totalTasks === 0 ? 0 : Math.ceil(totalTasks / limit);
    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalTasks,
      tasks,
    });
  } catch (error) {
    return next(error);
  }
};

const getTaskById = async (req, res, next) => {
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
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
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
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
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
    return next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
