const Task = require("../models/Task");

// Escape user input before using it inside a RegExp
const escapeRegex = (str = "") => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * @route   GET /api/tasks
 * @desc    Get the logged-in user's tasks, with optional filtering
 * @query   status=all|active|completed, category=<name>, search=<keyword>
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const query = { user: req.user._id };

    if (status === "active") query.completed = false;
    if (status === "completed") query.completed = true;

    if (category && category !== "All") query.category = category;

    if (search && search.trim()) {
      const rx = new RegExp(escapeRegex(search.trim()), "i");
      query.$or = [{ title: rx }, { notes: rx }];
    }

    const tasks = await Task.find(query).sort({ completed: 1, createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch tasks" });
  }
};

/**
 * @route   POST /api/tasks
 * @desc    Create a task for the logged-in user
 * @access  Private
 */
const createTask = async (req, res) => {
  try {
    const { title, notes, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "A task needs a title" });
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      notes: notes?.trim() || "",
      category: category?.trim() || "General",
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Could not create task" });
  }
};

// Find a task that belongs to the current user, or return null
const findOwnedTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) return { task: null, reason: "not_found" };
  if (task.user.toString() !== userId.toString())
    return { task: null, reason: "forbidden" };
  return { task, reason: null };
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task (title, notes, category, completed)
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    const { task, reason } = await findOwnedTask(req.params.id, req.user._id);
    if (reason === "not_found")
      return res.status(404).json({ message: "Task not found" });
    if (reason === "forbidden")
      return res.status(403).json({ message: "Not your task" });

    const { title, notes, category, completed } = req.body;
    if (title !== undefined) task.title = title.trim();
    if (notes !== undefined) task.notes = notes.trim();
    if (category !== undefined) task.category = category.trim() || "General";
    if (completed !== undefined) task.completed = completed;

    const updated = await task.save();
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Could not update task" });
  }
};

/**
 * @route   PATCH /api/tasks/:id/toggle
 * @desc    Flip a task between done / not done
 * @access  Private
 */
const toggleTask = async (req, res) => {
  try {
    const { task, reason } = await findOwnedTask(req.params.id, req.user._id);
    if (reason === "not_found")
      return res.status(404).json({ message: "Task not found" });
    if (reason === "forbidden")
      return res.status(403).json({ message: "Not your task" });

    task.completed = !task.completed;
    const updated = await task.save();
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Could not update task" });
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    const { task, reason } = await findOwnedTask(req.params.id, req.user._id);
    if (reason === "not_found")
      return res.status(404).json({ message: "Task not found" });
    if (reason === "forbidden")
      return res.status(403).json({ message: "Not your task" });

    await task.deleteOne();
    return res.json({ id: req.params.id, message: "Task deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Could not delete task" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
};
