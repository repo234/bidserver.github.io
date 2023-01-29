var mongoose = require("mongoose");

var bidHistorySchema = mongoose.Schema({
  image: String,
  name: String,
  price: Number,
  totalBids: Number,
  auctioned: String,
  status: String,
  paymentStatus: String,
  shipping: Number,
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  duration: Number,
  winningDate: {
    type: String,
  },
  expirationDate: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});
var BidHistory = mongoose.model("BidHistory", bidHistorySchema);

module.exports.BidHistory = BidHistory;
