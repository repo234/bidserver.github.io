var mongoose = require("mongoose");

var bidHistorySchema = mongoose.Schema({
  image: String,
  name: String,
  price: Number,
  totalBids: Number,
  auctioned: String,
  status: String,
  paymentStatus: String,
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  winningDate: {
    type: Date,
    default: Date.now(),
  },
});
var BidHistory = mongoose.model("BidHistory", bidHistorySchema);

module.exports.BidHistory = BidHistory;
