var express = require("express");
var router = express.Router();
var { Product, validateProduct } = require("../../models/product");
var { Auction } = require("../../models/auction");
var { auth } = require("../../middelware/auth");
var { isuser } = require("../../middelware/isuser");
var multer = require("multer");
var shortid = require("shortid");
const path = require("path");

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
  isuser,
  upload.array("images"),
  async (req, res) => {
    let { error } = validateProduct(req.body);
    if (error) {
      return res.send(error.details[0].message);
    } else {
      let images = [];
      if (req.files.length > 0) {
        images = req.files.map((file) => {
          return { img: file.filename };
        });
      }

      const product = new Product();

      product.name = req.body.name;
      product.price = req.body.price;
      product.quantity = req.body.quantity;
      product.time = req.body.time;
      product.weight = req.body.weight;
      product.createdDate;
      product.discription = req.body.discription;
      product.condition = req.body.condition;
      product.images = images;
      product.active = req.body.active;
      product.currentPrice = product.price;
      product.userId = req.user._id;
      product.used = req.body.used;
      product.categoryId = req.body.categoryId;
      product.duration = 0;
      product.auctionId = null;
      await product.save();
      return res.json("product created successfully");
    }
  }
);

//get all products
router.get("/", async (req, res) => {
  let products = await Product.find({});

  if (!products) return res.json("no product found");

  if (products) {
    res.json({ products });
  }
});

//get all products on auction
router.get("/auctionedproducts", async (req, res) => {
  const products = await Product.find({}).where("active").equals(true);
  if (products) {
    res.send({ products });
  }
  if (!products) {
    res.send("no products on auction");
  }
});

//get inactive products
router.get("/inactive/:id", async (req, res) => {
  let products = await Product.find({ userId: req.params.id })
    .where("active")
    .equals(false);

  if (!products) return res.json("no product found");

  if (products) {
    res.json({ products });
  }
});

//find single product by id
router.get("/:_id", async (req, res) => {
  let product = await Product.findById(req.params._id);
  if (!product) return res.json("no product found");

  if (product) {
    res.json(product);
  }
});

//find active product by user id
router.get("/user/:id", async (req, res) => {
  const products = await Product.find({ userId: req.params.id })
    .where("active")
    .equals(true);
  if (products) {
    res.send({ products });
  }
  if (!products) {
    res.send("no products found");
  }
});

//delete product
router.delete("/product/:_id", async (req, res) => {
  Product.findByIdAndDelete(req.params._id).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      console.log(product);
      res.json("product deleted");
    }
  });
});

//active auction
router.patch("/active/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  const auction = Auction.findById(product.auctionId)
    .where("endAuction")
    .equals(false);
  let date = new Date();
  let dura = new Date().setHours(date.getHours() + Number(product.time));
  let dur = dura - date;
  let duration = Date.now() + dur;
  try {
    let result = await Product.findByIdAndUpdate(req.params.id, {
      active: true,
      duration: duration,
      auctionId: auction._id,
    });

    res.send("product activated");
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

//deactive auction
router.patch("/deactive/:id", async (req, res) => {
  try {
    let result = await Product.findByIdAndUpdate(req.params.id, {
      active: false,
      duration: 0,
      auctionId: null,
    });
    res.send("product deactivated");
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
});

//update product
router.put("/update/:id", async (req, res) => {
  console.log(req.body);
  res.send(req.body.form);
});

module.exports = router;
