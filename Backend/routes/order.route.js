const express = require("express");
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require("../controller/order.controller");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", createOrder);
router.get("/mine", getMyOrders);
router.get("/:id", getOrderById);

// Admin-only endpoints
router.get("/", adminOnly, getAllOrders);
router.patch("/:id/status", adminOnly, updateOrderStatus);

module.exports = router;
