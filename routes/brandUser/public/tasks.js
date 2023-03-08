var express = require("express");
var router = express.Router();

var Task = require("../../../models/task");

// middlewares
var verifyBrandUser = require("../../../middleware/verifyBrandUser");
var passport = require("passport");
require("../../../middleware/passportJwt")(passport);

// create task
router.post(
  "/create-task",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    var taskId = req.body.taskId;
    var title = req.body.title;
    var description = req.body.description;

    var owner = {
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      roles: req.user.roles,
    };

    var assignedTo = req.body.assignedTo;
    var project = req.body.project;
    var sprint = req.body.sprint;
    var status = req.body.status;
    var type = req.body.type;
    var priority = req.body.priority;

    Task.create({
      taskId: taskId,
      title: title,
      description: description,
      owner: owner,
      assignedTo: assignedTo,
      project: project,
      sprint: sprint,
      status: status,
      type: type,
      priority: priority,
    })
      .then(function (data) {
        res.status(201).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// fetch tasks of a project
router.get(
  "/project/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    var projectId = req.params.id;

    Task.find({ "project.projectId": projectId, isDeleted: false })
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

module.exports = router;
