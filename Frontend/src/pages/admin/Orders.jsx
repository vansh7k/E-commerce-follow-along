import React, { useState, useEffect } from "react";
import API from "../../api";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import Toast from "../../components/Toast";
import { useToastStore } from "../../store/toastStore";

const Orders = () => {
  const addToast = useToastStore((state) => state.addToast);

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders"); // Admin endpoint fetches all orders
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching admin orders:", err);
      addToast("Failed to load orders list.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { status: newStatus });
      addToast("ORDER STATUS UPDATED", "success");
      // Update state local list
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Failed to update status:", err);
      addToast("Failed to update order status.", "error");
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  // Filter orders by active status tab
  const filteredOrders = orders.filter((o) => {
    if (activeTab === "all") return true;
    return o.status?.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="page-container" style={{ backgroundColor: "var(--void)" }}>
      <Navbar />
      <Toast />

      <div style={{ display: "flex", flex: 1 }}>
        <AdminSidebar />

        <div style={{ flex: 1, padding: "40px" }} className="admin-content">
          <h1 style={{ fontSize: "2.5rem", marginBottom: "32px" }}>ORDERS PANEL</h1>

          {/* Status Tabs Filters */}
          <div style={{
            display: "flex",
            gap: "16px",
            borderBottom: "1px solid var(--ash)",
            marginBottom: "32px",
            overflowX: "auto",
            paddingBottom: "8px"
          }}>
            {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  color: activeTab === tab ? "var(--ember)" : "var(--dust)",
                  borderBottom: activeTab === tab ? "2px solid var(--ember)" : "none",
                  paddingBottom: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="font-mono text-sm" style={{ color: "var(--dust)" }}>RETRIEVING ORDER REGISTERS...</div>
          ) : filteredOrders.length === 0 ? (
            <p className="font-mono text-sm" style={{ color: "var(--dust)" }}>NO ORDERS FOUND UNDER THIS FILTER.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--ash)", textAlign: "left", color: "var(--dust)" }}>
                    <th style={{ padding: "12px" }}>ORDER ID</th>
                    <th style={{ padding: "12px" }}>DATE</th>
                    <th style={{ padding: "12px" }}>CUSTOMER</th>
                    <th style={{ padding: "12px" }}>ITEMS</th>
                    <th style={{ padding: "12px" }}>TOTAL</th>
                    <th style={{ padding: "12px" }}>STATUS</th>
                    <th style={{ padding: "12px" }}>UPDATE STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o._id} style={{ borderBottom: "1px solid var(--ash)" }}>
                      <td style={{ padding: "12px", fontWeight: "bold" }}>
                        <Link to={`/account/orders/${o._id}`} style={{ textDecoration: "underline", color: "var(--bone)" }}>
                          {o._id.substring(0, 10).toUpperCase()}...
                        </Link>
                      </td>
                      <td style={{ padding: "12px" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "12px" }}>
                        <div>{o.user?.name || "N/A"}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--dust)" }}>{o.user?.email || ""}</div>
                      </td>
                      <td style={{ padding: "12px" }}>{o.items.reduce((sum, item) => sum + item.qty, 0)}</td>
                      <td style={{ padding: "12px", color: "var(--ember)", fontWeight: "bold" }}>{formatPrice(o.total)}</td>
                      <td style={{ padding: "12px" }}>
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td style={{ padding: "12px" }}>
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className="input-brutalist"
                          style={{
                            padding: "4px 8px",
                            fontSize: "0.8rem",
                            width: "140px",
                            border: "1px solid var(--ash)",
                            backgroundColor: "var(--ash)"
                          }}
                        >
                          <option value="pending">PENDING</option>
                          <option value="confirmed">CONFIRMED</option>
                          <option value="shipped">SHIPPED</option>
                          <option value="delivered">DELIVERED</option>
                          <option value="cancelled">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Orders;
