var express = require("express");
var router = express.Router();
var { Product, validateProduct } = require("../../models/product");
var { auth } = require("../../middelware/auth");
var { isseller } = require("../../middelware/isseller");
var multer = require("multer");
var shortid = require("shortid");
const path = require("path");
const { id } = require("@hapi/joi/lib/base");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(path.dirname(path.join(path.dirname(__dirname))), "uploads")
    );
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

//create product
router.post(
  "/create",
  auth,
  isseller,
  upload.array("images"),
  async (req, res) => {
    let { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    } else {
      let images = [];
      if (req.files.length > 0) {
        images = req.files.map((file) => {
          return { img: file.filename };
        });
      }
      let currentPrice = (req.body.price / 100) * 110;
      let date = new Date();

      let duration = new Date().setHours(
        date.getHours() + Number(req.body.time)
      );
      let dur = duration - date;
      let dura = Date.now() + dur;
      console.log({ date, duration, dur });
      const product = new Product();

      product.name = req.body.name;
      product.price = req.body.price;
      product.quantity = req.body.quantity;
      product.time = req.body.time;
      product.createdDate;
      product.discription = req.body.discription;
      product.condition = req.body.condition;
      product.images = images;
      product.currentPrice = currentPrice;
      product.sellerId = req.user._id;
      product.categoryId = req.body.categoryId;
      product.duration = dura;
      await product.save();
      return res.json("product created successfully");
    }
  }
);

//get all products
router.get("/", async (req, res) => {
  Product.find({}).exec((error, products) => {
    if (!products) return res.json("no product found");
    if (error) return res.status(400).json({ error });
    if (products) {
      res.json({ products });
    }
  });
});
//find product by id
router.get("/:_id", async (req, res) => {
  console.log(req.params._id);

  Product.findById(req.params._id).exec((error, product) => {
    if (!product) return res.json("no product found");
    if (error) return res.status(400).json({ error });
    if (product) {
      res.json({ product });
    }
  });
});
//find product by seller id
router.get("/seller/:sellerid", async (req, res) => {
  const products = await Product.find({ sellerId: req.params.sellerid });
  if (products) {
    res.send({ products });
  }
  if (!products) {
    res.send("no products found");
  }
});

router.get("/auctioned/:sellerid", async (req, res) => {
  const products = await Product.find({ sellerId: req.params.sellerid })
    .where("active")
    .equals("true");
  if (products) {
    res.json({ products });
  } else {
    res.json("no products found");
  }
});

router.delete("/product/:_id", async (req, res) => {
  Product.findByIdAndDelete(req.params._id).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      console.log(product);
      res.json("product deleted");
    }
  });
});

router.put("/bid/:_id", async (req, res) => {
  Product.findByIdAndUpdate(
    req.params._id,
    { userId: req.body._id, bidAmount: req.body.value, bidTime: Date.now() },
    { new: true }
  ).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.json({ product });
    }
  });
});
module.exports = router;
