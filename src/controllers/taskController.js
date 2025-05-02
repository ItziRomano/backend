const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { description } = req.body;
    const task = await Task.create({ userId: req.user.id, description });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAllByUser(req.user.id);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { description, isCompleted } = req.body;

    const task = await Task.findByIdAndUser(taskId, req.user.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await Task.update({
      taskId,
      userId: req.user.id,
      description: description || task.description,
      isCompleted: isCompleted !== undefined ? isCompleted : task.is_completed
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndUser(taskId, req.user.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await Task.delete(taskId, req.user.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };