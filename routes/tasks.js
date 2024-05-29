const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const taskController = require('../controllers/taskController');

// Protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected Route' });
});

// Create a new task
router.post('/', taskController.createTask);

// Get all tasks
router.get('/', taskController.getAllTasks);

// Get a single task by ID
router.get('/:id', taskController.getTaskById);

// Update a task by ID
router.put('/:id', taskController.updateTaskById);

// Delete a task by ID
router.delete('/:id', taskController.deleteTaskById);

// Get tasks filtered by due date
router.get('/dueDate/:date', taskController.getTasksByDueDate);

// Get tasks filtered by priority
router.get('/priority/:priority', taskController.getTasksByPriority);

// Get tasks filtered by status
router.get('/status/:status', taskController.getTasksByStatus);

// Get the count of tasks completed
router.get('/analytics/completed', taskController.getCompletedTasksCount);

// Get the tasks overdue
router.get('/analytics/overdue', taskController.getOverdueTasks);

module.exports = router;
