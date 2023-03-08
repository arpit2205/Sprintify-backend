var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;

// user model
var User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      function (jwt_payload, next) {
        User.findOne({ email: jwt_payload.email }, function (err, user) {
          if (err) {
            return next(err, false);
          } else if (user) {
            return next(null, user);
          } else return next(null, false);
        });
      }
    )
  );
};
