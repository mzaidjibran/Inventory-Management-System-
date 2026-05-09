import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  forgotPassword,
  resetPassword,
  signIn,
  verifyOtp,
} from "../Api/authApi.js";
import toast from "react-hot-toast";
// Optional super-admin credentials exposed via Vite env: VITE_SUPER_ADMIN_EMAIL, VITE_SUPER_ADMIN_PASSWORD
const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL || "";
const SUPER_ADMIN_PASSWORD = import.meta.env.VITE_SUPER_ADMIN_PASSWORD || "";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");
  const [forgotForm, setForgotForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Only allow sign-in for emails approved by admin (or super-admin)
      const approvedRaw = localStorage.getItem("approvedUsers");
      const approved = approvedRaw ? JSON.parse(approvedRaw) : [];
      if (
        SUPER_ADMIN_EMAIL &&
        SUPER_ADMIN_PASSWORD &&
        form.email === SUPER_ADMIN_EMAIL &&
        form.password === SUPER_ADMIN_PASSWORD
      ) {
        // super-admin shortcut handled below
      } else if (!approved.includes(form.email)) {
        return toast.error(
          "This account is not authorized. Please contact your administrator.",
        );
      }

      // If super-admin env vars are configured and match, grant local admin access
      if (
        SUPER_ADMIN_EMAIL &&
        SUPER_ADMIN_PASSWORD &&
        form.email === SUPER_ADMIN_EMAIL &&
        form.password === SUPER_ADMIN_PASSWORD
      ) {
        localStorage.setItem("accessToken", "super-admin-token");
        localStorage.setItem("userRole", "admin");
        toast.success("Logged in as Super Admin");
        navigate("/");
        return;
      }

      // signIn() already sets userRole in localStorage via normalizeRole
      const data = await signIn(form.email, form.password);

      toast.success("Login successful!");
      // App.jsx's defaultRoute will handle correct navigation based on role
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  }

  function openForgotPassword() {
    setForgotForm((prev) => ({ ...prev, email: form.email || prev.email }));
    setForgotStep("email");
    setResetToken("");
    setForgotOpen(true);
  }

  function closeForgotPassword() {
    setForgotOpen(false);
    setForgotStep("email");
    setResetToken("");
    setForgotForm({ email: "", otp: "", newPassword: "", confirmPassword: "" });
  }

  async function handleSendOtp(event) {
    event.preventDefault();
    if (!forgotForm.email.trim()) return toast.error("Please enter Email");
    try {
      const result = await forgotPassword(forgotForm.email.trim());
      toast.success(result.message || "OTP Sent!");
      setForgotStep("otp");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    if (!forgotForm.otp.trim()) return toast.error("Please Enter OTP");
    try {
      const result = await verifyOtp(
        forgotForm.email.trim(),
        forgotForm.otp.trim(),
      );
      setResetToken(result.resetToken);
      toast.success(result.message || "OTP verified successfully!");
      setForgotStep("reset");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    if (!forgotForm.newPassword.trim())
      return toast.error("Enter new password");
    if (forgotForm.newPassword !== forgotForm.confirmPassword)
      return toast.error("Passwords do not match!");
    try {
      const result = await resetPassword(
        resetToken,
        forgotForm.newPassword.trim(),
      );
      toast.success(result.message || "Password reset successfully!");
      closeForgotPassword();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="signin-container">
      <div className="card signin-card">
        <h4 className="mb-4 text-center">Sign In</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Sign In
          </button>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-link text-decoration-none p-0"
              onClick={openForgotPassword}
            >
              Forgot Password?
            </button>
          </div>
        </form>

        <p className="text-center mt-3">
          Don't have account? <a href="/signup">Sign Up here</a>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="forgot-modal-backdrop">
          <div className="card forgot-modal-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Forgot Password</h5>
              <button
                type="button"
                className="btn btn-sm btn-light"
                onClick={closeForgotPassword}
              >
                ×
              </button>
            </div>

            {forgotStep === "email" && (
              <form onSubmit={handleSendOtp}>
                <div className="mb-3">
                  <label className="form-label">Registered Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={forgotForm.email}
                    onChange={(e) =>
                      setForgotForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="Enter registered email"
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary w-100">
                    Send OTP
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeForgotPassword}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {forgotStep === "otp" && (
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-3">
                  <label className="form-label">OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    value={forgotForm.otp}
                    onChange={(e) =>
                      setForgotForm((p) => ({ ...p, otp: e.target.value }))
                    }
                    placeholder="Enter OTP"
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary w-100">
                    Verify OTP
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setForgotStep("email")}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            {forgotStep === "reset" && (
              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={forgotForm.newPassword}
                    onChange={(e) =>
                      setForgotForm((p) => ({
                        ...p,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={forgotForm.confirmPassword}
                    onChange={(e) =>
                      setForgotForm((p) => ({
                        ...p,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary w-100">
                    Update Password
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeForgotPassword}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .signin-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation: fadeIn 0.8s ease-out;
        }
        .signin-card {
          width: 400px;
          padding: 2rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(2px);
          box-shadow: 0 20px 35px rgba(0, 0, 0, 0.2);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }
        .signin-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 40px rgba(0, 0, 0, 0.25);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .btn-link {
          color: #667eea;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .btn-link:hover {
          color: #5a67d8;
          text-decoration: underline !important;
        }
        .btn-link:focus {
          box-shadow: none;
        }
        .btn-primary {
          background: linear-gradient(90deg, #667eea, #764ba2);
          border: none;
          transition: opacity 0.2s;
        }
        .btn-primary:hover {
          opacity: 0.9;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }
        .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .forgot-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 1rem;
        }
        .forgot-modal-card {
          width: 100%;
          max-width: 420px;
          padding: 1.5rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 20px 35px rgba(0, 0, 0, 0.22);
          animation: fadeIn 0.2s ease-out;
        }
        @media (max-width: 480px) {
          .signin-card {
            width: 90%;
            padding: 1.5rem;
          }
          .forgot-modal-card {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
