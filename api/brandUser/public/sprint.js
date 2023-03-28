var express = require("express");
var router = express.Router();

var Sprint = require("../../../models/sprint");
var Task = require("../../../models/task");

// aggregation
var {
  percentageOfTasksCompletedForAllSprints,
  sprintTypeCounts,
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
    var filter = req.query.filter;

    var queries = {};
    queries["project.projectId"] = projectId;
    queries.isDeleted = false;

    if (filter === "active") {
      queries.isCompleted = false;
    }

    Sprint.find(queries)
      .sort({ createdAt: -1 })
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

// fetch sprint type counts (active, upcoming, completed, overdue, on time completed)
router.get(
  "/stats/:projectId",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    var projectId = req.params.projectId;
    Sprint.aggregate(sprintTypeCounts(projectId))
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

module.exports = router;
