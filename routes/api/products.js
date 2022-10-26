var express = require("express");
var router = express.Router();
var { Product, validateProduct } = require("../../models/product");
var { auth } = require("../../middelware/auth");
var { isseller } = require("../../middelware/isseller");
var multer = require("multer");
var shortid = require("shortid");

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.orignalname);
  },
});

const upload = multer({ storage });
router.post(
  "/create",
  auth,
  isseller,
  upload.array("productPic"),
  async (req, res) => {
    let { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    } else {
      let productPic = [];
      if (req.files.length > 0) {
        productPic = req.files.map((file) => {
          return { img: file.filename };
        });
      }
      const product = new Product();
      product.name = req.body.name;
      product.price = req.body.price;
      product.quantity = req.body.quantity;
      product.bidDuration = req.body.bidDuration;
      product.discription = req.body.discription;
      product.condition = req.body.condition;
      product.productPics = productPic;
      product.sellerId = req.user._id;
      product.categoryName = req.body.categoryName;
      await product.save();
      return res.send(product);
    }
  }
);
module.exports = router;
