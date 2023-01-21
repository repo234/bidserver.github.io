var mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  endAuction: {
    type: Boolean,
  },
  currentBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  currentPrice: Number,
  bids: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      bidAmount: Number,
      bidTime: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});
var Auction = mongoose.model("Auction", auctionSchema);
module.exports.Auction = Auction;
