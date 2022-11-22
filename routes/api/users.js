var express = require("express");
var router = express.Router();
var { User, validate, validateUserLogin } = require("../../models/user");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
//user registration
router.post("/register", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.send("User with given Email already exist");
  let { error } = validate(req.body);
  if (error) {
    return res.send(error.details[0].message);
  } else {
    user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role;
    user.terms = req.body.terms;
    user.password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
    await user.save();
    return res.send("registered successfully");
  }
});

//user login
router.post("/login", async (req, res) => {
  let { error } = validateUserLogin(req.body);
  if (error) return res.send({ message: error.details[0].message });
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.send({ message: "User Not Registered" });
  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.send({ message: "Invalid Password" });
  let token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role },
    config.get("jwtPrivateKey")
  );
  res.send({
    status: "Logged in successfully",
    data: token,
    user: user,
  });
});

//get all sellers
router.get("/sellers", async (req, res) => {
  let users = await User.find({ role: "seller" });
  return res.send(users);
});

//get all customers

module.exports = router;
