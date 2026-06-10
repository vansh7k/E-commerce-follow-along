import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "DASHBOARD", path: "/admin/dashboard", icon: "dashboard" },
    { name: "PRODUCTS", path: "/admin/products", icon: "inventory_2" },
    { name: "ORDERS", path: "/admin/orders", icon: "order_approve" },
    { name: "CUSTOMERS", path: "/admin/customers", icon: "group" },
  ];

  return (
    <div
      style={{
        width: "240px",
        backgroundColor: "var(--void)",
        borderRight: "1px solid var(--ash)",
        padding: "40px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        height: "calc(100vh - 80px)",
        position: "sticky",
        top: "80px"
      }}
    >
      <div>
        <h3 style={{ fontSize: "1.1rem", fontFamily: "var(--font-mono)", color: "var(--dust)", letterSpacing: "0.1em", marginBottom: "20px" }}>
          ADMIN MANAGEMENT
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "1rem",
                  fontFamily: "var(--font-display)",
                  color: isActive ? "var(--ember)" : "var(--bone)",
                  letterSpacing: "0.05em",
                  padding: "8px 0",
                  borderLeft: isActive ? "2px solid var(--ember)" : "none",
                  paddingLeft: isActive ? "8px" : "0",
                  transition: "all 0.2s ease"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1.3rem" }}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: "auto" }}>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            color: "var(--dust)"
          }}
          onMouseEnter={(e) => e.target.style.color = "var(--bone)"}
          onMouseLeave={(e) => e.target.style.color = "var(--dust)"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
            store
          </span>
          RETURN TO STORE
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
