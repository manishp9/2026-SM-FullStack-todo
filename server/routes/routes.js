const express = require("express");
const router = express.Router();
const {
  getTodo,
  createTodo,
  updateTodo, // ✅ Added
  deleteTodo, // ✅ Added
} = require("../controllers/todolistController");

router.get("/todo-list", getTodo);
router.post("/todo-list", createTodo);
router.patch("/todo-list/:id", updateTodo); // ✅ Added — for toggling complete/starred
router.delete("/todo-list/:id", deleteTodo); // ✅ Added — for deleting a task

module.exports = router;
