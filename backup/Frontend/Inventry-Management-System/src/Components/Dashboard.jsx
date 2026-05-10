import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

// Simple Chart Component (using basic canvas/divs)
const SimpleChart = ({ data, title, type = 'bar' }) => {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">No data available</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value || 0));

  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <div className="chart-bars">
        {data.map((item, idx) => (
          <div key={idx} className="chart-item">
            <div className="bar" style={{
              height: maxValue > 0 ? `${(item.value / maxValue) * 200}px` : '0px',
              backgroundColor: '#4CAF50'
            }}></div>
            <span className="label">{item.label}</span>
            <span className="value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get('http://localhost:3000/api/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load dashboard');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      } else {
        setError(err.response?.data?.message || 'Error loading dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span className="role-badge">{user?.role.toUpperCase()}</span>
          <span className="user-name">{user?.Name}</span>
        </div>
      </div>

      {/* ===== ADMIN DASHBOARD ===== */}
      {dashboardData?.role === 'admin' && (
        <div className="dashboard-content">
          <h2>Admin Dashboard - Full System Overview</h2>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Total Users</h3>
                <p className="stat-value">{dashboardData.users?.total || 0}</p>
                <small>Admins: {dashboardData.users?.admins} | Employees: {dashboardData.users?.employees} | Users: {dashboardData.users?.regularUsers}</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">Rs. {dashboardData.total?.revenue?.toLocaleString()}</p>
                <small>Total Bills: {dashboardData.total?.bills}</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>Products</h3>
                <p className="stat-value">{dashboardData.total?.products}</p>
                <small>In Stock</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👨‍💼</div>
              <div className="stat-content">
                <h3>Employees</h3>
                <p className="stat-value">{dashboardData.total?.employees}</p>
                <small>Active: {dashboardData.total?.activeEmployees}</small>
              </div>
            </div>
          </div>

          {/* Daily Stats */}
          <div className="stats-section">
            <h3>Today's Performance</h3>
            <div className="mini-stats">
              <div className="mini-stat">
                <span>Daily Sales:</span>
                <strong>Rs. {dashboardData.daily?.sales?.toLocaleString()}</strong>
              </div>
              <div className="mini-stat">
                <span>Bills Created:</span>
                <strong>{dashboardData.daily?.bills}</strong>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <SimpleChart
              title="Daily Sales (Last 7 Days)"
              data={dashboardData.charts?.last7Days?.map(d => ({
                label: d.date,
                value: d.sales
              })) || []}
            />
            <SimpleChart
              title="Monthly Revenue (Last 6 Months)"
              data={dashboardData.charts?.last6Months?.map(d => ({
                label: d.month,
                value: d.sales
              })) || []}
            />
          </div>

          {/* Payment Methods */}
          <div className="payment-methods">
            <h3>Payment Methods</h3>
            <div className="method-cards">
              <div className="method-card">
                <span>💵 Cash</span>
                <p>{dashboardData.total?.paymentMethods?.cash}</p>
              </div>
              <div className="method-card">
                <span>💳 Card</span>
                <p>{dashboardData.total?.paymentMethods?.card}</p>
              </div>
              <div className="method-card">
                <span>🌐 Online</span>
                <p>{dashboardData.total?.paymentMethods?.online}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== EMPLOYEE DASHBOARD ===== */}
      {dashboardData?.role === 'employee' && (
        <div className="dashboard-content">
          <h2>Employee Dashboard - Billing & Products</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">Rs. {dashboardData.total?.revenue?.toLocaleString()}</p>
                <small>Total Bills: {dashboardData.total?.bills}</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Today's Sales</h3>
                <p className="stat-value">Rs. {dashboardData.daily?.sales?.toLocaleString()}</p>
                <small>Bills: {dashboardData.daily?.bills}</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>Products</h3>
                <p className="stat-value">{dashboardData.total?.products}</p>
                <small>Available</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Team Members</h3>
                <p className="stat-value">{dashboardData.total?.employees}</p>
                <small>Employees</small>
              </div>
            </div>
          </div>

          {/* Monthly Overview */}
          <div className="stats-section">
            <h3>Monthly Overview</h3>
            <div className="mini-stats">
              <div className="mini-stat">
                <span>Monthly Sales:</span>
                <strong>Rs. {dashboardData.monthly?.sales?.toLocaleString()}</strong>
              </div>
              <div className="mini-stat">
                <span>Bills This Month:</span>
                <strong>{dashboardData.monthly?.bills}</strong>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button className="action-btn" onClick={() => window.location.href = '/employee/billing'}>
              📋 Manage Billings
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/employee/products'}>
              📦 View Products
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
