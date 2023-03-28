var express = require("express");
var router = express.Router();

// Models
var User = require("../../models/user");

// Middleware
var verifySuperAdmin = require("../../middleware/verifySuperAdmin");
var passport = require("passport");
require("../../middleware/passportJwt")(passport);

// fetch all brand admins
router.get(
  "/brand-admins",
  passport.authenticate("jwt", { session: false }),
  verifySuperAdmin,
  function (req, res) {
    User.aggregate([
      {
        $match: {
          isBrandAdmin: true,
        },
      },
      {
        $match: {
          isDeleted: false,
        },
      },
    ])
      .then(function (data) {
        res.status(201).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// delete a brand admin

module.exports = router;
