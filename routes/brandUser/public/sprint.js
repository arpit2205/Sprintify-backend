var express = require("express");
var router = express.Router();

var Sprint = require("../../../models/sprint");
var Task = require("../../../models/task");

// aggregation
var {
  percentageOfTasksCompletedForAllSprints,
} = require("../../../aggregations/sprint");

// middlewares
var verifyBrandUser = require("../../../middleware/verifyBrandUser");
var passport = require("passport");
require("../../../middleware/passportJwt")(passport);

// fetch sprints of a project - public
router.get(
  "/project/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    var projectId = req.params.id;
    Sprint.find({ "project.projectId": projectId })
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// fetch % completion of tasks of all sprints
router.get(
  "/status/:projectId",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    var projectId = req.params.projectId;
    Task.aggregate(percentageOfTasksCompletedForAllSprints(projectId))
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

module.exports = router;
