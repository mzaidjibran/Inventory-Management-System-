import { Routes, Route, Navigate } from "react-router-dom";
import { isLoggedIn } from "./Api/authApi.js";

import Product from "./pages/product.jsx";
import User from "./pages/user.jsx";
import Employee from "./pages/employee.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Supplier from "./Pages/supplier.jsx";
import Client from "./Pages/client.jsx";
import Billing from "./pages/Billing.jsx";


function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/"
        element={
          <Navigate to={isLoggedIn() ? "/product" : "/signin"} replace />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/product"
        element={
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee"
        element={
          <ProtectedRoute>
            <Employee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supplier"
        element={
          <ProtectedRoute>
            <Supplier />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client"
        element={
          <ProtectedRoute>
            <Client />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={isLoggedIn() ? "/product" : "/signin"} replace />
        }
      />
    </Routes>
  );
}

export default App;
