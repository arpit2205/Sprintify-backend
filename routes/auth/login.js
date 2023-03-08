var express = require("express");
var router = express.Router();

var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

// Models
var User = require("../../models/user");

// login route
router.post("/login", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", data: "Enter username and password" });
  }

  //TODO: validations

  // find user
  User.findOne({ email: email, isDeleted: false })
    .lean()
    .then(function (user) {
      if (!user) {
        return res
          .status(400)
          .json({ status: "error", data: "Invalid username or password" });
      }

      // check password
      bcrypt.compare(password, user.password).then(function (isValid) {
        if (isValid) {
          // assign JWT
          var token = jwt.sign(
            {
              _id: user._id,
              email: user.email,
              name: user.name,
              isSuperAdmin: user.isSuperAdmin,
              isBrandAdmin: user.isBrandAdmin,
              isBrandUser: user.isBrandUser,
              brand: {
                name: user.brand.name,
                logoUrl: user.brand.logoUrl,
              },
            },
            process.env.JWT_SECRET
          );
          return res
            .status(200)
            .json({ status: "success", data: { token: token, user: user } });
        }

        return res
          .status(400)
          .json({ status: "error", data: "Invalid username or password" });
      });
    });
});

module.exports = router;
