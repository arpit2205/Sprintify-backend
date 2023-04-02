var express = require("express");
var router = express.Router();

var Project = require("../../../models/project");
var ProjectMembers = require("../../../models/projectMembers");

// middlewares
var verifyBrandUser = require("../../../middleware/verifyBrandUser");
var passport = require("passport");
require("../../../middleware/passportJwt")(passport);

router.get(
  "/all-projects",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    // if director, return all projects of his org
    if (req.user.roles.indexOf("director") !== -1) {
      Project.find({
        "brand.brandId": req.user.brand.brandId,
        isDeleted: false,
      })
        .then(function (data) {
          res.status(200).json({ status: "success", data: data });
        })
        .catch(function (error) {
          res.status(500).json({ status: "error", data: error });
        });
    }

    // if manager, return all projects which he is owner of or part of
    else if (req.user.roles.indexOf("manager") !== -1) {
      Project.find({ "owner.userId": req.user._id, isDeleted: false })
        .then(function (ownedProjects) {
          ProjectMembers.find({
            "user.userId": req.user._id.toString(),
            "project.owner.userId": { $ne: req.user._id },
          })
            .select({ project: 1 })
            .then(function (data) {
              var projects = [];
              for (var i = 0; i < data.length; i++) {
                projects.push(data[i].project);
              }

              res.status(200).json({
                status: "success",
                data: ownedProjects.concat(projects),
              });
            })
            .catch(function (error) {
              res.status(500).json({ status: "error", data: error });
            });
        })
        .catch(function (error) {
          res.status(500).json({ status: "error", data: error });
        });
    }

    // if member, return the projects he/she is part of
    else if (req.user.roles.indexOf("member") !== -1) {
      ProjectMembers.find({ "user.userId": req.user._id.toString() })
        .select({ project: 1 })
        .then(function (data) {
          var projects = [];
          for (var i = 0; i < data.length; i++) {
            projects.push(data[i].project);
          }
          res.status(200).json({ status: "success", data: projects });
        })
        .catch(function (error) {
          res.status(500).json({ status: "error", data: error });
        });
    }
  }
);

module.exports = router;
