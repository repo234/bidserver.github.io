const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/user");

exports.auth = (req, res, next) => {
  let token = req.header("x-auth-token");
  if (!token) return res.status(400).send("Token Not Provided");
  try {
    let user = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = user;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  next();
};
