import { Navigate } from "react-router-dom";
import { isLoggedIn, getUserRole, normalizeRole } from "../Api/authApi.js";

export default function ProtectedRoute({ children, allowedRoles }) {
  const loggedIn = isLoggedIn();
  const normalizedRole = normalizeRole(getUserRole());

  // Login nahi — signin pe bhejo
  if (!loggedIn) return <Navigate to="/signin" replace />;

  // Role allowed nahi — apne default page pe bhejo
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
