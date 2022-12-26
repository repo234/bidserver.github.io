exports.iscustomer = (req, res, next) => {
  if (req.user.role != "customer") {
    return res.json({ message: "access denied" });
  }
  next();
};
