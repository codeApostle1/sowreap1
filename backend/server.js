const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/auth", authRoutes);
app.use("/payment", paymentRoutes);

const path = require("path");

// Serve frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));


app.listen(5000, "0.0.0.0" , () => console.log("Server running on 5000"));