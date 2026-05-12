const Todolist = require("../models/todolistModel");

// GET all todos
const getTodo = async (req, res) => {
  try {
    const allTodo = await Todolist.find();

    // ✅ Fix #1: Removed early return bug — previously both the "empty" json()
    // AND the success json() would fire on the same request (headers already sent error).
    // Now using a single res.json() call per code path.
    return res.status(200).json({
      success: true,
      todo: allTodo, // returns [] if empty — frontend already handles empty arrays
    });
  } catch (err) {
    // ✅ Fix #2: Log the actual error server-side for debugging
    console.error("Get Todo Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// CREATE a todo
const createTodo = async (req, res) => {
  try {
    const { title, priority, date, starred } = req.body;

    // ✅ Fix #3: Validate required fields before hitting the DB
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required and must be a non-empty string",
      });
    }

    // ✅ Fix #4: Only pass known/safe fields to Todolist.create()
    // instead of spreading the entire req.body (prevents mass assignment attacks)
    const todoNew = await Todolist.create({
      title: title.trim(),
      priority: priority || "low",
      date: date || null,
      starred: starred ?? false,
      completed: false,
    });

    // ✅ Fix #5: Response key was `data` but frontend expected `todo`
    return res.status(201).json({
      success: true,
      todo: todoNew,
    });
  } catch (error) {
    console.error("Create Todo Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ✅ Fix #6: Added PATCH handler for toggling completed/starred
// (frontend calls PATCH /todo-list/:id)
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, starred } = req.body;

    const updatedTodo = await Todolist.findByIdAndUpdate(
      id,
      { completed, starred },
      { new: true, runValidators: true },
    );

    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      todo: updatedTodo,
    });
  } catch (error) {
    console.error("Update Todo Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ✅ Fix #7: Added DELETE handler
// (frontend calls DELETE /todo-list/:id)
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Todolist.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Delete Todo Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
};
