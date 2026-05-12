const { Schema, model } = require("mongoose");
const TodoListSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    default: "low",
  },
  date: {
    type: Date,
  },
  starred: {
    type: Boolean,
    default: false,
  },
});

const TodoListModel = model("Todolist", TodoListSchema);

module.exports = TodoListModel;
