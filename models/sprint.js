const mongoose = require("mongoose");

const sprintSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    isStarted: {
      type: Boolean,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: String,
      required: true,
    },
    completedAt: {
      type: String,
      required: true,
    },
  },
  {
    collection: "sprints",
    timestamps: true,
  }
);

const Sprint = mongoose.model("sprints", sprintSchema);
module.exports = Sprint;
