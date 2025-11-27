const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" } // "admin" or "user"
});

module.exports = mongoose.model("User", userSchema);