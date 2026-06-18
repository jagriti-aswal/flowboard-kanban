const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    priority: String,
    category: String,
    status: String,
    assignee: String,
    dueDate: String,
    attachments: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);