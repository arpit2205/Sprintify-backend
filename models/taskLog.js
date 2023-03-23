const mongoose = require("mongoose");

const taskLogSchema = mongoose.Schema(
  {
    logString: {
      type: String,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    },
    task: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: null,
    },
    actionType: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "taskLogs",
    timestamps: true,
  }
);

const TaskLog = mongoose.model("taskLogs", taskLogSchema);
module.exports = TaskLog;
