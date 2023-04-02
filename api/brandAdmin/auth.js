var express = require("express");
var router = express.Router();

var bcrypt = require("bcryptjs");

// Models
var User = require("../../models/user");
var Permissions = require("../../models/permissions");

// Middleware
var verifyBrandAdmin = require("../../middleware/verifyBrandAdmin");
var passport = require("passport");
require("../../middleware/passportJwt")(passport);

// Register a brand-user
router.post(
  "/register-brand-user",
  passport.authenticate("jwt", { session: false }),
  verifyBrandAdmin,
  function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var brand = req.user.brand;
    var role = req.body.role; // director or manager or member

    //TODO: validations

    //Hashing the password
    bcrypt.hash(password, 10).then(function (hashedPassword) {
      // find permissions of selected role
      Permissions.findOne({ role: role })
        .then(function (data) {
          // create new user
          var rolesArr = ["brand_user"];
          if (role === "member") {
            rolesArr.push("member");
          } else if (role === "manager") {
            rolesArr.push("manager");
          } else if (role === "director") {
            rolesArr.push("manager");
            rolesArr.push("director");
          }
          User.create({
            name: name,
            email: email,
            password: hashedPassword,
            roles: rolesArr,
            permissions: data.permissions,
            brand: brand,
            isSuperAdmin: false,
            isBrandAdmin: false,
            isBrandUser: true,
          })
            .then(function (user) {
              res.status(201).json({ status: "success", data: user });
            })
            .catch(function (error) {
              res.status(500).json({ status: "error", data: error });
            });
        })
        .catch(function (error) {
          res.status(500).json({ status: "error", data: error.message });
        });
    });
  }
);

module.exports = router;
