var express = require("express");
var router = express.Router();

var bcrypt = require("bcryptjs");

// Models
var User = require("../../models/user");
var Brand = require("../../models/brand");

// Middleware
var verifySuperAdmin = require("../../middleware/verifySuperAdmin");
var passport = require("passport");
require("../../middleware/passportJwt")(passport);

// Register a brand admin
router.post(
  "/register-brand-admin",
  passport.authenticate("jwt", { session: false }),
  verifySuperAdmin,
  function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var brand = req.body.brand;

    //TODO: validations

    //Hashing the password
    bcrypt.hash(password, 10).then(function (hashedPassword) {
      // create new user
      User.create({
        name: name,
        email: email,
        password: hashedPassword,
        roles: ["brand_admin"],
        permissions: [],
        brand: brand,
        isSuperAdmin: false,
        isBrandAdmin: true,
        isBrandUser: false,
      })
        .then(function (user) {
          res.status(201).json({ status: "success", data: user });
        })
        .catch(function (error) {
          res.status(500).json({ status: "error", data: error });
        });
    });
  }
);

// Register a brand
router.post(
  "/register-brand",
  passport.authenticate("jwt", { session: false }),
  verifySuperAdmin,
  function (req, res) {
    var name = req.body.name;
    var logoUrl = req.body.logoUrl;

    // Brand.find({name: name, isDeleted: true}).then()

    Brand.create({
      name: name,
      logoUrl: logoUrl,
    })
      .then(function (brand) {
        res.status(201).json({ status: "success", data: brand });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// reset password
router.post(
  "/reset-password",
  passport.authenticate("jwt", { session: false }),
  verifySuperAdmin,
  function (req, res) {
    var email = req.user.email;
    var currentPassword = req.body.currentPassword;
    var newPassword = req.body.newPassword;

    // find account
    User.findOne({ email: email })
      .lean()
      .then(function (user) {
        // check if password already reset
        if (user.didPasswordReset) {
          return res
            .status(400)
            .json({ status: "error", data: "Password has been reset already" });
        }

        // check if current password is correct
        bcrypt.compare(currentPassword, user.password).then(function (isValid) {
          // if correct
          if (isValid) {
            // hash new password
            bcrypt.hash(newPassword, 10).then(function (hashedPassword) {
              // set new password
              User.updateOne(
                { email: email },
                {
                  password: hashedPassword,
                  didPasswordReset: true,
                }
              ).then(function (user) {
                res.status(200).json({ status: "success", data: user });
              });
            });
          } else
            return res
              .status(400)
              .json({ status: "error", data: "Invalid current password" });
        });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

module.exports = router;
