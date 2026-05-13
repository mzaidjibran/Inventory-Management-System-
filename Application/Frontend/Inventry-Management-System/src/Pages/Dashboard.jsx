import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactApexChart from "react-apexcharts";
const Chart = ReactApexChart.default || ReactApexChart;
import Topbar from "../components/Topbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { getUserRole } from "../Api/authApi.js";

const API_BASE = "http://localhost:3000";

const getToken = () => localStorage.getItem("accessToken");

const fetchDashboard = async () => {
  const res = await fetch(`${API_BASE}/api/dashboard`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || "Failed to fetch dashboard");
    err.status = res.status;
    throw err;
  }
  return data.data;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userName = localStorage.getItem("userName") || "User";
  const userRole = getUserRole();
  const isAdmin = userRole === "admin";

  useEffect(() => {
    fetchDashboard()
      .then(setStats)
      .catch((e) => {
        if (e && e.status === 401) {
          toast.error("Session expired — please sign in again");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/signin");
          return;
        }
        setError(e.message || String(e));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fullscreenBtn = document.querySelector(
        '[data-toggle="fullscreen"]',
      );
      if (fullscreenBtn) {
        fullscreenBtn.onclick = () => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        };
      }

      const darkModeBtn = document.getElementById("light-dark-mode");
      if (darkModeBtn) {
        darkModeBtn.onclick = () => {
          const html = document.documentElement;
          if (html.getAttribute("data-bs-theme") === "dark") {
            html.removeAttribute("data-bs-theme");
            localStorage.setItem("theme", "light");
          } else {
            html.setAttribute("data-bs-theme", "dark");
            localStorage.setItem("theme", "dark");
          }
        };
      }

      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-bs-theme", "dark");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // ── Chart: Last 7 Days Bar Chart ─────────────────────────────────────────
  const barChartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: stats?.charts?.last7Days?.map((d) => d.date) || [],
      labels: {
        style: {
          fontSize: "11px",
          fontFamily: "Nunito, sans-serif",
          colors: "#9a7550",
        },
      },
      axisBorder: { color: "#e8dcc8" },
      axisTicks: { color: "#e8dcc8" },
    },
    yaxis: {
      labels: {
        formatter: (val) => `Rs ${Number(val).toLocaleString()}`,
        style: {
          fontSize: "11px",
          fontFamily: "Nunito, sans-serif",
          colors: "#9a7550",
        },
      },
    },
    colors: ["#c8965a"],
    tooltip: {
      y: { formatter: (val) => `Rs ${Number(val).toLocaleString()}` },
      style: { fontFamily: "Nunito, sans-serif" },
    },
    grid: { borderColor: "#f0e4d0", strokeDashArray: 4 },
  };

  const barChartSeries = [
    {
      name: "Daily Sales",
      data: stats?.charts?.last7Days?.map((d) => d.sales) || [],
    },
  ];

  // ── Chart: Last 6 Months Line Chart ──────────────────────────────────────
  const lineChartOptions = {
    chart: { type: "area", toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2.5 },
    xaxis: {
      categories: stats?.charts?.last6Months?.map((d) => d.month) || [],
      labels: {
        style: {
          fontSize: "11px",
          fontFamily: "Nunito, sans-serif",
          colors: "#9a7550",
        },
      },
      axisBorder: { color: "#e8dcc8" },
    },
    yaxis: {
      labels: {
        formatter: (val) => `Rs ${Number(val).toLocaleString()}`,
        style: {
          fontSize: "11px",
          fontFamily: "Nunito, sans-serif",
          colors: "#9a7550",
        },
      },
    },
    colors: ["#c8965a", "#a05a2c"],
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05 },
    },
    tooltip: {
      y: { formatter: (val) => `Rs ${Number(val).toLocaleString()}` },
      style: { fontFamily: "Nunito, sans-serif" },
    },
    grid: { borderColor: "#f0e4d0", strokeDashArray: 4 },
    legend: {
      position: "top",
      fontFamily: "Nunito, sans-serif",
      fontSize: "12px",
    },
  };

  const lineChartSeries = [
    {
      name: "Monthly Sales",
      data: stats?.charts?.last6Months?.map((d) => d.sales) || [],
    },
    {
      name: "Bills Count",
      data: stats?.charts?.last6Months?.map((d) => d.bills * 1000) || [],
    },
  ];

  // ── Chart: Donut — Payment Methods ───────────────────────────────────────
  const donutOptions = {
    chart: { type: "donut" },
    labels: ["Cash", "Card", "Online"],
    colors: ["#c8965a", "#8b5e2a", "#e8c49a"],
    legend: {
      position: "bottom",
      fontFamily: "Nunito, sans-serif",
      fontSize: "12px",
    },
    dataLabels: {
      enabled: true,
      style: { fontFamily: "Nunito, sans-serif", fontSize: "11px" },
    },
    plotOptions: { pie: { donut: { size: "65%" } } },
  };

  const donutSeries = [
    stats?.total?.paymentMethods?.cash || 0,
    stats?.total?.paymentMethods?.card || 0,
    stats?.total?.paymentMethods?.online || 0,
  ];

  if (loading) {
    return (
      <div id="layout-wrapper">
        <Topbar />
        <Sidebar />
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="text-center py-5">
                <div
                  className="spinner-border"
                  role="status"
                  style={{ color: "#c8965a" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p
                  className="mt-2"
                  style={{ color: "#b89060", fontFamily: "Nunito, sans-serif" }}
                >
                  Loading Dashboard...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Shared style tokens ────────────────────────────────────────────────────
  const CARD = {
    background: "#fffdf9",
    border: "1px solid #e8dcc8",
    borderRadius: 14,
    boxShadow: "0 2px 12px rgba(139,101,50,0.07)",
    overflow: "hidden",
  };
  const CARD_HEADER = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 18px",
    borderBottom: "1px solid #f0e4d0",
    background: "linear-gradient(135deg,#fffdf9,#fef6ea)",
  };
  const CARD_TITLE = {
    margin: 0,
    fontSize: 13.5,
    fontWeight: 700,
    color: "#5c3d11",
    fontFamily: "Nunito, sans-serif",
    letterSpacing: "0.2px",
  };
  const CARD_ICON = {
    width: 32,
    height: 32,
    borderRadius: 9,
    background: "linear-gradient(135deg,#f5ddb8,#eac990)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };
  const STAT_VAL = {
    fontSize: 20,
    fontWeight: 800,
    color: "#5c3d11",
    fontFamily: "Nunito, sans-serif",
    margin: 0,
    lineHeight: 1.1,
  };
  const LABEL = {
    fontSize: 11.5,
    color: "#b89060",
    fontFamily: "Nunito, sans-serif",
    fontWeight: 600,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  return (
    <>
      {/* ── Google Font ─────────────────────────────── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .dash-page { background: #fdf8f2; min-height: 100vh; }

        /* ── Stat card hover ── */
        .stat-card {
          transition: transform 0.18s, box-shadow 0.18s;
          cursor: default;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(139,101,50,0.12) !important;
        }

        /* ── Table ── */
        .warm-table { width: 100%; border-collapse: collapse; font-family: Nunito, sans-serif; }
        .warm-table thead tr { background: linear-gradient(135deg,#3d2a10,#5c3d11); }
        .warm-table thead th {
          padding: 11px 14px;
          font-size: 11px;
          font-weight: 700;
          color: #f5e6cc;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          border: none;
        }
        .warm-table tbody tr { border-bottom: 1px solid #f0e4d0; transition: background 0.15s; }
        .warm-table tbody tr:hover { background: #fef6ea; }
        .warm-table tbody td {
          padding: 10px 14px;
          font-size: 13px;
          color: #7a5c38;
          font-weight: 600;
          border: none;
          vertical-align: middle;
        }

        /* ── Badge ── */
        .warm-badge {
          display: inline-block;
          padding: 3px 9px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          font-family: Nunito, sans-serif;
          letter-spacing: 0.3px;
        }
        .badge-cash   { background:#e8f5e9; color:#2e7d32; }
        .badge-card   { background:#e3f0ff; color:#1565c0; }
        .badge-online { background:#e0f7fa; color:#00695c; }
        .badge-done   { background:#e8f5e9; color:#2e7d32; }
        .badge-pend   { background:#fff8e1; color:#e65100; }
        .badge-inv    { background:#f3e5d8; color:#7a4a14; }
        .badge-danger { background:#fdecea; color:#c62828; }
        .badge-warn   { background:#fff8e1; color:#e65100; }
        .badge-info   { background:#e3f0ff; color:#1565c0; }

        /* ── Notification item ── */
        .notif-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #f0e4d0;
          transition: background 0.15s;
        }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: #fef6ea; }
        .notif-dot {
          width: 34px; height: 34px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 14px;
        }
        .notif-dot-danger { background:#fdecea; color:#c62828; }
        .notif-dot-info   { background:#e3f0ff; color:#1565c0; }
        .notif-dot-ok     { background:#e8f5e9; color:#2e7d32; }
        .notif-dot-warm   { background:#f3e5d8; color:#c8965a; }
        .notif-title  { font-size:13px; font-weight:700; color:#5c3d11; font-family:Nunito,sans-serif; margin:0 0 2px; }
        .notif-sub    { font-size:11.5px; color:#b89060; font-family:Nunito,sans-serif; margin:0; }

        /* ── Store overview mini cards ── */
        .overview-mini {
          background: linear-gradient(135deg,#fffdf9,#fef6ea);
          border: 1px solid #e8dcc8;
          border-radius: 12px;
          padding: 14px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .overview-mini:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(139,101,50,0.1);
        }

        /* ── Section label ── */
        .section-lbl {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: #c8a87a;
          font-family: Nunito, sans-serif;
          margin: 0 0 10px;
        }

        /* ── Progress bar ── */
        .warm-progress {
          height: 5px;
          background: #f0e4d0;
          border-radius: 10px;
          overflow: hidden;
          margin-top: 8px;
        }
        .warm-progress-fill {
          height: 100%;
          border-radius: 10px;
          background: linear-gradient(90deg,#c8965a,#e0b070);
          transition: width 0.6s ease;
        }

        /* ── Timeline ── */
        .tl-item {
          display: flex;
          gap: 12px;
          padding: 9px 0;
          border-bottom: 1px solid #f0e4d0;
        }
        .tl-item:last-child { border-bottom: none; }
        .tl-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #c8965a;
          flex-shrink: 0;
          margin-top: 5px;
        }
        .tl-text  { font-size:12.5px; color:#7a5c38; font-family:Nunito,sans-serif; font-weight:600; }
        .tl-date  { font-size:11px; color:#c8a87a; font-family:Nunito,sans-serif; }

        /* ── Low-stock alert banner ── */
        .low-stock-banner {
          background: linear-gradient(135deg,#fff5f5,#fdecea);
          border: 1px solid #f5c6c6;
          border-radius: 12px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* ── Right sidebar (offcanvas) ── */
        .rs-section-title {
          font-size:12px; font-weight:800; letter-spacing:1px;
          text-transform:uppercase; color:#c8a87a;
          font-family:Nunito,sans-serif; margin:0 0 12px;
        }
        .rs-stat-card {
          border: 1px solid #e8dcc8;
          border-radius:12px; padding:12px 14px; margin-bottom:10px;
          background: linear-gradient(135deg,#fffdf9,#fef6ea);
        }
        .rs-stat-label { font-size:11px; color:#b89060; font-family:Nunito,sans-serif; font-weight:600; margin-bottom:4px; }
        .rs-stat-val   { font-size:17px; font-weight:800; color:#5c3d11; font-family:Nunito,sans-serif; }
      `}</style>

      <div id="layout-wrapper" className="dash-page">
        <Topbar />
        <Sidebar />

        <div className="main-content">
          <div className="page-content" style={{ padding: "24px 20px" }}>
            <div className="container-fluid">
              {/* ── Page Header ───────────────────────────── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: 26,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div>
                  <p className="section-lbl" style={{ marginBottom: 4 }}>
                    Overview
                  </p>
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      fontFamily: "Nunito, sans-serif",
                      color: "#3d2a10",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {getGreeting()},{" "}
                    <span style={{ color: "#c8965a" }}>{userName}!</span>
                  </h2>
                  <p
                    style={{
                      color: "#b89060",
                      fontFamily: "Nunito, sans-serif",
                      fontSize: 13,
                      margin: "4px 0 0",
                    }}
                  >
                    {isAdmin
                      ? "Here's your store overview for today."
                      : "Here's what's happening today."}
                  </p>
                </div>

                <nav style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#b89060",
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Al-Nasri Stationary & Books
                  </span>
                  <span style={{ color: "#e8dcc8" }}>/</span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#c8965a",
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 700,
                      background: "#f3e5d8",
                      padding: "2px 10px",
                      borderRadius: 20,
                    }}
                  >
                    Dashboard
                  </span>
                </nav>
              </div>

              {/* ── Stat Cards Row 1 ───────────────────────── */}
              <div className="row g-3 mb-3">
                {/* Today's Sales */}
                <div className="col-xl-3 col-sm-6">
                  <div
                    className="stat-card"
                    style={{ ...CARD, padding: "18px 20px" }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <div
                        style={{
                          ...CARD_ICON,
                          background: "linear-gradient(135deg,#c8965a,#a0733a)",
                        }}
                      >
                        <i
                          className="mdi mdi-cash-multiple"
                          style={{ color: "#fff", fontSize: 16 }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={LABEL}>Today's Sales</p>
                        <p style={STAT_VAL}>
                          Rs {Number(stats?.daily?.sales || 0).toLocaleString()}
                        </p>
                      </div>
                      <div
                        style={{
                          background: "#e8f5e9",
                          color: "#2e7d32",
                          borderRadius: 20,
                          padding: "3px 9px",
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: "Nunito, sans-serif",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <i className="mdi mdi-receipt me-1" />
                        {stats?.daily?.bills || 0} bills
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Sales */}
                <div className="col-xl-3 col-sm-6">
                  <div
                    className="stat-card"
                    style={{ ...CARD, padding: "18px 20px" }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <div
                        style={{
                          ...CARD_ICON,
                          background: "linear-gradient(135deg,#8b5e2a,#6b4020)",
                        }}
                      >
                        <i
                          className="mdi mdi-trending-up"
                          style={{ color: "#fff", fontSize: 16 }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={LABEL}>Monthly Sales</p>
                        <p style={STAT_VAL}>
                          Rs{" "}
                          {Number(stats?.monthly?.sales || 0).toLocaleString()}
                        </p>
                      </div>
                      <div
                        style={{
                          background: "#e3f0ff",
                          color: "#1565c0",
                          borderRadius: 20,
                          padding: "3px 9px",
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: "Nunito, sans-serif",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <i className="mdi mdi-receipt me-1" />
                        {stats?.monthly?.bills || 0} bills
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Revenue — Admin only */}
                {isAdmin && (
                  <div className="col-xl-3 col-sm-6">
                    <div
                      className="stat-card"
                      style={{ ...CARD, padding: "18px 20px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                        }}
                      >
                        <div
                          style={{
                            ...CARD_ICON,
                            background:
                              "linear-gradient(135deg,#e8a020,#c47a10)",
                          }}
                        >
                          <i
                            className="mdi mdi-bank"
                            style={{ color: "#fff", fontSize: 16 }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={LABEL}>Total Revenue</p>
                          <p style={STAT_VAL}>
                            Rs{" "}
                            {Number(
                              stats?.total?.revenue || 0,
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#b89060",
                            fontFamily: "Nunito, sans-serif",
                            fontWeight: 600,
                          }}
                        >
                          {stats?.total?.bills || 0} total bills
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total Products */}
                <div className="col-xl-3 col-sm-6">
                  <div
                    className="stat-card"
                    style={{ ...CARD, padding: "18px 20px" }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <div
                        style={{
                          ...CARD_ICON,
                          background: "linear-gradient(135deg,#3d8a6e,#2c6e50)",
                        }}
                      >
                        <i
                          className="mdi mdi-package-variant"
                          style={{ color: "#fff", fontSize: 16 }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={LABEL}>Total Products</p>
                        <p style={STAT_VAL}>{stats?.total?.products || 0}</p>
                      </div>
                      {stats?.lowStockProducts?.length > 0 && (
                        <div
                          style={{
                            background: "#fdecea",
                            color: "#c62828",
                            borderRadius: 20,
                            padding: "3px 9px",
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: "Nunito, sans-serif",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <i className="mdi mdi-alert me-1" />
                          {stats?.lowStockProducts?.length} low
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Stat Cards Row 2 (Admin) + Low Stock Banner ── */}
              {(isAdmin || stats?.lowStockProducts?.length > 0) && (
                <div className="row g-3 mb-3">
                  {isAdmin && (
                    <div className="col-xl-3 col-sm-6">
                      <div
                        className="stat-card"
                        style={{ ...CARD, padding: "18px 20px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          <div
                            style={{
                              ...CARD_ICON,
                              background:
                                "linear-gradient(135deg,#5b6fd6,#3d52b0)",
                            }}
                          >
                            <i
                              className="mdi mdi-account-group"
                              style={{ color: "#fff", fontSize: 16 }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={LABEL}>Employees</p>
                            <p style={STAT_VAL}>
                              {stats?.total?.employees || 0}
                            </p>
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#2e7d32",
                              fontFamily: "Nunito, sans-serif",
                              fontWeight: 700,
                              background: "#e8f5e9",
                              padding: "3px 9px",
                              borderRadius: 20,
                            }}
                          >
                            {stats?.total?.activeEmployees || 0} active
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="col-xl-3 col-sm-6">
                      <div
                        className="stat-card"
                        style={{ ...CARD, padding: "18px 20px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          <div
                            style={{
                              ...CARD_ICON,
                              background:
                                "linear-gradient(135deg,#2e9688,#1b7060)",
                            }}
                          >
                            <i
                              className="mdi mdi-account-tie"
                              style={{ color: "#fff", fontSize: 16 }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={LABEL}>Total Clients</p>
                            <p style={STAT_VAL}>{stats?.total?.clients || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {stats?.lowStockProducts?.length > 0 && (
                    <div className={isAdmin ? "col-xl-6" : "col-12"}>
                      <div className="low-stock-banner">
                        <i
                          className="mdi mdi-alert-circle"
                          style={{
                            color: "#c62828",
                            fontSize: 20,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontWeight: 800,
                            color: "#c62828",
                            fontFamily: "Nunito, sans-serif",
                            fontSize: 13,
                          }}
                        >
                          Low Stock Alert:
                        </span>
                        {stats.lowStockProducts.map((p) => (
                          <span key={p._id} className="warm-badge badge-danger">
                            {p.title} ({p.stockQuantity} left)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Charts Row 1 ──────────────────────────── */}
              <div className="row g-3 mb-3">
                {/* Bar Chart */}
                <div className="col-xl-8">
                  <div style={CARD}>
                    <div style={CARD_HEADER}>
                      <div style={CARD_ICON}>
                        <i
                          className="fas fa-chart-bar"
                          style={{ color: "#c8965a", fontSize: 13 }}
                        />
                      </div>
                      <h4 style={CARD_TITLE}>Last 7 Days Sales</h4>
                    </div>
                    <div style={{ padding: "16px 10px 8px" }}>
                      <Chart
                        options={barChartOptions}
                        series={barChartSeries}
                        type="bar"
                        height={290}
                      />
                    </div>
                  </div>
                </div>

                {/* Donut Chart */}
                <div className="col-xl-4">
                  <div style={CARD}>
                    <div style={CARD_HEADER}>
                      <div style={CARD_ICON}>
                        <i
                          className="fas fa-chart-pie"
                          style={{ color: "#c8965a", fontSize: 13 }}
                        />
                      </div>
                      <h4 style={CARD_TITLE}>Payment Methods</h4>
                    </div>
                    <div style={{ padding: "16px 10px 8px" }}>
                      <Chart
                        options={donutOptions}
                        series={donutSeries}
                        type="donut"
                        height={290}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Monthly Line Chart ────────────────────── */}
              <div className="row g-3 mb-3">
                <div className="col-12">
                  <div style={CARD}>
                    <div style={CARD_HEADER}>
                      <div style={CARD_ICON}>
                        <i
                          className="fas fa-chart-line"
                          style={{ color: "#c8965a", fontSize: 13 }}
                        />
                      </div>
                      <h4 style={CARD_TITLE}>6 Months Sales Overview</h4>
                    </div>
                    <div style={{ padding: "16px 10px 8px" }}>
                      <Chart
                        options={lineChartOptions}
                        series={lineChartSeries}
                        type="area"
                        height={290}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Recent Bills + Low Stock Table ────────── */}
              <div className="row g-3 mb-3">
                <div className={isAdmin ? "col-xl-8" : "col-12"}>
                  <div style={CARD}>
                    <div style={CARD_HEADER}>
                      <div style={CARD_ICON}>
                        <i
                          className="fas fa-receipt"
                          style={{ color: "#c8965a", fontSize: 13 }}
                        />
                      </div>
                      <h4 style={CARD_TITLE}>Recent Bills</h4>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table className="warm-table">
                        <thead>
                          <tr>
                            <th>Invoice #</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats?.recentBills?.length === 0 ? (
                            <tr>
                              <td
                                colSpan={5}
                                style={{
                                  textAlign: "center",
                                  padding: "28px",
                                  color: "#b89060",
                                }}
                              >
                                No bills found
                              </td>
                            </tr>
                          ) : (
                            stats?.recentBills?.map((bill) => (
                              <tr key={bill._id}>
                                <td>
                                  <span className="warm-badge badge-inv">
                                    {bill.invoiceNumber || "—"}
                                  </span>
                                </td>
                                <td
                                  style={{ fontWeight: 800, color: "#5c3d11" }}
                                >
                                  Rs{" "}
                                  {Number(
                                    bill.totalAmount || 0,
                                  ).toLocaleString()}
                                </td>
                                <td>
                                  <span
                                    className={`warm-badge ${
                                      bill.paymentMethod === "cash"
                                        ? "badge-cash"
                                        : bill.paymentMethod === "card"
                                          ? "badge-card"
                                          : "badge-online"
                                    }`}
                                  >
                                    {bill.paymentMethod || "—"}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className={`warm-badge ${
                                      bill.status === "completed"
                                        ? "badge-done"
                                        : "badge-pend"
                                    }`}
                                  >
                                    {bill.status || "—"}
                                  </span>
                                </td>
                                <td style={{ color: "#b89060" }}>
                                  {bill.createdAt
                                    ? new Date(
                                        bill.createdAt,
                                      ).toLocaleDateString("en-PK")
                                    : "—"}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Low Stock Table — Admin only */}
                {isAdmin && (
                  <div className="col-xl-4">
                    <div style={CARD}>
                      <div style={CARD_HEADER}>
                        <div
                          style={{
                            ...CARD_ICON,
                            background:
                              "linear-gradient(135deg,#e87070,#c62828)",
                          }}
                        >
                          <i
                            className="mdi mdi-alert"
                            style={{ color: "#fff", fontSize: 14 }}
                          />
                        </div>
                        <h4 style={CARD_TITLE}>Low Stock Products</h4>
                      </div>
                      <div style={{ overflowX: "auto" }}>
                        <table className="warm-table">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Stock</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats?.lowStockProducts?.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={2}
                                  style={{
                                    textAlign: "center",
                                    padding: "28px",
                                    color: "#b89060",
                                  }}
                                >
                                  <i
                                    className="mdi mdi-check-circle me-1"
                                    style={{ color: "#2e7d32" }}
                                  />
                                  Stock is available
                                </td>
                              </tr>
                            ) : (
                              stats?.lowStockProducts?.map((p) => (
                                <tr key={p._id}>
                                  <td
                                    style={{
                                      fontWeight: 700,
                                      color: "#5c3d11",
                                    }}
                                  >
                                    {p.title}
                                  </td>
                                  <td>
                                    <span
                                      className={`warm-badge ${
                                        p.stockQuantity === 0
                                          ? "badge-danger"
                                          : p.stockQuantity <= 3
                                            ? "badge-warn"
                                            : "badge-info"
                                      }`}
                                    >
                                      {p.stockQuantity} left
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Notifications + Store Overview ────────── */}
              <div className="row g-3 mb-3">
                {/* Notifications */}
                <div className="col-xl-6">
                  <div style={CARD}>
                    <div style={CARD_HEADER}>
                      <div style={CARD_ICON}>
                        <i
                          className="fa fa-bell"
                          style={{ color: "#c8965a", fontSize: 13 }}
                        />
                      </div>
                      <h4 style={CARD_TITLE}>Notifications</h4>
                    </div>
                    <div>
                      {/* Low stock notifications */}
                      {stats?.lowStockProducts?.length > 0 ? (
                        stats.lowStockProducts.map((p) => (
                          <div className="notif-item" key={p._id}>
                            <div className="notif-dot notif-dot-danger">
                              <i className="mdi mdi-alert" />
                            </div>
                            <div>
                              <p className="notif-title">
                                Low Stock: {p.title}
                              </p>
                              <p className="notif-sub">
                                Only {p.stockQuantity} items left
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="notif-item">
                          <div className="notif-dot notif-dot-ok">
                            <i className="mdi mdi-check" />
                          </div>
                          <div>
                            <p className="notif-title">
                              All products well stocked
                            </p>
                            <p className="notif-sub">No low stock alerts</p>
                          </div>
                        </div>
                      )}

                      {/* Daily bills */}
                      <div className="notif-item">
                        <div className="notif-dot notif-dot-info">
                          <i className="fa fa-receipt" />
                        </div>
                        <div>
                          <p className="notif-title">
                            {stats?.daily?.bills || 0} bills generated today
                          </p>
                          <p className="notif-sub">
                            Total: Rs{" "}
                            {Number(stats?.daily?.sales || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Monthly summary */}
                      <div className="notif-item">
                        <div className="notif-dot notif-dot-warm">
                          <i className="fa fa-chart-line" />
                        </div>
                        <div>
                          <p className="notif-title">Monthly target progress</p>
                          <p className="notif-sub">
                            Rs{" "}
                            {Number(
                              stats?.monthly?.sales || 0,
                            ).toLocaleString()}{" "}
                            this month
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Overview — Admin only */}
                {isAdmin && (
                  <div className="col-xl-6">
                    <div style={CARD}>
                      <div style={CARD_HEADER}>
                        <div style={CARD_ICON}>
                          <i
                            className="fas fa-tachometer-alt"
                            style={{ color: "#c8965a", fontSize: 13 }}
                          />
                        </div>
                        <h4 style={CARD_TITLE}>Store Overview</h4>
                      </div>
                      <div style={{ padding: "16px" }}>
                        <div className="row g-3">
                          {[
                            {
                              label: "Total Bills",
                              value: stats?.total?.bills || 0,
                              icon: "mdi mdi-receipt",
                              bg: "#c8965a",
                            },
                            {
                              label: "Total Products",
                              value: stats?.total?.products || 0,
                              icon: "mdi mdi-package-variant",
                              bg: "#3d8a6e",
                            },
                            {
                              label: "Employees",
                              value: stats?.total?.employees || 0,
                              icon: "mdi mdi-account-group",
                              bg: "#5b6fd6",
                            },
                            {
                              label: "Clients",
                              value: stats?.total?.clients || 0,
                              icon: "mdi mdi-account-tie",
                              bg: "#e8a020",
                            },
                          ].map((item) => (
                            <div className="col-6" key={item.label}>
                              <div className="overview-mini">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 36,
                                      height: 36,
                                      borderRadius: 10,
                                      background: item.bg,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                    }}
                                  >
                                    <i
                                      className={item.icon}
                                      style={{ color: "#fff", fontSize: 16 }}
                                    />
                                  </div>
                                  <div>
                                    <p style={{ ...LABEL, marginBottom: 2 }}>
                                      {item.label}
                                    </p>
                                    <p style={{ ...STAT_VAL, fontSize: 18 }}>
                                      {item.value}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <footer
            style={{
              borderTop: "1px solid #e8dcc8",
              padding: "14px 24px",
              background: "#fffdf9",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            <div className="container-fluid">
              <div className="row align-items-center">
                <div
                  className="col-sm-6"
                  style={{ fontSize: 12, color: "#b89060", fontWeight: 600 }}
                >
                  {new Date().getFullYear()} © Mango Technologies
                </div>
                <div
                  className="col-sm-6 text-sm-end d-none d-sm-block"
                  style={{ fontSize: 12, color: "#b89060" }}
                >
                  Designed & Developed by{" "}
                  <a
                    href="#"
                    style={{
                      color: "#c8965a",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Mango Technologies
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* ── Theme Changer ──
        <div className="custom-setting bg-primary pe-0 d-flex flex-column rounded-start">
          <button
            type="button"
            className="btn btn-wide border-0 text-white fs-20 avatar-sm rounded-end-0"
            id="light-dark-mode"
          >
            <i className="mdi mdi-brightness-7 align-middle" />
            <i className="mdi mdi-white-balance-sunny align-middle" />
          </button>
          <button
            type="button"
            className="btn btn-wide border-0 text-white fs-20 avatar-sm"
            data-toggle="fullscreen"
          >
            <i className="mdi mdi-arrow-expand-all align-middle" />
          </button>
        </div> */}

        {/* ── Right Sidebar (offcanvas) ── */}
        <div className="offcanvas offcanvas-end" id="offcanvas-rightsidabar">
          <div
            className="card h-100 rounded-0"
            data-simplebar="init"
            style={{ background: "#fffdf9", border: "none" }}
          >
            <div
              className="card-header"
              style={{
                background: "linear-gradient(135deg,#fffdf9,#fef6ea)",
                borderBottom: "1px solid #e8dcc8",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h6
                style={{
                  margin: 0,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  color: "#c8a87a",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                Activities
              </h6>
              <button
                className="btn"
                data-bs-dismiss="offcanvas"
                style={{
                  color: "#c62828",
                  background: "#fdecea",
                  borderRadius: 8,
                  padding: "3px 10px",
                  fontSize: 12,
                }}
              >
                <i className="fa fa-times" />
              </button>
            </div>

            <div className="card-body" style={{ padding: "18px 16px" }}>
              {/* Store Summary */}
              <p className="rs-section-title">Store Summary</p>

              <div className="rs-stat-card">
                <p className="rs-stat-label">Today's Bills</p>
                <p className="rs-stat-val">{stats?.daily?.bills || 0}</p>
                <div className="warm-progress">
                  <div
                    className="warm-progress-fill"
                    style={{
                      width: `${Math.min(((stats?.daily?.bills || 0) / 20) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rs-stat-card">
                <p className="rs-stat-label">Today's Revenue</p>
                <p className="rs-stat-val">
                  Rs {Number(stats?.daily?.sales || 0).toLocaleString()}
                </p>
                <div className="warm-progress">
                  <div
                    className="warm-progress-fill"
                    style={{ width: "60%" }}
                  />
                </div>
              </div>

              <div className="rs-stat-card">
                <p className="rs-stat-label">Total Products</p>
                <p className="rs-stat-val">{stats?.total?.products || 0}</p>
                <div className="warm-progress">
                  <div
                    className="warm-progress-fill"
                    style={{ width: "75%" }}
                  />
                </div>
              </div>

              {isAdmin && (
                <div className="rs-stat-card">
                  <p className="rs-stat-label">Total Revenue</p>
                  <p className="rs-stat-val">
                    Rs {Number(stats?.total?.revenue || 0).toLocaleString()}
                  </p>
                  <div className="warm-progress">
                    <div
                      className="warm-progress-fill"
                      style={{ width: "80%" }}
                    />
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <p className="rs-section-title" style={{ marginTop: 24 }}>
                Recent Activity
              </p>
              {stats?.recentBills?.slice(0, 5).map((bill) => (
                <div className="tl-item" key={bill._id}>
                  <div className="tl-dot" style={{ marginTop: 6 }} />
                  <div style={{ flex: 1 }}>
                    <p className="tl-text">
                      Bill {bill.invoiceNumber} — Rs{" "}
                      {Number(bill.totalAmount || 0).toLocaleString()}
                    </p>
                    <p className="tl-date">
                      {bill.createdAt
                        ? new Date(bill.createdAt).toLocaleDateString("en-PK")
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
