function verifySuperAdmin(req, res, next) {
  var user = req.user;

  if (!user.isSuperAdmin) {
    return res.status(403).json({
      status: "error",
      message: "Access denied",
    });
  }

  return next();
}

module.exports = verifySuperAdmin;
