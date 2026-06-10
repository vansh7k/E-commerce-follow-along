import React, { useState, useEffect } from "react";
import API from "../../api";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import Toast from "../../components/Toast";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersToday: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/stats");
        if (res.data) {
          setStats(res.data.stats || {});
          setLowStock(res.data.lowStockProducts || []);
          setRecentOrders(res.data.recentOrders || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="page-container" style={{ backgroundColor: "var(--void)" }}>
      <Navbar />
      <Toast />

      <div style={{ display: "flex", flex: 1 }}>
        <AdminSidebar />

        <div style={{ flex: 1, padding: "40px" }} className="admin-content">
          <h1 style={{ fontSize: "2.5rem", marginBottom: "32px" }}>OVERVIEW</h1>

          {loading ? (
            <div className="font-mono text-sm" style={{ color: "var(--dust)" }}>RETRIEVING SYSTEM METRICS...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              
              {/* KPI Cards Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "24px"
                }}
              >
                {[
                  { title: "TOTAL REVENUE", value: formatPrice(stats.totalRevenue), color: "var(--ember)" },
                  { title: "ORDERS TODAY", value: stats.ordersToday, color: "var(--bone)" },
                  { title: "TOTAL PRODUCTS", value: stats.totalProducts, color: "var(--bone)" },
                  { title: "CUSTOMERS COUNT", value: stats.totalCustomers, color: "var(--bone)" }
                ].map((card) => (
                  <div
                    key={card.title}
                    style={{
                      border: "1px solid var(--ash)",
                      backgroundColor: "var(--ash)",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px"
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--dust)" }}>
                      {card.title}
                    </span>
                    <span style={{ fontSize: "2.2rem", fontFamily: "var(--font-display)", color: card.color }}>
                      {card.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Split table Layout */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: "40px" }} className="admin-split">
                
                {/* Recent Orders */}
                <div>
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>RECENT ORDERS</h3>
                  {recentOrders.length === 0 ? (
                    <p className="font-mono text-sm" style={{ color: "var(--dust)" }}>NO RECENT ORDERS FILED.</p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid var(--ash)", textAlign: "left", color: "var(--dust)" }}>
                            <th style={{ padding: "12px" }}>ORDER ID</th>
                            <th style={{ padding: "12px" }}>CUSTOMER</th>
                            <th style={{ padding: "12px" }}>TOTAL</th>
                            <th style={{ padding: "12px" }}>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((o) => (
                            <tr key={o._id} style={{ borderBottom: "1px solid var(--ash)" }}>
                              <td style={{ padding: "12px" }}>{o._id.substring(0, 8)}...</td>
                              <td style={{ padding: "12px" }}>{o.user?.name || "N/A"}</td>
                              <td style={{ padding: "12px", color: "var(--ember)" }}>{formatPrice(o.total)}</td>
                              <td style={{ padding: "12px" }}>
                                <OrderStatusBadge status={o.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Low Stock Warnings */}
                <div>
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>LOW STOCK</h3>
                  {lowStock.length === 0 ? (
                    <p className="font-mono text-sm" style={{ color: "var(--dust)" }}>ALL ITEMS WELL STOCKED.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {lowStock.map((prod) => (
                        <div
                          key={prod._id}
                          style={{
                            border: "1px solid var(--ash)",
                            padding: "16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <div>
                            <p style={{ margin: 0, fontSize: "1.1rem" }}>{prod.name}</p>
                            <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--dust)" }}>
                              SKU: {prod.sku || "N/A"}
                            </p>
                          </div>
                          <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                            color: prod.stock === 0 ? "#ff3333" : "var(--ember)"
                          }}>
                            {prod.stock === 0 ? "SOLD OUT" : `${prod.stock} LEFT`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .admin-content {
            padding: 24px !important;
          }
          .admin-split {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
