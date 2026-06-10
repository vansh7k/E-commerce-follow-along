import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import OrderStatusBadge from "../components/OrderStatusBadge";
import ProductCard from "../components/ProductCard";
import { useToastStore } from "../store/toastStore";

const AccountPage = () => {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);

  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Address Form state
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("India");
  const [isDefault, setIsDefault] = useState(false);

  const userStr = localStorage.getItem("maverick_user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchAccountData = async () => {
      setLoading(true);
      try {
        // Fetch orders
        const ordersRes = await API.get("/orders/mine");
        setOrders(ordersRes.data || []);

        // Fetch wishlist
        const wishlistRes = await API.get("/wishlist");
        setWishlist(wishlistRes.data.products || []);

        // Fetch user addresses
        const profileRes = await API.get("/auth/me");
        setAddresses(profileRes.data.addresses || []);
      } catch (err) {
        console.error("Error fetching account data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [navigate]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode || !country) {
      addToast("ALL ADDRESS FIELDS ARE REQUIRED", "error");
      return;
    }

    try {
      const res = await API.post("/auth/address", { street, city, state, zipCode, country, isDefault });
      addToast("ADDRESS ADDED SUCCESSFULLY", "success");
      setAddresses(res.data.addresses);
      
      // Update local storage user profile addresses as well
      const updatedUser = { ...user, addresses: res.data.addresses };
      localStorage.setItem("maverick_user", JSON.stringify(updatedUser));

      // Reset form
      setStreet("");
      setCity("");
      setState("");
      setZipCode("");
      setIsDefault(false);
    } catch (err) {
      console.error("Error adding address:", err);
      addToast("Failed to add address", "error");
    }
  };

  const handleDeleteAddress = async (addrId) => {
    try {
      const res = await API.delete(`/auth/address/${addrId}`);
      addToast("ADDRESS DELETED", "success");
      setAddresses(res.data.addresses);
      const updatedUser = { ...user, addresses: res.data.addresses };
      localStorage.setItem("maverick_user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error deleting address:", err);
      addToast("Failed to delete address", "error");
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

      <div className="container" style={{ padding: "60px 24px", flex: 1 }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "40px" }}>MY ARCHIVE</h1>

        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "60px" }} className="account-split">
          
          {/* Tab Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["profile", "orders", "wishlist", "addresses"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  textAlign: "left",
                  fontSize: "1.2rem",
                  fontFamily: "var(--font-display)",
                  color: activeTab === tab ? "var(--ember)" : "var(--bone)",
                  letterSpacing: "0.05em",
                  borderLeft: activeTab === tab ? "2px solid var(--ember)" : "none",
                  paddingLeft: activeTab === tab ? "10px" : "0",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab Details */}
          <div style={{ minHeight: "400px" }}>
            {loading ? (
              <div className="font-mono text-sm" style={{ color: "var(--dust)" }}>LOADING YOUR FILES...</div>
            ) : (
              <>
                {/* 1. Profile tab */}
                {activeTab === "profile" && user && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <h2 style={{ fontSize: "1.8rem", borderBottom: "1px solid var(--ash)", paddingBottom: "10px" }}>
                      PROFILE DETAILS
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>
                      <div>
                        <span style={{ color: "var(--dust)" }}>NAME:</span> {user.name}
                      </div>
                      <div>
                        <span style={{ color: "var(--dust)" }}>EMAIL:</span> {user.email}
                      </div>
                      <div>
                        <span style={{ color: "var(--dust)" }}>MEMBERSHIP:</span> {user.role === "admin" ? "ADMINISTRATOR" : "CUSTOMER"}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Orders tab */}
                {activeTab === "orders" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <h2 style={{ fontSize: "1.8rem", borderBottom: "1px solid var(--ash)", paddingBottom: "10px" }}>
                      ORDER HISTORY
                    </h2>
                    {orders.length === 0 ? (
                      <p className="font-mono text-sm" style={{ color: "var(--dust)" }}>NO ORDER HISTORY FOUND.</p>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                          <thead>
                            <tr style={{ borderBottom: "2px solid var(--ash)", textAlign: "left", color: "var(--dust)" }}>
                              <th style={{ padding: "12px" }}>ORDER ID</th>
                              <th style={{ padding: "12px" }}>DATE</th>
                              <th style={{ padding: "12px" }}>ITEMS</th>
                              <th style={{ padding: "12px" }}>TOTAL</th>
                              <th style={{ padding: "12px" }}>STATUS</th>
                              <th style={{ padding: "12px" }}>VIEW</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((o) => (
                              <tr key={o._id} style={{ borderBottom: "1px solid var(--ash)" }}>
                                <td style={{ padding: "12px", fontWeight: "bold" }}>{o._id.substring(0, 10)}...</td>
                                <td style={{ padding: "12px" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: "12px" }}>{o.items.reduce((sum, item) => sum + item.qty, 0)}</td>
                                <td style={{ padding: "12px", color: "var(--ember)" }}>{formatPrice(o.total)}</td>
                                <td style={{ padding: "12px" }}>
                                  <OrderStatusBadge status={o.status} />
                                </td>
                                <td style={{ padding: "12px" }}>
                                  <Link to={`/account/orders/${o._id}`} style={{ color: "var(--bone)", textDecoration: "underline" }}>
                                    DETAILS
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Wishlist tab */}
                {activeTab === "wishlist" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <h2 style={{ fontSize: "1.8rem", borderBottom: "1px solid var(--ash)", paddingBottom: "10px" }}>
                      WISHLISTED ITEMS
                    </h2>
                    {wishlist.length === 0 ? (
                      <p className="font-mono text-sm" style={{ color: "var(--dust)" }}>YOUR WISHLIST IS EMPTY.</p>
                    ) : (
                      <div className="product-grid">
                        {wishlist.map((product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            wishlistItems={wishlist}
                            onWishlistUpdate={async () => {
                              const wishlistRes = await API.get("/wishlist");
                              setWishlist(wishlistRes.data.products || []);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Addresses tab */}
                {activeTab === "addresses" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    <div>
                      <h2 style={{ fontSize: "1.8rem", borderBottom: "1px solid var(--ash)", paddingBottom: "10px", marginBottom: "20px" }}>
                        SAVED ADDRESSES
                      </h2>
                      {addresses.length === 0 ? (
                        <p className="font-mono text-sm" style={{ color: "var(--dust)" }}>NO SAVED ADDRESSES.</p>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="address-grid">
                          {addresses.map((addr) => (
                            <div
                              key={addr._id}
                              style={{
                                border: "1px solid var(--ash)",
                                padding: "20px",
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px"
                              }}
                            >
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--bone)" }}>
                                {addr.isDefault && (
                                  <span style={{
                                    backgroundColor: "var(--ember)",
                                    color: "var(--bone)",
                                    fontSize: "0.65rem",
                                    padding: "2px 6px",
                                    fontWeight: "bold",
                                    display: "inline-block",
                                    marginBottom: "8px"
                                  }}>
                                    DEFAULT
                                  </span>
                                )}
                                <p>{addr.street}</p>
                                <p>{addr.city}, {addr.state} - {addr.zipCode}</p>
                                <p>{addr.country.toUpperCase()}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteAddress(addr._id)}
                                className="material-symbols-outlined"
                                style={{
                                  position: "absolute",
                                  bottom: "20px",
                                  right: "20px",
                                  color: "var(--dust)",
                                  cursor: "pointer"
                                }}
                              >
                                delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add Address Form */}
                    <div style={{ borderTop: "1px solid var(--ash)", paddingTop: "32px" }}>
                      <h3 style={{ fontSize: "1.4rem", marginBottom: "20px" }}>ADD NEW ADDRESS</h3>
                      <form onSubmit={handleAddAddress} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div>
                          <input
                            type="text"
                            placeholder="STREET ADDRESS"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            required
                            className="input-brutalist"
                          />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                          <input
                            type="text"
                            placeholder="CITY"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            className="input-brutalist"
                          />
                          <input
                            type="text"
                            placeholder="STATE"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
                            className="input-brutalist"
                          />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                          <input
                            type="text"
                            placeholder="ZIP CODE"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            required
                            className="input-brutalist"
                          />
                          <input
                            type="text"
                            placeholder="COUNTRY"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            className="input-brutalist"
                          />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <input
                            type="checkbox"
                            id="default-check"
                            checked={isDefault}
                            onChange={(e) => setIsDefault(e.target.checked)}
                            style={{ width: "18px", height: "18px", accentColor: "var(--ember)" }}
                          />
                          <label htmlFor="default-check" style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", cursor: "pointer" }}>
                            SET AS DEFAULT ADDRESS
                          </label>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                          SAVE ADDRESS
                        </button>
                      </form>
                    </div>

                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .account-split {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .address-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default AccountPage;
