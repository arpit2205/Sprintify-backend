var express = require("express");
var router = express.Router();

// Models
var User = require("../../models/user");

// Middleware
var verifyBrandAdmin = require("../../middleware/verifyBrandAdmin");
var passport = require("passport");
require("../../middleware/passportJwt")(passport);

// fetch all brand users
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  verifyBrandAdmin,
  function (req, res) {
    User.aggregate([
      {
        $match: {
          isBrandUser: true,
          "brand.name": `${req.user.brand.name}`,
          isDeleted: false,
        },
      },
    ])
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

module.exports = router;
