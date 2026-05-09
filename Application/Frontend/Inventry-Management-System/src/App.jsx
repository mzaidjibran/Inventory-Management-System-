import { Routes, Route, Navigate } from "react-router-dom";
import { isLoggedIn, getUserRole } from "./Api/authApi.js";
import Product from "./pages/product.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import User from "./pages/user.jsx";
import Employee from "./pages/employee.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Supplier from "./Pages/supplier.jsx";
import Client from "./Pages/client.jsx";
import Billing from "./pages/Billing.jsx";

// Login ke baad role ke hisaab se redirect
const normalizeRole = (r) => {
  if (!r) return null;
  const lower = String(r).toLowerCase();
  if (lower === "employee" || lower === "user") return "user";
  if (lower === "administrator" || lower === "admin" || lower === "manager")
    return "admin";
  return lower;
};
const defaultRoute = () => {
  if (!isLoggedIn()) return "/signin";
  let role = getUserRole();
  // If role not present, try to decode it from accessToken and persist
  if (!role) {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          const decoded = JSON.parse(atob(parts[1]));
          role = decoded?.role || decoded?.Role || null;
          if (role) localStorage.setItem("userRole", role);
        }
      }
    } catch (e) {
      console.warn("Failed to decode token for role:", e);
    }
  }

  const norm = normalizeRole(role);
  return norm === "admin" ? "/product" : "/billing";
};
function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Navigate to={defaultRoute()} replace />} />

      {/* Employee + Admin dono ke liye */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <Billing />
          </ProtectedRoute>
        }
      />

      {/* Sirf Admin ke liye */}
      <Route
        path="/product"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Product />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Employee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supplier"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Supplier />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Client />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <User />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={defaultRoute()} replace />} />
    </Routes>
  );
}

export default App;
