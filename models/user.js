var mongoose = require("mongoose");
const Joi = require("@hapi/joi");

var userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["customer", "seller", "admin"],
  },

  terms: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
var User = mongoose.model("User", userSchema);
function validateUser(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().min(5).required(),
    password: Joi.string().min(4).required(),
    role: Joi.string().max(10).required(),
    terms: Joi.boolean().required(),
  });
  return schema.validate(data, { abortEarly: false });
}
function validateUserLogin(data) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).required(),
    password: Joi.string().min(4).max(10).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.User = User;
module.exports.validate = validateUser;
module.exports.validateUserLogin = validateUserLogin;
