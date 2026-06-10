import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import { useToastStore } from "../store/toastStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const addToast = useToastStore((state) => state.addToast);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to previous page or home
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem("maverick_token", token);
      localStorage.setItem("maverick_user", JSON.stringify(user));

      addToast("LOGIN SUCCESSFUL. WELCOME BACK.", "success");
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      const errMsg = err.response?.data?.message || "Invalid email or password.";
      setError(errMsg);
      addToast(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ backgroundColor: "var(--void)", minHeight: "100vh" }}>
      <Navbar />
      <Toast />

      <div
        className="content-wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "var(--ash)",
            border: "1px solid var(--dust)",
            padding: "40px"
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "8px", textAlign: "center" }}>ACCESS</h2>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--dust)",
            textAlign: "center",
            marginBottom: "32px"
          }}>
            ENTER YOUR DETAILS TO LOG IN
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {error && (
              <div style={{
                border: "1px solid #ff3333",
                color: "#ff3333",
                padding: "12px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                textAlign: "center"
              }}>
                {error.toUpperCase()}
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-brutalist"
                disabled={loading}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-brutalist"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "10px" }}
            >
              {loading ? "AUTHENTICATING..." : "LOG IN"}
            </button>
          </form>

          <div style={{
            marginTop: "24px",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--dust)"
          }}>
            NEW CUSTOMER?{" "}
            <Link to="/register" style={{ color: "var(--ember)", textDecoration: "underline" }}>
              CREATE ACCOUNT
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
