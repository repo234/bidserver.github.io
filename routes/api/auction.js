var express = require("express");
var router = express.Router();
var { Auction } = require("../../models/auction");
var { auth } = require("../../middelware/auth");
var { isseller } = require("../../middelware/isseller");
var { Product } = require("../../models/product");

//create auction
router.post("/create/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  let currentDate = new Date();
  let duration = currentDate.setHours(currentDate.getHours() + product.time);

  const auction = new Auction();
  auction.sellerId = product.sellerId;
  auction.productId = req.params.id;
  auction.currentDate = currentDate;
  auction.duration = duration;
  await auction.save();
  return res.send({
    message: "auction created successfully",
    auction: auction,
    product: product,
  });
});

router.get("/duration/:id", async (req, res) => {
  const auction = await Auction.find({ productId: req.params.id })
    .sort({ _id: -1 })
    .limit(1);
  if (!auction) res.json("not on auction");
  if (auction) {
    return res.send({ auction });
  }
});
module.exports = router;
