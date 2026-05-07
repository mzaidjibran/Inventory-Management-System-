import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  forgotPassword,
  resetPassword,
  signIn,
  verifyOtp,
} from "../Api/authApi.js";
import toast from "react-hot-toast";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [recoveryMode, setRecoveryMode] = useState("forgot");
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
      await signIn(form.email, form.password);
      toast.success("Login successful!");
      navigate("/product");
    } catch (err) {
      toast.error(err.message);
    }
  }

  function openForgotPassword() {
    setRecoveryMode("forgot");
    setForgotForm((prev) => ({ ...prev, email: form.email || prev.email }));
    setForgotStep("email");
    setResetToken("");
    setForgotOpen(true);
  }

  function openResetPassword() {
    setRecoveryMode("reset");
    setForgotForm((prev) => ({ ...prev, email: form.email || prev.email }));
    setForgotStep("email");
    setResetToken("");
    setForgotOpen(true);
  }

  function closeForgotPassword() {
    setForgotOpen(false);
    setForgotStep("email");
    setResetToken("");
    setForgotForm({
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  async function handleSendOtp(event) {
    event.preventDefault();

    if (!forgotForm.email.trim()) {
      toast.error("Email zaroori hai");
      return;
    }

    try {
      const result = await forgotPassword(forgotForm.email.trim());
      toast.success(result.message || "OTP aapki email pe bhej diya gaya hai");
      setForgotStep("otp");
    } catch (err) {
      toast.error(err.message || "Forgot password request failed");
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();

    if (!forgotForm.otp.trim()) {
      toast.error("OTP zaroori hai");
      return;
    }

    try {
      const result = await verifyOtp(
        forgotForm.email.trim(),
        forgotForm.otp.trim(),
      );
      setResetToken(result.resetToken);
      toast.success(result.message || "OTP verify ho gaya");
      setForgotStep("reset");
    } catch (err) {
      toast.error(err.message || "OTP verification failed");
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();

    if (!forgotForm.newPassword.trim()) {
      toast.error("New password zaroori hai");
      return;
    }

    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      toast.error("Passwords match nahi kar rahe");
      return;
    }

    try {
      const result = await resetPassword(
        resetToken,
        forgotForm.newPassword.trim(),
      );
      toast.success(result.message || "Password reset ho gaya");
      closeForgotPassword();
    } catch (err) {
      toast.error(err.message || "Password reset failed");
    }
  }

  return (
    <div className="signin-container">
      <div className="card signin-card">
        <h4 className="mb-3 text-center">Sign In</h4>
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
          <div className="d-flex justify-content-between mb-3">
            <button type="submit" className="btn btn-primary w-100 me-2">
              Sign In
            </button>
          </div>
          <div className="d-flex justify-content-between gap-2 mb-3">
            <button
              type="button"
              className="btn btn-link text-decoration-none p-0"
              onClick={openForgotPassword}
            >
              Forgot Password?
            </button>
            <button
              type="button"
              className="btn btn-link text-decoration-none p-0"
              onClick={openResetPassword}
            >
              Reset Password
            </button>
          </div>
        </form>
        <p className="text-center mt-3">
          Account nahi hai? <a href="/signup">Sign Up karo</a>
        </p>
      </div>

      {forgotOpen && (
        <div className="forgot-modal-backdrop">
          <div className="card forgot-modal-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                {recoveryMode === "reset"
                  ? "Reset Password"
                  : "Forgot Password"}
              </h5>
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
                      setForgotForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Enter registered email"
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary w-100">
                    {recoveryMode === "reset" ? "Send Reset OTP" : "Send OTP"}
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
                      setForgotForm((prev) => ({
                        ...prev,
                        otp: e.target.value,
                      }))
                    }
                    placeholder="Enter OTP"
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary w-100">
                    {recoveryMode === "reset"
                      ? "Verify Reset OTP"
                      : "Verify OTP"}
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
                      setForgotForm((prev) => ({
                        ...prev,
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
                      setForgotForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary w-100">
                    {recoveryMode === "reset"
                      ? "Reset Password"
                      : "Update Password"}
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

      {/* Custom styles for background, animation, and hover effects */}
      <style jsx>{`
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

        /* Override Bootstrap button styles for the Forgot Password link */
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

        /* Make primary button gradient */
        .btn-primary {
          background: linear-gradient(90deg, #667eea, #764ba2);
          border: none;
          transition: opacity 0.2s;
        }
        .btn-primary:hover {
          opacity: 0.9;
          background: linear-gradient(90deg, #667eea, #764ba2);
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

        /* Responsive */
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
