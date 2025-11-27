const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  note: String,
  approved: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);