var mongoose = require("mongoose");
const Joi = require("@hapi/joi");

var productSchema = mongoose.Schema({
  name: String,
  used: String,
  price: Number,
  duration: Number,
  quantity: Number,
  time: Number,
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  weight: Number,
  discription: String,
  condition: String,
  images: [{ img: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
  active: Boolean,
});
var Product = mongoose.model("Product", productSchema);
function validateProduct(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    price: Joi.number().integer().min(100).max(50000).required(),
    quantity: Joi.number().integer().required(),
    time: Joi.number().integer().min(1).max(4320).required(),
    weight: Joi.number().required(),
    discription: Joi.string().required(),
    condition: Joi.string().required(),
    categoryId: Joi.string().required(),
    active: Joi.boolean(),
    used: Joi.string().required(),
    duration: Joi.number(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.Product = Product;
module.exports.validateProduct = validateProduct;
