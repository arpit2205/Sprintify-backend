var express = require("express");
var router = express.Router();

var Project = require("../../../models/project");

// middlewares
var verifyBrandUser = require("../../../middleware/verifyBrandUser");
var passport = require("passport");
require("../../../middleware/passportJwt")(passport);

router.get(
  "/all-projects",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    // if manager, return all projects of his org
    if (req.user.roles.indexOf("manager") !== -1) {
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

    // if member, return the projects he/she is part of
    else if (req.user.roles.indexOf("member") !== -1) {
      Project.find({
        members: { $elemMatch: { memberId: req.user._id.toString() } },
        isDeleted: false,
      })
        .then(function (data) {
          res.status(200).json({ status: "success", data: data });
        })
        .catch(function (error) {
          res.status(500).json({ status: "error", data: error });
        });
    }
  }
);

module.exports = router;
