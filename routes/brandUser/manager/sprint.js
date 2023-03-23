var express = require("express");
var router = express.Router();

var Sprint = require("../../../models/sprint");
var Task = require("../../../models/task");

// middlewares
var verifyBrandUser = require("../../../middleware/verifyBrandUser");
var verifyManagerAccess = require("../../../middleware/verifyManagerAccess");
var passport = require("passport");
const { Timestamp } = require("bson");
require("../../../middleware/passportJwt")(passport);

// create sprint
router.post(
  "/create-sprint",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  verifyManagerAccess,
  function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var owner = {
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      roles: req.user.roles,
    };
    var project = req.body.project;
    var duration = req.body.duration;

    Sprint.create({
      name: name,
      description: description,
      owner: owner,
      project: project,
      duration: duration,
      isStarted: false,
      startedAt: " ",
    })
      .then(function (data) {
        res.status(201).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// add tasks to a sprint
router.post(
  "/add-tasks",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  verifyManagerAccess,
  function (req, res) {
    var taskIdsToBeUpdated = req.body.taskIdsToBeUpdated;
    var sprint = req.body.sprint;

    Task.updateMany(
      { _id: { $in: taskIdsToBeUpdated } },
      {
        sprint: sprint,
      }
    )
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// start a sprint
router.patch(
  "/start/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  verifyManagerAccess,
  function (req, res) {
    var sprintId = req.params.id;

    Sprint.findByIdAndUpdate(
      sprintId,
      {
        isStarted: true,
        startedAt: new Date().toISOString(),
      },
      { new: true }
    )
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

module.exports = router;
