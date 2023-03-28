var express = require("express");
var router = express.Router();

var Project = require("../../../models/project");
var User = require("../../../models/user");

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
      memberId: req.user._id,
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
      members: members,
    })
      .then(function (data) {
        res.status(201).json({ status: "success", data: data });
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

module.exports = router;