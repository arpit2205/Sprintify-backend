var express = require("express");
var router = express.Router();

var User = require("../../../models/user");

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

module.exports = router;
