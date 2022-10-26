exports.isadmin = (req, res, next) => {
  if (req.user.role != "admin") {
    return res.status(400).json({ message: "access denied" });
  }
  next();
};
