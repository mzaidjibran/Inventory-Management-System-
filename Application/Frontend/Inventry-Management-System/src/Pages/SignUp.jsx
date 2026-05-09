import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../Api/authApi.js";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [form, setForm] = useState({ Name: "", email: "", password: "", role: "employee" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(form);
      toast.success("Account created! Please sign in.");
      navigate("/signin");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-container">
      <div className="card signup-card">
        <h4 className="mb-3 text-center">Sign Up</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              name="Name"
              type="text"
              className="form-control"
              placeholder="Enter your full name"
              value={form.Name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
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
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role - Employee Only */}
          <div className="mb-3">
            <label className="form-label">Role</label>
            <input
              type="text"
              className="form-control"
              value="Employee"
              disabled
              readOnly
            />
            <small className="text-muted d-block mt-1">
              ✓ Employees have access to Billing & Dashboard
            </small>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Creating Account...
              </span>
            ) : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>

      {/* Styles matching the SignIn page */}
      <style>{`
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation: fadeIn 0.8s ease-out;
        }

        .signup-card {
          width: 400px;
          padding: 2rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(2px);
          box-shadow: 0 20px 35px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .signup-card:hover {
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

        /* Gradient button */
        .btn-primary {
          background: linear-gradient(90deg, #667eea, #764ba2);
          border: none;
          transition: opacity 0.2s;
        }
        .btn-primary:hover {
          opacity: 0.9;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        /* Input focus effect (optional) */
        .form-control:focus {
          border-color: #764ba2;
          box-shadow: 0 0 0 0.2rem rgba(118, 75, 162, 0.25);
        }

        /* Responsive */
        @media (max-width: 480px) {
          .signup-card {
            width: 90%;
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
