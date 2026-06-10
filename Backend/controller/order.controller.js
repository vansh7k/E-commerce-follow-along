const Order = require("../model/order.model");
const Product = require("../model/product.model");

// Create Order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, stripePaymentId, total } = req.body;

    if (!items || items.length === 0 || !shippingAddress || !total) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Verify stock and update product/variant stocks
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      // Deduct main stock
      product.stock = Math.max(0, product.stock - item.qty);

      // Deduct variant stock
      if (item.size) {
        const variant = product.variants.find(v => v.size === item.size);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.qty);
        }
      }

      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      stripePaymentId,
      total
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};

// Get My Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Get Single Order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify that the requester is either the owner or an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};

// Admin: Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Admin: Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
