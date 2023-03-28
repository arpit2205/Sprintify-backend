var express = require("express");
var router = express.Router();

var Comment = require("../../../models/comment");

// middlewares
var verifyBrandUser = require("../../../middleware/verifyBrandUser");
var passport = require("passport");
require("../../../middleware/passportJwt")(passport);

// post a comment
router.post(
  "/add-comment",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    const task = req.body.task;
    const project = req.body.project;
    const user = {
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      roles: req.user.roles,
    };
    const text = req.body.text;

    Comment.create({
      text: text,
      task: task,
      user: user,
      project: project,
    })
      .then(function (data) {
        res.status(201).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// fetch comments of a task
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    var taskId = req.params.id;

    Comment.find({ "task.taskId": taskId, isDeleted: false })
      .sort({ createdAt: -1 })
      .then(function (data) {
        res.status(201).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// delete comment
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    var commentId = req.params.id;

    Comment.updateOne({ _id: commentId }, { isDeleted: true })
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

module.exports = router;
