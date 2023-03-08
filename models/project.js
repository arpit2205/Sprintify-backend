const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
    members: {
      type: Array,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "projects",
    timestamps: true,
  }
);

const Project = mongoose.model("projects", projectSchema);
module.exports = Project;
