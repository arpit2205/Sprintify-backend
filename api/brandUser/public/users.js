var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");

var User = require("../../../models/user");
var ProjectMembers = require("../../../models/projectMembers");

// middlewares
var verifyBrandUser = require("../../../middleware/verifyBrandUser");
var passport = require("passport");
require("../../../middleware/passportJwt")(passport);

// get all users of a brand
router.get(
  "/all-users",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    User.find({
      "brand.brandId": req.user.brand.brandId,
      isBrandUser: true,
      isDeleted: false,
    })
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// get all members of a project
router.get(
  "/project-members/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    var projectId = req.params.id;

    ProjectMembers.find({
      "project._id": mongoose.Types.ObjectId(projectId),
      isDeleted: false,
    })
      .select({ user: 1 })
      .then(function (data) {
        var users = [];
        for (var i = 0; i < data.length; i++) {
          users.push(data[i].user);
        }
        res.status(200).json({ status: "success", data: users });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

module.exports = router;
