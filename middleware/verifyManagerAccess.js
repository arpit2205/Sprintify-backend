function verifyManagerAccess(req, res, next) {
  var user = req.user;

  if (user.roles.indexOf("manager") === -1) {
    return res.status(403).json({
      status: "error",
      message: "Access denied",
    });
  }

  return next();
}

module.exports = verifyManagerAccess;
