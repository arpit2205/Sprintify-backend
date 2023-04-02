var express = require("express");
var router = express.Router();

var { totalBrands } = require("../../aggregations/superadmin/brands");
var {
  totalProjects,
  projectCounts,
  projectList,
  taskCountInProjects,
} = require("../../aggregations/superadmin/projects");
var { totalTasks } = require("../../aggregations/superadmin/tasks");
var {
  totalUsers,
  totalUsersOfABrand,
} = require("../../aggregations/superadmin/users");

// Models
var User = require("../../models/user");
var Project = require("../../models/project");
var Task = require("../../models/task");
var Brand = require("../../models/brand");

// Middleware
var verifySuperAdmin = require("../../middleware/verifySuperAdmin");
var passport = require("passport");
const { default: mongoose } = require("mongoose");
require("../../middleware/passportJwt")(passport);

router.get(
  "/counts",
  passport.authenticate("jwt", { session: false }),
  verifySuperAdmin,
  function (req, res) {
    Promise.all([
      Brand.aggregate(totalBrands()),
      Project.aggregate(totalProjects()),
      User.aggregate(totalUsers()),
      Task.aggregate(totalTasks()),
    ])
      .then(function (data) {
        res.status(200).json({
          status: "success",
          data: {
            totalBrands: data[0],
            totalProjects: data[1],
            totalUsers: data[2],
            totalTasks: data[3],
          },
        });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

router.get(
  "/brand/:id",
  passport.authenticate("jwt", { session: false }),
  verifySuperAdmin,
  function (req, res) {
    var brandId = req.params.id;

    Promise.all([
      User.aggregate(totalUsersOfABrand(brandId)),
      Project.aggregate(projectCounts(brandId)),
      Project.aggregate(projectList(brandId)),
      Task.aggregate(taskCountInProjects(brandId)),
    ])
      .then(function (data) {
        res.status(200).json({
          status: "success",
          data: {
            totalUsersOfABrand: data[0],
            projectCounts: data[1],
            projectList: data[2],
            taskCountInProjects: data[3],
          },
        });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

module.exports = router;
