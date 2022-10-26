var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var userSchema = mongoose.Schema({
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  adminId: String,
  adminName: String,
});
var Category = mongoose.model("Category", userSchema);
function validateCategory(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.Category = Category;
module.exports.validateCategory = validateCategory;
