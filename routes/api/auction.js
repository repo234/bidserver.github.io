var express = require("express");
var router = express.Router();
var { Auction } = require("../../models/auction");
var { auth } = require("../../middelware/auth");
var { isuser } = require("../../middelware/isuser");
var { Product } = require("../../models/product");
var { User } = require("../../models/user");
var { sendEmail } = require("../../utils/sendEmail");
const io = require("../../socket");

//create auction
router.post("/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  const auction = new Auction();
  auction.userId = product.userId;
  auction.productId = req.params.id;
  auction.startDate = Date.now();
  auction.currentPrice = product.price;
  auction.endAuction = false;
  await auction.save();
  product.auctionId = auction._id;
  await product.save();
  return res.json({ message: "auction created", product });
});

//get auction details
router.get("/singleAuction/:id", async (req, res) => {
  const auction = await Auction.findById(req.params.id);

  if (!auction) res.json({ message: "not on auction" });
  if (auction) {
    return res.send({ auction });
  }
});
//get product and auction
router.get("/auction/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  const auction = await Auction.findById(product.auctionId)
    .where("endAuction")
    .equals(false);
  if (!auction) res.json({ message: "not on auction" });
  if (auction) {
    return res.send({ message: "auction created", auction, product });
  }
});
//auction ended
router.patch("/end/:id", auth, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    const product = await Product.findById(auction.productId);
    const users = await User.find({});

    const notification = [];
    auction.bids.forEach((bid) => {
      users.forEach((user) => {
        if (JSON.stringify(bid.userId) == JSON.stringify(user._id)) {
          notification.push({
            email: user.email,
            html: `<h2> dear ${user.name} ${
              JSON.stringify(user._id) === JSON.stringify(auction.winner)
                ? "Yippy"
                : "Ops"
            } !</h2>
          <h3>your ${
            JSON.stringify(user._id) === JSON.stringify(auction.winner)
              ? ` won `
              : ` lose `
          } the product:</h3>
          <h4>name: ${product.name}</h4>
          <h4>price:${product.price}</h4>
        <p>${
          JSON.stringify(user._id) === JSON.stringify(auction.winner)
            ? ` visit the website for checkout to get your winning product `
            : ` don't worry there are much more comming`
        }</p>
        <p>${
          JSON.stringify(user._id) === JSON.stringify(auction.winner)
            ? ` warning: if you don't pay within one day you may lose your winning`
            : ` better luck next time `
        }</p>`,
          });
        }
      });
    });
    notification.forEach((notify) => {
      sendEmail(notify.email, "Bidbazaar - your bid details ", notify.html);
    });
  } catch (error) {}

  let result = await Auction.findByIdAndUpdate(req.params.id, {
    endAuction: true,
  });
  res.send("auction ended");
});
//add bid
router.put("/bid/:id", auth, isuser, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    const product = await Product.findById(auction.productId);
    const users = await User.find({});

    if (!auction) return res.json("no product found");
    const percent = parseInt((5 / 100) * product.price);
    const increment = req.body.bid - auction.currentPrice;
    if (JSON.stringify(req.body.user) === JSON.stringify(product.userId)) {
      return res.json("you can't bid on your own product ");
    } else {
      if (req.body.bid <= auction.currentPrice) {
        return res.json("amount must be larger then current price");
      } else if (increment > percent) {
        return res.json(`you cannot increase more then ${percent} `);
      } else if (req.body.bid < auction.currentPrice) {
        return res.json(
          "bid amount is less, add price higher then current amount"
        );
      } else if (req.body.bid > auction.currentPrice) {
        auction.bids.push({
          bidAmount: req.body.bid,
          userId: req.body.user,
        });
        auction.currentPrice = req.body.bid;
        auction.winner = req.user._id;
        await auction.save();
        const data = {
          message: "bid added successfully",
          auction,
        };
        io.getIo().in().emit("newbid", data);
        const notification = [];
        auction.bids.forEach((bid) => {
          users.forEach((user) => {
            if (JSON.stringify(bid.userId) == JSON.stringify(user._id)) {
              notification.push({
                email: user.email,
                html: `<h2> ${
                  JSON.stringify(user._id) === JSON.stringify(auction.winner)
                    ? "Yippy"
                    : "Ops"
                } dear ${user.name} !</h2>
                <h3>your bid is  ${
                  JSON.stringify(user._id) === JSON.stringify(auction.winner)
                    ? ` highest `
                    : ` lower `
                } on the product:</h3>
                <h4>name: ${product.name}</h4>
                <h4>price:${product.price}</h4>
              <p>visit your auction on the website to see more details</p>`,
              });
            }
          });
        });
        notification.forEach((notify) => {
          sendEmail(notify.email, "Bidbazaar - your bid details ", notify.html);
        });
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
