import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import { useToastStore } from "../store/toastStore";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post(`/auth/reset-password/${token}`, { password });
      setSuccessMsg(response.data.message || "PASSWORD RESET SUCCESSFUL.");
      addToast("PASSWORD UPDATED.", "success");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Reset password failed:", err);
      const errMsg = err.response?.data?.message || "Failed to reset password.";
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
          <h2 style={{ fontSize: "2rem", marginBottom: "8px", textAlign: "center" }}>RESET</h2>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--dust)",
            textAlign: "center",
            marginBottom: "32px"
          }}>
            ENTER YOUR NEW PASSWORD
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
                {successMsg.toUpperCase()}<br />
                REDIRECTING TO LOGIN...
              </div>
            )}

            <div>
              <input
                type="password"
                placeholder="NEW PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-brutalist"
                disabled={loading || successMsg}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="CONFIRM NEW PASSWORD"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-brutalist"
                disabled={loading || successMsg}
              />
            </div>

            <button
              type="submit"
              disabled={loading || successMsg}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "10px" }}
            >
              {loading ? "RESETTING..." : "RESET PASSWORD"}
            </button>
          </form>

          <div style={{
            marginTop: "24px",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--dust)"
          }}>
            ABANDON RESET?{" "}
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

export default ResetPasswordPage;
