var express = require("express");
var router = express.Router();
var { User, validate, validateUserLogin } = require("../../models/user");
var bcrypt = require("bcryptjs");
var Token = require("../../models/token");
var { sendEmail } = require("../../utils/sendEmail");
const jwt = require("jsonwebtoken");
const config = require("config");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
//user registration
router.post("/register", async (req, res) => {
  console.log(req.body);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.send({ message: "User with given Email already exist" });
  let { error } = await validate(req.body);
  if (error) {
    return res.send({ message: error.details[0].message });
  } else {
    user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role;
    user.terms = req.body.terms;
    user.password = req.body.password;
    user.city = req.body.city;
    user.province = req.body.province;
    user.address = req.body.address;
    user.postal = req.body.postal;
    user.mobile = req.body.mobile;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
    user.emailVarified = false;
    await user.save();
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const html = `<h2> ${user.name}! Thanks for registering on our site</h2>
    <h4> Please verify your email to continue....</h4>
    <a href= "http://${req.headers.host}/api/users/${user._id}/verify/${token.token}">Verify your email</a>`;
    await sendEmail(user.email, "Bidbazaar - verify your email", html);

    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });

    /* var mailOptions = {
      from: "Verify your email <parsariaz123@gmail.com>",
      to: req.body.email,
      subject: "Bid bazaar - verify your email",
      html: `<h2> ${user.name}! Thanks for registering on our site</h2>
      <h4> Please verify your email to continue....</h4>
      <a href="http://${req.headers.host}/api/users/verify-email?token=${user.emailToken}">Verify your email</a>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        res.send(
          "register successfully a verifcation email send to your gmail account"
        );
      }
    });*/
  }
});

// mail
/*var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bidbazaar89@gmail.com",
    pass: "cvowokcdrogrxlrw",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.get("/verify-email", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = user.emailToken;
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await User.updateOne({ emailToken: null, emailVarified: true });
    await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});*/

router.get("/:id/verify/:token/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await user.updateOne({ emailVarified: true });
    await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log(error);
  }
});

//user login
router.post("/login", async (req, res) => {
  console.log(req.body);
  let { error } = validateUserLogin(req.body);
  if (error) return res.send({ message: error.details[0].message });
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.send({ message: "Invalid email" });
  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.send({ message: "Invalid Password" });
  if (!user.emailVarified) {
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `http://${req.headers.host}/api/users/${user._id}/verify/${token.token}`;
      await sendEmail(user.email, "Verify Email", url);
    }

    return res.send({ message: "An Email sent to your account please verify" });
  }
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
