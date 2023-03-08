function verifyBrandUser(req, res, next) {
  var user = req.user;

  if (!user.isBrandUser) {
    return res.status(403).json({
      status: "error",
      message: "Access denied",
    });
  }

  return next();
}

module.exports = verifyBrandUser;
