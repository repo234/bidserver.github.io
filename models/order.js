var mongoose = require("mongoose");

var orderSchema = mongoose.Schema({
  image: String,
  name: String,
  price: Number,
  totalBids: Number,
  auctioned: String,
  status: String,
  orderstatus: "Unpaid",
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});
var BidHistory = mongoose.model("orderHistory", orderSchema);

module.exports.BidHistory = BidHistory;
