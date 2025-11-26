const express = require("express");
const Payment = require("../models/Payment");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// USER ADDS PAYMENT
router.post("/add", auth, async (req, res) => {
  const { amount, note } = req.body;
  const pay = await Payment.create({
    user: req.user.id,
    amount,
    note
  });
  res.json({ msg: "Payment submitted, waiting approval" });
});

// ADMIN APPROVES PAYMENT
router.put("/approve/:id", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Not admin" });

  await Payment.findByIdAndUpdate(req.params.id, { approved: true });
  res.json({ msg: "Approved" });
});

// ADMIN REJECTS PAYMENT
router.delete("/reject/:id", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Not admin" });

  await Payment.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

// USER GET PERSONAL HISTORY
router.get("/history", auth, async (req, res) => {
  const payments = await Payment.find({ user: req.user.id });
  res.json(payments);
});

// ADMIN GET ALL PAYMENTS
router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Not admin" });

  const payments = await Payment.find().populate("user", "name");
  res.json(payments);
});

// RESET ALL RECORDS
router.delete("/reset", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Not admin" });

  await Payment.deleteMany({});
  res.json({ msg: "All records reset" });
});

module.exports = router;