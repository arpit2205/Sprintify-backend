var express = require("express");
var router = express.Router();

var Task = require("../../../models/task");

// middlewares
var verifyBrandUser = require("../../../middleware/verifyBrandUser");
var verifyManagerAccess = require("../../../middleware/verifyManagerAccess");
var passport = require("passport");
require("../../../middleware/passportJwt")(passport);

// delete a task
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  verifyManagerAccess,
  function (req, res) {
    Task.updateOne({ _id: req.params.id }, { isDeleted: true })
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

module.exports = router;
