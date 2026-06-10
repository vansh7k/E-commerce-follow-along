import React, { useState, useEffect } from "react";
import API from "../../api";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import Toast from "../../components/Toast";
import { useToastStore } from "../../store/toastStore";

const Customers = () => {
  const addToast = useToastStore((state) => state.addToast);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/customers");
      setCustomers(res.data || []);
    } catch (err) {
      console.error("Error fetching customers list:", err);
      addToast("Failed to load customers list.", "error");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 style={{ fontSize: "2.5rem", marginBottom: "32px" }}>CUSTOMERS DIRECTORY</h1>

          {loading ? (
            <div className="font-mono text-sm" style={{ color: "var(--dust)" }}>RETRIEVING CUSTOMER SHEETS...</div>
          ) : customers.length === 0 ? (
            <p className="font-mono text-sm" style={{ color: "var(--dust)" }}>NO REGISTERED CUSTOMERS FOUND.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--ash)", textAlign: "left", color: "var(--dust)" }}>
                    <th style={{ padding: "12px" }}>CUSTOMER ID</th>
                    <th style={{ padding: "12px" }}>NAME</th>
                    <th style={{ padding: "12px" }}>EMAIL</th>
                    <th style={{ padding: "12px" }}>ORDERS PLACED</th>
                    <th style={{ padding: "12px" }}>TOTAL SPENT</th>
                    <th style={{ padding: "12px" }}>JOIN DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid var(--ash)" }}>
                      <td style={{ padding: "12px" }}>{c.id.substring(0, 10).toUpperCase()}...</td>
                      <td style={{ padding: "12px", fontWeight: "bold" }}>{c.name}</td>
                      <td style={{ padding: "12px" }}>{c.email}</td>
                      <td style={{ padding: "12px" }}>{c.ordersPlaced}</td>
                      <td style={{ padding: "12px", color: "var(--ember)", fontWeight: "bold" }}>{formatPrice(c.totalSpent)}</td>
                      <td style={{ padding: "12px" }}>{new Date(c.joinedDate).toLocaleDateString()}</td>
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

export default Customers;
