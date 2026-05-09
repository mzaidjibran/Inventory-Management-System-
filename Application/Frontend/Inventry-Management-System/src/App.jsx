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

export const normalizeRole = (r) => {
  if (!r) return null;
  const lower = String(r).toLowerCase();
  if (lower === "employee" || lower === "user") return "user";
  if (lower === "administrator" || lower === "admin" || lower === "manager")
    return "admin";
  return lower;
};

function App() {
  // Har baar component render ho, fresh se role check ho
  const getDefaultRoute = () => {
    if (!isLoggedIn()) return "/signin";
    const role = normalizeRole(getUserRole());
    return role === "admin" ? "/product" : "/billing";
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Root always goes to signin if not logged in, else role-based */}
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

      {/* Admin + User dono ke liye */}
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
}

export default App;
