import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import { useToastStore } from "../store/toastStore";

const RegisterPage = () => {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/auth/register", { name, email, password });
      const { token, user } = response.data;

      localStorage.setItem("maverick_token", token);
      localStorage.setItem("maverick_user", JSON.stringify(user));

      addToast("ACCOUNT CREATED SUCCESSFULLY.", "success");
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      const errMsg = err.response?.data?.message || "Failed to create account.";
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
          <h2 style={{ fontSize: "2rem", marginBottom: "8px", textAlign: "center" }}>CREATE</h2>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--dust)",
            textAlign: "center",
            marginBottom: "32px"
          }}>
            JOIN THE MAVERICK ARCHIVE
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
                type="text"
                placeholder="FULL NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-brutalist"
                disabled={loading}
              />
            </div>

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

            <div>
              <input
                type="password"
                placeholder="CONFIRM PASSWORD"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "CREATING..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <div style={{
            marginTop: "24px",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--dust)"
          }}>
            ALREADY REGISTERED?{" "}
            <Link to="/login" style={{ color: "var(--ember)", textDecoration: "underline" }}>
              LOG IN
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
