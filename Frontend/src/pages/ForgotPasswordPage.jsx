import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import { useToastStore } from "../store/toastStore";

const ForgotPasswordPage = () => {
  const addToast = useToastStore((state) => state.addToast);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await API.post("/auth/forgot-password", { email });
      setSuccessMsg(response.data.message || "RESET LINK SENT SUCCESSFULLY.");
      addToast("RESET LINK SENT.", "success");
      
      // Developer convenience fallback warning
      if (response.data.resetLink) {
        console.log("DEV RESET LINK:", response.data.resetLink);
      }
    } catch (err) {
      console.error("Forgot password failed:", err);
      const errMsg = err.response?.data?.message || "Failed to submit request.";
      setErrorMsg(errMsg);
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
          <h2 style={{ fontSize: "2rem", marginBottom: "8px", textAlign: "center" }}>RECOVER</h2>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--dust)",
            textAlign: "center",
            marginBottom: "32px"
          }}>
            ENTER YOUR EMAIL TO RECEIVE RESET LINK
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {errorMsg && (
              <div style={{
                border: "1px solid #ff3333",
                color: "#ff3333",
                padding: "12px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                textAlign: "center"
              }}>
                {errorMsg.toUpperCase()}
              </div>
            )}

            {successMsg && (
              <div style={{
                border: "1px solid var(--ember)",
                color: "var(--ember)",
                padding: "12px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                textAlign: "center"
              }}>
                {successMsg.toUpperCase()}
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "SUBMITTING..." : "SEND RESET LINK"}
            </button>
          </form>

          <div style={{
            marginTop: "24px",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--dust)"
          }}>
            BACK TO{" "}
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

export default ForgotPasswordPage;
