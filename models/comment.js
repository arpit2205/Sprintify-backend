const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    text: {
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
    collection: "comments",
    timestamps: true,
  }
);

const Comment = mongoose.model("comments", commentSchema);
module.exports = Comment;
