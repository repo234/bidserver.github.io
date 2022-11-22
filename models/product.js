var mongoose = require("mongoose");
const Joi = require("@hapi/joi");

var productSchema = mongoose.Schema({
  name: String,
  price: Number,
  currentPrice: Number,
  quantity: Number,
  time: Number,
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  discription: String,
  condition: String,
  images: [{ img: String }],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  duration: {
    type: Number,
  },
  bids: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      bidAmount: Number,
      bidTime: Date,
    },
  ],
  currentPrice: Number,
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
var Product = mongoose.model("Product", productSchema);
function validateProduct(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    price: Joi.number().integer().min(1).max(50000).required(),
    quantity: Joi.number().integer().required(),
    time: Joi.number().integer().min(1).max(4320).required(),
    discription: Joi.string().required(),
    condition: Joi.string().required(),
    categoryId: Joi.string().required(),
    duration: Joi.number(),
    currentPrice: Joi.number(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.Product = Product;
module.exports.validateProduct = validateProduct;
