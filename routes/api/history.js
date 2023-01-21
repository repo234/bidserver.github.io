var express = require("express");
var router = express.Router();
var { BidHistory } = require("../../models/bidhistory");

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
        paymentStatus: req.body.paymentStatus,
      }
    );

    res.json("ended");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

module.exports = router;
