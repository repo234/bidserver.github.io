var mongoose = require("mongoose");
const Joi = require("@hapi/joi");

var userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  city: String,
  province: String,
  address: String,

  mobile: String,
  emailVarified: Boolean,
  role: {
    type: String,
  },

  terms: Boolean,
  resetPass: String,
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
    password: Joi.string().min(8).required(),
    province: Joi.string().required(),
    city: Joi.string().required(),
    address: Joi.string().required(),

    mobile: Joi.string().required(),
    role: Joi.string(),
    emailVarified: Joi.string(),
    terms: Joi.boolean().required(),
    resetPass: Joi.string(),
  });
  return schema.validate(data, { abortEarly: false });
}
function validateUserLogin(data) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).required(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.User = User;
module.exports.validate = validateUser;
module.exports.validateUserLogin = validateUserLogin;
