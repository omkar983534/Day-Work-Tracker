const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

// Every task route requires a logged-in user
router.use(protect);

router.route("/").get(getTasks).post(createTask);
router.route("/:id").put(updateTask).delete(deleteTask);
router.patch("/:id/toggle", toggleTask);

module.exports = router;
