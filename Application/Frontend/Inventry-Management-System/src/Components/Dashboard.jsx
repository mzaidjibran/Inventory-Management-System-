import { useState, useEffect } from "react";
import axios from "axios";

// ── Fixed SimpleChart — fully inline, no CSS file needed ─────────────────────
const SimpleChart = ({ data, title }) => {
  console.log(`📊 SimpleChart "${title}" received:`, data);

  if (!data || data.length === 0) {
    console.warn(`⚠️ No data for chart: ${title}`);
    return (
      <div
        style={{
          background: "#fffdf9",
          border: "1px solid #e8dcc8",
          borderRadius: 12,
          padding: "20px",
          textAlign: "center",
          color: "#b89060",
          fontFamily: "Nunito, sans-serif",
          fontSize: 13,
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value || 0));

  return (
    <div
      style={{
        background: "#fffdf9",
        border: "1px solid #e8dcc8",
        borderRadius: 12,
        padding: "20px",
        fontFamily: "Nunito, sans-serif",
        minHeight: "240px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: "#3d2a10",
          margin: "0 0 16px",
        }}
      >
        {title}
      </h3>
      {/* Bars — flex row, items aligned to bottom */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          height: 180,
          padding: "0 4px",
          flex: 1,
        }}
      >
        {data.map((item, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              height: "100%",
              gap: 4,
            }}
          >
            {/* Value label on top of bar */}
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#c8965a",
                whiteSpace: "nowrap",
              }}
            >
              {item.value?.toLocaleString() || 0}
            </span>
            {/* The bar */}
            <div
              style={{
                width: "100%",
                height:
                  maxValue > 0
                    ? `${Math.max(4, (item.value / maxValue) * 110)}px`
                    : "4px",
                background: "linear-gradient(180deg, #c8965a 0%, #e8b87a 100%)",
                borderRadius: "4px 4px 0 0",
                transition: "height 0.4s ease",
              }}
            />
            {/* Label below bar */}
            <span
              style={{
                fontSize: 10,
                color: "#b89060",
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                textAlign: "center",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, title, value, sub }) => (
  <div
    style={{
      background: "#fffdf9",
      border: "1px solid #e8dcc8",
      borderRadius: 14,
      padding: "20px 22px",
      fontFamily: "Nunito, sans-serif",
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
    }}
  >
    <div
      style={{
        fontSize: 26,
        lineHeight: 1,
        marginTop: 2,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#b89060",
          margin: "0 0 4px",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#3d2a10",
          margin: "0 0 4px",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 11, color: "#c8a87a", margin: 0, fontWeight: 600 }}>
        {sub}
      </p>
    </div>
  </div>
);

// ── Mini Stat Row ─────────────────────────────────────────────────────────────
const MiniStat = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 14px",
      background: "#fffdf9",
      border: "1px solid #e8dcc8",
      borderRadius: 10,
      fontFamily: "Nunito, sans-serif",
    }}
  >
    <span style={{ fontSize: 13, color: "#b89060", fontWeight: 600 }}>
      {label}
    </span>
    <strong style={{ fontSize: 13, color: "#3d2a10", fontWeight: 800 }}>
      {value}
    </strong>
  </div>
);

