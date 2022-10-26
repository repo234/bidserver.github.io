var express = require("express");
var router = express.Router();
var { Product, validateProduct } = require("../../models/product");

router.post("/create", async (req, res) => {
  let product = await Product.findOne({ id: req.body._id });
  if (product) return res.status(400).send("Product already exist");
  let { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    product = new Product();
    product.name = req.body.name;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.active = req.body.active;
    product.bidDuration = req.body.bidDuration;
    product.discription = req.body.discription;
    product.condition = req.body.condition;
    await category.save();
    return res.send(category);
  }
});
module.exports = router;
