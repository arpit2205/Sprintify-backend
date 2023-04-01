var express = require("express");
var router = express.Router();

var { totalUsersOfABrand } = require("../../aggregations/brandAdmin/users");
var {
  projectCounts,
  projectList,
  taskCountInProjects,
} = require("../../aggregations/brandAdmin/projects");

// Models
var User = require("../../models/user");
var Project = require("../../models/project");
var Task = require("../../models/task");

// Middleware
var verifyBrandAdmin = require("../../middleware/verifyBrandAdmin");
var passport = require("passport");
require("../../middleware/passportJwt")(passport);

// Register a brand-user
router.get(
  "/counts",
  passport.authenticate("jwt", { session: false }),
  verifyBrandAdmin,
  function (req, res) {
    var brandId = req.user.brand.brandId;

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
