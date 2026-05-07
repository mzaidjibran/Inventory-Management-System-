import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../Api/authApi.js";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [form, setForm] = useState({ Name: "", email: "", password: "" });
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await signUp(form);
      toast.success("Account ban gaya! Ab login karo.");
      navigate("/signin");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="signup-container">
      <div className="card signup-card">
        <h4 className="mb-3 text-center">Sign Up</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="Name"
              type="text"
              className="form-control"
              placeholder="Enter name"
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
          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-3">
          Pehle se account hai? <a href="/signin">Sign In karo</a>
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
