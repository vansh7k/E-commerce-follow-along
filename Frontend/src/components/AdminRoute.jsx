import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("maverick_token");
  const userStr = localStorage.getItem("maverick_user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") {
    // Redirect customer back to home page or show permission error
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
