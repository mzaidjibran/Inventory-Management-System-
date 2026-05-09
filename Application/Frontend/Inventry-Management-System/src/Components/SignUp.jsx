import { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';

export default function SignUp() {
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // Default role
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.Name || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', {
        Name: formData.Name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (response.data.success) {
        setSuccess(`✅ ${response.data.message}`);
        setFormData({
          Name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'user',
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="Name"
              placeholder="Enter your full name"
              value={formData.Name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role Dropdown - IMPORTANT */}
          <div className="form-group">
            <label>Select Your Role *</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="user">👤 Regular User</option>
              <option value="employee">👨‍💼 Employee (Billing + Dashboard)</option>
            </select>
            <small className="role-hint">
              {formData.role === 'user' 
                ? '📊 Access: Dashboard only'
                : '📊 Access: Dashboard + Billing Management'}
            </small>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Sign In</a>
        </p>

        <div className="role-info">
          <h4>Account Types:</h4>
          <ul>
            <li><strong>User:</strong> Access to personal dashboard</li>
            <li><strong>Employee:</strong> Full billing management + dashboard</li>
            <li><strong>Admin:</strong> Only available through admin portal</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
