var express = require("express");
const { Auction } = require("../../models/auction");
var router = express.Router();
var { BidHistory } = require("../../models/bidhistory");
const { Product } = require("../../models/product");
const { User } = require("../../models/user");

router.post("/bidhistory", async (req, res) => {
  console.log(req.body.data);
  const bidHistory = new BidHistory();

  bidHistory.image = req.body.data.image;
  bidHistory.name = req.body.data.name;
  bidHistory.price = req.body.data.price;
  bidHistory.totalBids = req.body.data.totalBids;
  bidHistory.auctioned = req.body.data.auctioned;
  bidHistory.status = req.body.data.status;
  bidHistory.paymentStatus = req.body.data.paymentStatus;
  bidHistory.userId = req.body.data.userId;
  bidHistory.auctionId = req.body.data.auctionId;
  await bidHistory.save();
  res.send("history added");
});

router.get("/bidhistory/:id", async (req, res) => {
  try {
    let bidHistory = await BidHistory.find({ userId: req.params.id })
      .where("auctioned")
      .equals("end");

    if (!bidHistory) return res.json("");

    if (bidHistory) {
      res.json(bidHistory.reverse());
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/bidhistory/progress/:id", async (req, res) => {
  try {
    let bidHistory = await BidHistory.find({ userId: req.params.id })
      .where("auctioned")
      .equals("in progress");

    if (!bidHistory) return res.json("");

    if (bidHistory) {
      res.json(bidHistory.reverse());
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/bidhistory/unpaid/:id", async (req, res) => {
  try {
    let bidHistory = await BidHistory.find({
      userId: req.params.id,
      status: "won",
      paymentStatus: "unpaid",
    });

    if (!bidHistory) return res.json("");

    if (bidHistory) {
      res.json(bidHistory.reverse());
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/bidhistory/update", async (req, res) => {
  try {
    const history = await BidHistory.findOneAndUpdate(
      {
        userId: req.body.user,
        auctionId: req.body.auctionId,
      },
      {
        price: req.body.price,
        totalBids: req.body.totalBids,
      }
    );

    res.json(history);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.put("/bidhistory/end", async (req, res) => {
  try {
    const buyer = await User.findById(req.body.user);
    const auction = await Auction.findById(req.body.auctionId);
    const seller = await User.findById(auction.userId);
    const product = await Product.findById(auction.productId);
    let ts = Date.now();
    let date_time = new Date(ts);
    let date = date_time.getDate();
    let expiry = date + 1;
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();
    let hours = date_time.getHours();
    let minutes = date_time.getMinutes();
    let seconds = date_time.getSeconds();
    let winngDate =
      year +
      "-" +
      month +
      "-" +
      date +
      "," +
      hours +
      "-" +
      minutes +
      "-" +
      seconds;
    let expiryDate =
      year +
      "-" +
      month +
      "-" +
      expiry +
      "," +
      hours +
      "-" +
      minutes +
      "-" +
      seconds;
    let datee = new Date();
    let dura = new Date().setHours(datee.getHours() + Number(24));
    let dur = dura - datee;
    let duration = Date.now() + dur;
    console.log(duration);
    const shipping = 0;
    if (req.body.status === "won") {
      if (product.weight > 0 && product.weight < 0.5) {
        if (seller.city === buyer.city) {
          shipping = 80;
        } else if (
          seller.city != buyer.city &&
          seller.province == buyer.province
        ) {
          shipping = 100;
        } else if (
          seller.city != buyer.city &&
          seller.province != buyer.province
        ) {
          shipping = 120;
        }
      } else if (product.weight > 0.5 && product.weight < 1) {
        if (seller.city === buyer.city) {
          shipping = 120;
        } else if (
          seller.city != buyer.city &&
          seller.province == buyer.province
        ) {
          shipping = 140;
        } else if (
          seller.city != buyer.city &&
          seller.province != buyer.province
        ) {
          shipping = 150;
        } else if (product.weight > 1 && product.weight < 2) {
          if (seller.city === buyer.city) {
            shipping = 140;
          } else if (
            seller.city != buyer.city &&
            seller.province == buyer.province
          ) {
            shipping = 170;
          } else if (
            seller.city != buyer.city &&
            seller.province != buyer.province
          ) {
            shipping = 190;
          } else if (product.weight > 2 && product.weight < 4) {
            if (seller.city === buyer.city) {
              shipping = 180;
            } else if (
              seller.city != buyer.city &&
              seller.province == buyer.province
            ) {
              shipping = 250;
            } else if (
              seller.city != buyer.city &&
              seller.province != buyer.province
            ) {
              shipping = 310;
            } else if (product.weight > 4 && product.weight < 8) {
              if (seller.city === buyer.city) {
                shipping = 200;
              } else if (
                seller.city != buyer.city &&
                seller.province == buyer.province
              ) {
                shipping = 290;
              } else if (
                seller.city != buyer.city &&
                seller.province != buyer.province
              ) {
                shipping = 390;
              } else if (product.weight > 8 && product.weight < 18) {
                if (seller.city === buyer.city) {
                  shipping = 690;
                } else if (
                  seller.city != buyer.city &&
                  seller.province == buyer.province
                ) {
                  shipping = 840;
                } else if (
                  seller.city != buyer.city &&
                  seller.province != buyer.province
                ) {
                  shipping = 990;
                } else if (product.weight > 18 && product.weight < 25) {
                  if (seller.city === buyer.city) {
                    shipping = 890;
                  } else if (
                    seller.city != buyer.city &&
                    seller.province == buyer.province
                  ) {
                    shipping = 1350;
                  } else if (
                    seller.city != buyer.city &&
                    seller.province != buyer.province
                  ) {
                    shipping = 1800;
                  } else if (product.weight > 25 && product.weight < 35) {
                    if (seller.city === buyer.city) {
                      shipping = 1400;
                    } else if (
                      seller.city != buyer.city &&
                      seller.province == buyer.province
                    ) {
                      shipping = 2800;
                    } else if (
                      seller.city != buyer.city &&
                      seller.province != buyer.province
                    ) {
                      shipping = 4200;
                    } else if (product.weight > 35 && product.weight < 55) {
                      if (seller.city === buyer.city) {
                        shipping = 1990;
                      } else if (
                        seller.city != buyer.city &&
                        seller.province == buyer.province
                      ) {
                        shipping = 3190;
                      } else if (
                        seller.city != buyer.city &&
                        seller.province != buyer.province
                      ) {
                        shipping = 4290;
                      }
                    } else if (product.weight > 55 && product.weight < 90) {
                      if (seller.city === buyer.city) {
                        shipping = 3990;
                      } else if (
                        seller.city != buyer.city &&
                        seller.province == buyer.province
                      ) {
                        shipping = 5490;
                      } else if (
                        seller.city != buyer.city &&
                        seller.province != buyer.province
                      ) {
                        shipping = 6990;
                      } else if (product.weight > 90) {
                        if (seller.city === buyer.city) {
                          shipping = 4990;
                        } else if (
                          seller.city != buyer.city &&
                          seller.province == buyer.province
                        ) {
                          shipping = 9990;
                        } else if (
                          seller.city != buyer.city &&
                          seller.province != buyer.province
                        ) {
                          shipping = 9990;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (req.body.status === "won") {
    }
    const history = await BidHistory.findOneAndUpdate(
      {
        userId: req.body.user,
        auctionId: req.body.auctionId,
      },
      {
        price: req.body.price,
        totalBids: req.body.totalBids,
        auctioned: "end",
        status: req.body.status,
        shipping: shipping,
        paymentStatus: req.body.paymentStatus,
        duration: duration,
        winningDate: req.body.status === "won" ? winngDate : "",
        expirationDate: req.body.status === "won" ? expiryDate : "",
      }
    );

    res.json("ended");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

module.exports = router;
