exports.isseller = (req, res, next) => {
  if (req.user.role != "seller") {
    return res.status(400).json({ message: "access denied" });
  }
  next();
};
