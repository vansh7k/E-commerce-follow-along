const User = require("../model/user.model");
const Product = require("../model/product.model");
const Order = require("../model/order.model");

// Admin dashboard statistics
const getStats = async (req, res) => {
  try {
    // 1. Total Revenue (sum of all completed/pending orders)
    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // 2. Orders Today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const ordersToday = await Order.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    // 3. Total Products count
    const totalProducts = await Product.countDocuments();

    // 4. New Customers count
    const totalCustomers = await User.countDocuments({ role: "customer" });

    // 5. Low stock products (stock under 5, or any variant stock under 5)
    const lowStockProducts = await Product.find({
      $or: [
        { stock: { $lt: 5 } },
        { "variants.stock": { $lt: 5 } }
      ]
    }).populate("category");

    // 6. Recent Orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      stats: {
        totalRevenue,
        ordersToday,
        totalProducts,
        totalCustomers
      },
      lowStockProducts,
      recentOrders
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Error fetching admin stats", error: error.message });
  }
};

// Admin customers list
const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).select("name email createdAt");

    const customersWithOrderStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ user: customer._id });
        const ordersPlaced = orders.length;
        const totalSpent = orders
          .filter(o => o.status !== "cancelled")
          .reduce((sum, o) => sum + o.total, 0);

        return {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          joinedDate: customer.createdAt,
          ordersPlaced,
          totalSpent
        };
      })
    );

    res.status(200).json(customersWithOrderStats);
  } catch (error) {
    console.error("Admin customers list error:", error);
    res.status(500).json({ message: "Error fetching customers list", error: error.message });
  }
};

module.exports = { getStats, getCustomers };
