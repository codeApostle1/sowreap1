const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// SIGN UP
router.post("/signup", async (req, res) => {
  const { name, password } = req.body;
  let role = "user";

  if (name === "Joel" || name === "Ademola") {
    role = "admin"; // simple algorithm to make you admin
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, password: hashed, role });
  res.json({ msg: "Account created" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });
  if (!user) return res.json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user._id, role: user.role }, "secret123");
  res.json({ token, role: user.role });
});

module.exports = router;