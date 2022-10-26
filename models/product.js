var mongoose = require("mongoose");
const Joi = require("@hapi/joi");

var productSchema = mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  active: { type: Boolean, default: true },
  bidDuration: Number,
  createdDate: {
    type: Date,
    default: Date.now,
  },
  discription: String,
  condition: String,
  productPics: [{ img: { type: String } }],
  reviews: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", review: String },
  ],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  categoryName: String,
});
var Product = mongoose.model("Product", productSchema);
function validateProduct(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    price: Joi.number().integer().min(0).max(50000).required(),
    quantity: Joi.number().integer().required(),
    bidDuration: Joi.number().integer().min(1).max(7).required(),
    discription: Joi.string().required(),
    condition: Joi.string().required(),
    categoryName: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.Product = Product;
module.exports.validateProduct = validateProduct;
