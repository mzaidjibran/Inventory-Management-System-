import { Navigate } from "react-router-dom";
import { isLoggedIn, getUserRole, normalizeRole } from "../Api/authApi.js";

export default function ProtectedRoute({ children, allowedRoles }) {
  const loggedIn = isLoggedIn();
  const role = normalizeRole(getUserRole());

  if (!loggedIn) return <Navigate to="/signin" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/dashboard" replace />;
    if (role === "employee") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}