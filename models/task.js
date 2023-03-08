const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    owner: {
      type: Object,
      required: true,
    },

    assignedTo: {
      type: Object,
      default: null,
    },

    project: {
      type: Object,
      required: true,
    },

    sprint: {
      type: Object,
      default: null,
    },

    status: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "tasks",
    timestamps: true,
  }
);

const Task = mongoose.model("tasks", taskSchema);
module.exports = Task;
