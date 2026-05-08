import { Navigate } from "react-router-dom";
import { isLoggedIn, getUserRole } from "../Api/authApi.js";

export default function ProtectedRoute({ children, allowedRoles }) {
  const loggedIn = isLoggedIn();
  const role = getUserRole();

  const normalizeRole = (r) => {
    if (!r) return null;
    const lower = String(r).toLowerCase();
    if (lower === "employee") return "user";
    if (lower === "administrator") return "admin";
    if (lower === "manager") return "admin";
    return lower; // 'admin', 'user', etc.
  };

  const normalizedRole = normalizeRole(role);

  if (!loggedIn) return <Navigate to="/signin" replace />;

  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    return (
      <Navigate
        to={normalizedRole === "admin" ? "/product" : "/billing"}
        replace
      />
    );
  }

  return children;
}
