const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Route files
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");
const categoryRoutes = require("./routes/category.route");
const orderRoutes = require("./routes/order.route");
const wishlistRoutes = require("./routes/wishlist.route");
const reviewRoutes = require("./routes/review.route");
const adminRoutes = require("./routes/admin.route");
const stripeRoutes = require("./routes/stripe.route");

// Controller for webhook raw parsing
const { handleWebhook } = require("./controller/stripe.controller");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for multiple origins (local and deployed)
const allowedOrigins = [
  "http://localhost:5173",
  "https://glistening-capybara-a5e62f.netlify.app"
];
if (process.env.CLIENT_URL) {
  const envOrigins = process.env.CLIENT_URL.split(",").map(o => o.trim());
  allowedOrigins.push(...envOrigins);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

// 1. Stripe Webhook mounted BEFORE express.json() to preserve raw body signature
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleWebhook);

// 2. Global JSON and URL encoded body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images/files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount API routers
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stripe", stripeRoutes);

// MongoDB connection
const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/maverick-streetwear";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected successfully.");
    app.listen(PORT, () => {
      console.log(`MAVERICK Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
