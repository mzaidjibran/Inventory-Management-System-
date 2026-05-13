import { Routes, Route, Navigate } from "react-router-dom";
import { isLoggedIn, getUserRole, normalizeRole } from "./Api/authApi.js";
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

function App() {
  const getDefaultRoute = () => {
    if (!isLoggedIn()) return "/signin";
    return "/dashboard"; // sab dashboard pe
  };

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

      {/* Sab ke liye — Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "employee", "user"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin + Employee — Billing */}
      <Route
        path="/billing"
        element={
          <ProtectedRoute allowedRoles={["admin", "employee"]}>
            <Billing />
          </ProtectedRoute>
        }
      />

      {/* Sirf Admin */}
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

      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
}

export default App;
