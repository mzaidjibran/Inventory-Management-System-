import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  forgotPassword,
  resetPassword,
  signIn,
  verifyOtp,
  normalizeRole,
} from "../Api/authApi.js";
import toast from "react-hot-toast";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");
  const [forgotForm, setForgotForm] = useState({
    email: "", otp: "", newPassword: "", confirmPassword: "",
  });
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn(form.email, form.password);
      const role = normalizeRole(result.role || localStorage.getItem("userRole"));
      toast.success("Login successful!");
      // Sab dashboard pe jayein
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
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
    } catch (err) { toast.error(err.message); }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    if (!forgotForm.otp.trim()) return toast.error("Please Enter OTP");
    try {
      const result = await verifyOtp(forgotForm.email.trim(), forgotForm.otp.trim());
      setResetToken(result.resetToken);
      toast.success(result.message || "OTP verified successfully!");
      setForgotStep("reset");
    } catch (err) { toast.error(err.message); }
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    if (!forgotForm.newPassword.trim()) return toast.error("Enter new password");
    if (forgotForm.newPassword !== forgotForm.confirmPassword)
      return toast.error("Passwords do not match!");
    try {
      const result = await resetPassword(resetToken, forgotForm.newPassword.trim());
      toast.success(result.message || "Password reset successfully!");
      closeForgotPassword();
    } catch (err) { toast.error(err.message); }
  }

  return (
    <div className="signin-container">
      <div className="card signin-card">
        <div className="signin-logo">
        <img src="assets\images\mango_transparent.png" alt="" />
        </div>
        <h4 className="mb-1 text-center signin-title">Welcome Back</h4>
        <p className="text-center signin-subtitle mb-4">Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email" type="email" className="form-control"
              placeholder="Enter your email" value={form.email}
              onChange={handleChange} required autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password" type="password" className="form-control"
              placeholder="Enter your password" value={form.password}
              onChange={handleChange} required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Signing in...
              </span>
            ) : "Sign In"}
          </button>
          <div className="text-center">
            <button type="button" className="btn btn-link text-decoration-none p-0"
              onClick={openForgotPassword}>
              Forgot Password?
            </button>
          </div>
        </form>

        <p className="text-center mt-3">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>

      {forgotOpen && (
        <div className="forgot-modal-backdrop">
          <div className="card forgot-modal-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Reset Password</h5>
              <button type="button" className="btn btn-sm btn-light" onClick={closeForgotPassword}>×</button>
            </div>

            {forgotStep === "email" && (
              <form onSubmit={handleSendOtp}>
                <div className="mb-3">
                  <label className="form-label">Registered Email</label>
                  <input type="email" className="form-control" value={forgotForm.email}
                    onChange={(e) => setForgotForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Enter registered email" required />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary w-100">Send OTP</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={closeForgotPassword}>Cancel</button>
                </div>
              </form>
            )}

            {forgotStep === "otp" && (
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-3">
                  <label className="form-label">Enter OTP</label>
                  <input type="text" className="form-control" value={forgotForm.otp}
                    onChange={(e) => setForgotForm((p) => ({ ...p, otp: e.target.value }))}
                    placeholder="6-digit OTP" required />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary w-100">Verify OTP</button>
                  <button type="button" className="btn btn-outline-secondary"
                    onClick={() => setForgotStep("email")}>Back</button>
                </div>
              </form>
            )}

            {forgotStep === "reset" && (
              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-control" value={forgotForm.newPassword}
                    onChange={(e) => setForgotForm((p) => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Enter new password" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-control" value={forgotForm.confirmPassword}
                    onChange={(e) => setForgotForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password" required />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary w-100">Update Password</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={closeForgotPassword}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .signin-container { display:flex; justify-content:center; align-items:center; min-height:100vh; background:linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%); animation:fadeIn 0.6s ease-out; }
        .signin-logo { text-align:center; margin-bottom:0.5rem; }
        .logo-icon { font-size:2.5rem; filter:drop-shadow(0 0 12px rgba(102,126,234,0.8)); }
        .signin-title { font-weight:700; color:#1a1a2e; letter-spacing:-0.5px; }
        .signin-subtitle { color:#888; font-size:0.9rem; }
        .signin-card { width:420px; padding:2.5rem; border-radius:1.25rem; background:rgba(255,255,255,0.97); box-shadow:0 25px 50px rgba(0,0,0,0.4); animation:slideUp 0.5s ease-out; }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .form-control { border-radius:0.6rem; border:1.5px solid #e2e8f0; padding:0.65rem 0.9rem; transition:border-color 0.2s,box-shadow 0.2s; }
        .form-control:focus { border-color:#667eea; box-shadow:0 0 0 3px rgba(102,126,234,0.15); outline:none; }
        .btn-primary { background:linear-gradient(90deg,#667eea,#764ba2); border:none; border-radius:0.6rem; padding:0.7rem; font-weight:600; transition:opacity 0.2s,transform 0.1s; }
        .btn-primary:hover:not(:disabled) { opacity:0.92; transform:translateY(-1px); }
        .btn-primary:disabled { opacity:0.7; cursor:not-allowed; }
        .btn-link { color:#667eea; font-size:0.875rem; }
        .btn-link:hover { color:#5a67d8; }
        .forgot-modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; z-index:1050; padding:1rem; }
        .forgot-modal-card { width:100%; max-width:420px; padding:1.75rem; border-radius:1rem; background:#fff; box-shadow:0 20px 40px rgba(0,0,0,0.25); animation:slideUp 0.2s ease-out; }
        @media (max-width:480px) { .signin-card{width:90%;padding:1.75rem;} }
      `}</style>
    </div>
  );
}