// ── Section Heading ───────────────────────────────────────────────────────────
const SectionHeading = ({ children }) => (
  <h3
    style={{
      fontSize: 13,
      fontWeight: 800,
      color: "#c8a87a",
      letterSpacing: "1.2px",
      textTransform: "uppercase",
      margin: "0 0 12px",
      fontFamily: "Nunito, sans-serif",
    }}
  >
    {children}
  </h3>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.get("http://127.0.0.1:3000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        console.log("📊 Dashboard data received:", response.data.data);
        console.log("📈 Charts data:", response.data.data.charts);
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message || "Failed to load dashboard");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      } else {
        setError(err.response?.data?.message || "Error loading dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          fontFamily: "Nunito, sans-serif",
          fontSize: 15,
          fontWeight: 700,
          color: "#b89060",
        }}
      >
        Loading Dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          fontFamily: "Nunito, sans-serif",
          fontSize: 14,
          color: "#c0392b",
          fontWeight: 700,
        }}
      >
        Error: {error}
      </div>
    );
  }

  const gap = { display: "flex", flexDirection: "column", gap: 12 };

  return (
    <div
      style={{
        fontFamily: "Nunito, sans-serif",
        color: "#3d2a10",
        padding: "4px 0",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              color: "#c8a87a",
              margin: "0 0 4px",
            }}
          >
            Overview
          </p>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#3d2a10",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Dashboard
          </h2>
          <p
            style={{
              color: "#b89060",
              fontSize: 13,
              margin: "4px 0 0",
              fontWeight: 600,
            }}
          >
            Welcome back, {user?.Name || "User"}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              background: "#f3e5d8",
              color: "#c8965a",
              padding: "4px 14px",
              borderRadius: 20,
            }}
          >
            {user?.role?.toUpperCase()}
          </span>
          <span style={{ fontSize: 13, color: "#b89060", fontWeight: 700 }}>
            {user?.Name}
          </span>
        </div>
      </div>

      {/* ===== ADMIN DASHBOARD ===== */}
      {dashboardData?.role === "admin" && (
        <div style={gap}>
          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            <StatCard
              icon="👥"
              title="Total Users"
              value={dashboardData.users?.total || 0}
              sub={`Admins: ${dashboardData.users?.admins} · Employees: ${dashboardData.users?.employees} · Users: ${dashboardData.users?.regularUsers}`}
            />
            <StatCard
              icon="💰"
              title="Total Revenue"
              value={`Rs. ${dashboardData.total?.revenue?.toLocaleString()}`}
              sub={`Total Bills: ${dashboardData.total?.bills}`}
            />
            <StatCard
              icon="📦"
              title="Products"
              value={dashboardData.total?.products}
              sub="In Stock"
            />
            <StatCard
              icon="👨‍💼"
              title="Employees"
              value={dashboardData.total?.employees}
              sub={`Active: ${dashboardData.total?.activeEmployees}`}
            />
          </div>

          {/* Today's Performance */}
          <div
            style={{
              background: "#fffdf9",
              border: "1px solid #e8dcc8",
              borderRadius: 12,
              padding: "18px 22px",
            }}
          >
            <SectionHeading>Today's Performance</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <MiniStat
                label="Daily Sales"
                value={`Rs. ${dashboardData.daily?.sales?.toLocaleString()}`}
              />
              <MiniStat
                label="Bills Created"
                value={dashboardData.daily?.bills}
              />
            </div>
          </div>

          {/* Charts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 14,
            }}
          >
            <SimpleChart
              title="Daily Sales — Last 7 Days"
              data={
                dashboardData.charts?.last7Days?.map((d) => ({
                  label: d.date,
                  value: d.sales,
                })) || []
              }
            />
            <SimpleChart
              title="Monthly Revenue — Last 6 Months"
              data={
                dashboardData.charts?.last6Months?.map((d) => ({
                  label: d.month,
                  value: d.sales,
                })) || []
              }
            />
          </div>

          {/* Payment Methods */}
          <div
            style={{
              background: "#fffdf9",
              border: "1px solid #e8dcc8",
              borderRadius: 12,
              padding: "18px 22px",
            }}
          >
            <SectionHeading>Payment Methods</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
              }}
            >
              {[
                {
                  icon: "💵",
                  label: "Cash",
                  value: dashboardData.total?.paymentMethods?.cash,
                },
                {
                  icon: "💳",
                  label: "Card",
                  value: dashboardData.total?.paymentMethods?.card,
                },
                {
                  icon: "🌐",
                  label: "Online",
                  value: dashboardData.total?.paymentMethods?.online,
                },
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    background: "#f9f1e8",
                    border: "1px solid #e8dcc8",
                    borderRadius: 10,
                    padding: "14px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#b89060",
                      fontWeight: 700,
                      margin: "0 0 4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#3d2a10",
                      margin: 0,
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== EMPLOYEE DASHBOARD ===== */}
      {dashboardData?.role === "employee" && (
        <div style={gap}>
          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            <StatCard
              icon="💰"
              title="Total Revenue"
              value={`Rs. ${dashboardData.total?.revenue?.toLocaleString()}`}
              sub={`Total Bills: ${dashboardData.total?.bills}`}
            />
            <StatCard
              icon="📊"
              title="Today's Sales"
              value={`Rs. ${dashboardData.daily?.sales?.toLocaleString()}`}
              sub={`Bills: ${dashboardData.daily?.bills}`}
            />
            <StatCard
              icon="📦"
              title="Products"
              value={dashboardData.total?.products}
              sub="Available"
            />
            <StatCard
              icon="👥"
              title="Team Members"
              value={dashboardData.total?.employees}
              sub="Employees"
            />
          </div>

          {/* Monthly Overview */}
          <div
            style={{
              background: "#fffdf9",
              border: "1px solid #e8dcc8",
              borderRadius: 12,
              padding: "18px 22px",
            }}
          >
            <SectionHeading>Monthly Overview</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <MiniStat
                label="Monthly Sales"
                value={`Rs. ${dashboardData.monthly?.sales?.toLocaleString()}`}
              />
              <MiniStat
                label="Bills This Month"
                value={dashboardData.monthly?.bills}
              />
            </div>
          </div>

          {/* Charts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 14,
            }}
          >
            <SimpleChart
              title="Daily Sales — Last 7 Days"
              data={
                dashboardData.charts?.last7Days?.map((d) => ({
                  label: d.date,
                  value: d.sales,
                })) || []
              }
            />
            <SimpleChart
              title="Monthly Revenue — Last 6 Months"
              data={
                dashboardData.charts?.last6Months?.map((d) => ({
                  label: d.month,
                  value: d.sales,
                })) || []
              }
            />
          </div>

          {/* Quick Actions */}
          <div
            style={{
              background: "#fffdf9",
              border: "1px solid #e8dcc8",
              borderRadius: 12,
              padding: "18px 22px",
            }}
          >
            <SectionHeading>Quick Actions</SectionHeading>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                style={{
                  background: "linear-gradient(135deg, #c8965a, #e8b87a)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 22px",
                  fontSize: 13,
                  fontWeight: 800,
                  fontFamily: "Nunito, sans-serif",
                  cursor: "pointer",
                  letterSpacing: "0.3px",
                }}
                onClick={() => (window.location.href = "/employee/billing")}
              >
                📋 Manage Billings
              </button>
              <button
                style={{
                  background: "#f3e5d8",
                  color: "#c8965a",
                  border: "1px solid #e8c8a0",
                  borderRadius: 10,
                  padding: "10px 22px",
                  fontSize: 13,
                  fontWeight: 800,
                  fontFamily: "Nunito, sans-serif",
                  cursor: "pointer",
                }}
                onClick={() => (window.location.href = "/employee/products")}
              >
                📦 View Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
