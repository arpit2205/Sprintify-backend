var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

var Project = require("../../../models/project");
var User = require("../../../models/user");
var ProjectMembers = require("../../../models/projectMembers");

// middlewares
var verifyBrandUser = require("../../../middleware/verifyBrandUser");
var verifyManagerAccess = require("../../../middleware/verifyManagerAccess");
var passport = require("passport");
require("../../../middleware/passportJwt")(passport);

// create project
router.post(
  "/create-project",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  verifyManagerAccess,
  function (req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var status = req.body.status;
    var members = req.body.members;

    // project creator
    members.push({
      userId: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      roles: req.user.roles,
    });

    Project.create({
      title: title,
      description: description,
      brand: {
        brandId: req.user.brand.brandId,
        name: req.user.brand.name,
        logoUrl: req.user.brand.logoUrl,
      },
      status: status,
      owner: {
        userId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        roles: req.user.roles,
      },
    })
      .then(function (project) {
        var projectMembersArray = [];

        for (var i = 0; i < members.length; i++) {
          projectMembersArray.push({
            project: project,
            user: members[i],
          });
        }

        ProjectMembers.insertMany(projectMembersArray)
          .then(function (data) {
            res.status(201).json({ status: "success", data: project });
          })
          .catch(function (error) {
            res.status(500).json({ status: "error", data: error });
          });

        // res.status(201).json({ status: "success", data: project });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// fetch users of a brand based on regex to create a project
router.get(
  "/users/:pattern",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  verifyManagerAccess,
  function (req, res) {
    var pattern = req.params.pattern;
    User.find({
      "brand.brandId": req.user.brand.brandId,
      name: { $regex: pattern, $options: "i" },
      isBrandUser: true,
      isDeleted: false,
    })
      .then(function (data) {
        res.status(201).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// edit project details
router.patch(
  "/edit-details/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  verifyManagerAccess,
  function (req, res) {
    var projectId = req.params.id;

    var title = req.body.title;
    var description = req.body.description;
    var status = req.body.status;

    var queries = {};
    var projectMembersQueries = {};

    if (title) {
      queries.title = title;
      projectMembersQueries["project.title"] = title;
    }
    if (description) {
      queries.description = description;
      projectMembersQueries["project.description"] = description;
    }
    if (status) {
      queries.status = status;
      projectMembersQueries["project.status"] = status;
    }

    // 1. Check if the user is project owner
    Project.find({ _id: projectId, "owner.userId": req.user._id })
      .then(function (found) {
        if (found.length !== 0) {
          Project.findOneAndUpdate({ _id: projectId }, queries, { new: true })
            .then(function (updatedProject) {
              ProjectMembers.updateMany(
                { "project._id": mongoose.Types.ObjectId(projectId) },
                projectMembersQueries
              )
                .then(function (data) {
                  res
                    .status(200)
                    .json({ status: "success", data: updatedProject });
                })
                .catch(function (error) {
                  res.status(500).json({ status: "error", data: error });
                });
            })
            .catch(function (error) {
              res.status(500).json({ status: "error", data: error });
            });
        } else {
          res
            .status(401)
            .json({ status: "error", data: { message: "Access denied" } });
        }
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });

    //TODO: 2. Check if user is a senior manager
  }
);

// add members to an existing project
router.post(
  "/add-members/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  verifyManagerAccess,
  function (req, res) {
    var projectId = req.params.id;

    var members = req.body.members;

    // 1. check if user is owner of project
    Project.find({ _id: projectId, "owner.userId": req.user._id })
      .then(function (found) {
        // -find the project
        if (found.length !== 0) {
          var project = found[0];

          var projectMembersArray = [];

          for (var i = 0; i < members.length; i++) {
            projectMembersArray.push({
              project: project,
              user: members[i],
            });
          }

          ProjectMembers.insertMany(projectMembersArray)
            .then(function (data) {
              res.status(200).json({ status: "success", data: data });
            })
            .catch(function (error) {
              res.status(500).json({ status: "error", data: error });
            });
        } else
          res
            .status(401)
            .json({ status: "error", data: { message: "Access denied" } });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });

    //TODO: 2. Check if user is a senior manager
  }
);

// remove member from an existing project
router.delete(
  "/remove-member/:projectId/:userId",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  verifyManagerAccess,
  function (req, res) {
    var projectId = req.params.projectId;
    var userId = req.params.userId;

    // 1. check if user is owner of project
    Project.find({ _id: projectId, "owner.userId": req.user._id })
      .then(function (found) {
        // -find the project
        if (found.length !== 0) {
          ProjectMembers.findOneAndDelete({
            "project._id": mongoose.Types.ObjectId(projectId),
            "user.userId": userId,
          })
            .then(function (data) {
              res.status(200).json({ status: "success", data: data });
            })
            .catch(function (error) {
              res.status(500).json({ status: "error", data: error });
            });
        } else
          res
            .status(401)
            .json({ status: "error", data: { message: "Access denied" } });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });

    //TODO: 2. Check if user is a senior manager
  }
);

module.exports = router;
