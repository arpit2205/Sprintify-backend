const mongoose = require("mongoose");

const projectMembersSchema = mongoose.Schema(
  {
    project: {
      type: Object,
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
    collection: "projectMembers",
    timestamps: true,
  }
);

const ProjectMembers = mongoose.model("projectMembers", projectMembersSchema);
module.exports = ProjectMembers;
