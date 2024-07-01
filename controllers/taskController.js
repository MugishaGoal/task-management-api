const Task = require('../models/Task');

module.exports = {
  // Create a new task
  async createTask(req, res) {
    try {
      const task = new Task(req.body);
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  },

  // Get all tasks
  async getAllTasks(req, res) {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  },

  // Get a single task by ID
  async getTaskById(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  },

  // Update a task by ID
  async updateTaskById(req, res) {
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  },

  // Delete a task by ID
  async deleteTaskById(req, res) {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  },

  // Get tasks filtered by due date
  async getTasksByDueDate(req, res) {
    const { date } = req.params;
    try {
      const tasks = await Task.find({ dueDate: date });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  },

  // Get tasks filtered by priority
  async getTasksByPriority(req, res) {
    const { priority } = req.params;
    try {
      const tasks = await Task.find({ priority });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  },

  // Get tasks filtered by status
  async getTasksByStatus(req, res) {
    const { status } = req.params;
    try {
      const tasks = await Task.find({ status });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  },

// Get completed tasks count
async getCompletedTasksCount(req, res) {
    try {
      const count = await Task.countDocuments({ status: 'completed' });
      res.json({ completedTasks: count });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching completed tasks count' });
    }
  },

  // Get overdue tasks
  async getOverdueTasks(req, res) {
    const currentDate = new Date();
    try {
      const overdueTasks = await Task.find({ dueDate: { $lt: currentDate }, status: { $ne: 'completed' } });
      res.json(overdueTasks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching overdue tasks' });
    }
  },
};
