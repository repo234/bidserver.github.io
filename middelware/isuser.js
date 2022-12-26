exports.isuser = (req, res, next) => {
  if (req.user.role != "user") {
    return res.status(400).json({ message: "access denied" });
  }
  next();
};
