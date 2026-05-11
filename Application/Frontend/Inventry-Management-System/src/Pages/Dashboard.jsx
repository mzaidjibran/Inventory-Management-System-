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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
          // clear tokens and redirect
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
      // Fullscreen
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

      // Dark/Light mode
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
    }, 500); // 500ms wait

    return () => clearTimeout(timer);
  }, []);

  // ── Chart: Last 7 Days Bar Chart ─────────────────────────────────────────
  const barChartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: stats?.charts?.last7Days?.map((d) => d.date) || [],
      labels: { style: { fontSize: "12px" } },
    },
    yaxis: {
      labels: {
        formatter: (val) => `Rs ${Number(val).toLocaleString()}`,
      },
    },
    colors: ["#556ee6"],
    tooltip: {
      y: { formatter: (val) => `Rs ${Number(val).toLocaleString()}` },
    },
    grid: { borderColor: "#f1f1f1" },
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
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: stats?.charts?.last6Months?.map((d) => d.month) || [],
    },
    yaxis: {
      labels: {
        formatter: (val) => `Rs ${Number(val).toLocaleString()}`,
      },
    },
    colors: ["#34c38f", "#556ee6"],
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 },
    },
    tooltip: {
      y: { formatter: (val) => `Rs ${Number(val).toLocaleString()}` },
    },
    grid: { borderColor: "#f1f1f1" },
    legend: { position: "top" },
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
    colors: ["#556ee6", "#34c38f", "#f1b44c"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
    plotOptions: {
      pie: { donut: { size: "65%" } },
    },
  };
  const donutSeries = [
    stats?.total?.paymentMethods?.cash || 0,
    stats?.total?.paymentMethods?.card || 0,
    stats?.total?.paymentMethods?.online || 0,
  ];

  if (loading) {
    return (
      <div id="layout-wrapper">
        <Topbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        <Sidebar isOpen={sidebarOpen} />
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading Dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="layout-wrapper">
      <Topbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            {/* ── Page Title ── */}
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fs-16 fw-semibold mb-1 mb-md-2">
                      {getGreeting()},{" "}
                      <span className="text-primary">{userName}!</span>
                    </h4>
                    <p className="text-muted mb-0">
                      {isAdmin
                        ? "Here's your store overview for today."
                        : "Here's what's happening today."}
                    </p>
                  </div>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <a href="#">Al-Nasri Stationary & Books</a>
                      </li>
                      <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Stats Cards ── */}
            <div className="row">
              {/* Daily Sales */}
              <div className="col-xl-3 col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-sm avatar-label-primary me-3">
                        <i className="mdi mdi-cash-multiple mt-1"></i>
                      </div>
                      <div className="flex-grow-1">
                        <p className="text-muted mb-1 text-truncate">
                          Today's Sales
                        </p>
                        <h4 className="mb-0">
                          Rs {Number(stats?.daily?.sales || 0).toLocaleString()}
                        </h4>
                      </div>
                      <div className="text-success ms-2">
                        <i className="mdi mdi-receipt me-1"></i>
                        <small>{stats?.daily?.bills || 0} bills</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Sales */}
              <div className="col-xl-3 col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-sm avatar-label-success me-3">
                        <i className="mdi mdi-trending-up mt-1"></i>
                      </div>
                      <div className="flex-grow-1">
                        <p className="text-muted mb-1 text-truncate">
                          Monthly Sales
                        </p>
                        <h4 className="mb-0">
                          Rs{" "}
                          {Number(stats?.monthly?.sales || 0).toLocaleString()}
                        </h4>
                      </div>
                      <div className="text-success ms-2">
                        <i className="mdi mdi-receipt me-1"></i>
                        <small>{stats?.monthly?.bills || 0} bills</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Revenue — Admin only */}
              {isAdmin && (
                <div className="col-xl-3 col-sm-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm avatar-label-warning me-3">
                          <i className="mdi mdi-bank mt-1"></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="text-muted mb-1 text-truncate">
                            Total Revenue
                          </p>
                          <h4 className="mb-0">
                            Rs{" "}
                            {Number(
                              stats?.total?.revenue || 0,
                            ).toLocaleString()}
                          </h4>
                        </div>
                        <div className="text-muted ms-2">
                          <small>{stats?.total?.bills || 0} total bills</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Total Products */}
              <div className="col-xl-3 col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-sm avatar-label-info me-3">
                        <i className="mdi mdi-package-variant mt-1"></i>
                      </div>
                      <div className="flex-grow-1">
                        <p className="text-muted mb-1 text-truncate">
                          Total Products
                        </p>
                        <h4 className="mb-0">{stats?.total?.products || 0}</h4>
                      </div>
                      {stats?.lowStockProducts?.length > 0 && (
                        <div className="text-danger ms-2">
                          <i className="mdi mdi-alert me-1"></i>
                          <small>{stats?.lowStockProducts?.length} low</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Second Row Stats ── */}
            <div className="row">
              {/* Employees — Admin only */}
              {isAdmin && (
                <div className="col-xl-3 col-sm-6">
                  <div className="card bg-primary-subtle">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm avatar-label-primary me-3">
                          <i className="mdi mdi-account-group mt-1"></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="text-muted mb-1">Total Employees</p>
                          <h4 className="mb-0">
                            {stats?.total?.employees || 0}
                          </h4>
                        </div>
                        <div className="text-success ms-2">
                          <small>
                            {stats?.total?.activeEmployees || 0} active
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Clients — Admin only */}
              {isAdmin && (
                <div className="col-xl-3 col-sm-6">
                  <div className="card bg-success-subtle">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm avatar-label-success me-3">
                          <i className="mdi mdi-account-tie mt-1"></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="text-muted mb-1">Total Clients</p>
                          <h4 className="mb-0">{stats?.total?.clients || 0}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Low Stock Alert */}
              {stats?.lowStockProducts?.length > 0 && (
                <div className="col-xl-6 col-sm-12">
                  <div className="card bg-danger-subtle border border-danger-subtle">
                    <div className="card-body py-2">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <i className="mdi mdi-alert-circle text-danger fs-5"></i>
                        <strong className="text-danger">
                          Low Stock Alert:
                        </strong>
                        {stats.lowStockProducts.map((p) => (
                          <span key={p._id} className="badge bg-danger">
                            {p.title} ({p.stockQuantity} left)
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Charts Row ── */}
            <div className="row">
              {/* 7 Days Bar Chart */}
              <div className="col-xl-8">
                <div className="card">
                  <div className="card-header">
                    <div className="card-icon">
                      <i className="fas fa-chart-bar fs-14 text-muted"></i>
                    </div>
                    <h4 className="card-title mb-0">Last 7 Days Sales</h4>
                  </div>
                  <div className="card-body">
                    <Chart
                      options={barChartOptions}
                      series={barChartSeries}
                      type="bar"
                      height={300}
                    />
                  </div>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="col-xl-4">
                <div className="card">
                  <div className="card-header">
                    <div className="card-icon">
                      <i className="fas fa-chart-pie fs-14 text-muted"></i>
                    </div>
                    <h4 className="card-title mb-0">Payment Methods</h4>
                  </div>
                  <div className="card-body">
                    <Chart
                      options={donutOptions}
                      series={donutSeries}
                      type="donut"
                      height={300}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Monthly Line Chart ── */}
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-icon">
                      <i className="fas fa-chart-line fs-14 text-muted"></i>
                    </div>
                    <h4 className="card-title mb-0">6 Months Sales Overview</h4>
                  </div>
                  <div className="card-body">
                    <Chart
                      options={lineChartOptions}
                      series={lineChartSeries}
                      type="area"
                      height={300}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Recent Bills Table ── */}
            <div className="row">
              <div className={isAdmin ? "col-xl-8" : "col-12"}>
                <div className="card">
                  <div className="card-header">
                    <div className="card-icon text-muted">
                      <i className="fas fa-receipt fs-14"></i>
                    </div>
                    <h4 className="card-title mb-0">Recent Bills</h4>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover table-bordered mb-0">
                        <thead className="table-dark">
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
                                className="text-center text-muted py-4"
                              >
                                No Bill Found
                              </td>
                            </tr>
                          ) : (
                            stats?.recentBills?.map((bill) => (
                              <tr key={bill._id}>
                                <td>
                                  <span className="badge bg-secondary">
                                    {bill.invoiceNumber || "—"}
                                  </span>
                                </td>
                                <td className="fw-bold text-success">
                                  Rs{" "}
                                  {Number(
                                    bill.totalAmount || 0,
                                  ).toLocaleString()}
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      bill.paymentMethod === "cash"
                                        ? "bg-success"
                                        : bill.paymentMethod === "card"
                                          ? "bg-primary"
                                          : "bg-info"
                                    }`}
                                  >
                                    {bill.paymentMethod || "—"}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      bill.status === "completed"
                                        ? "bg-success"
                                        : "bg-warning"
                                    }`}
                                  >
                                    {bill.status || "—"}
                                  </span>
                                </td>
                                <td className="text-muted">
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
              </div>

              {/* Low Stock Table — Admin only */}
              {isAdmin && (
                <div className="col-xl-4">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-icon text-muted">
                        <i className="mdi mdi-alert fs-14"></i>
                      </div>
                      <h4 className="card-title mb-0">Low Stock Products</h4>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-dark">
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
                                  className="text-center text-muted py-4"
                                >
                                  <i className="mdi mdi-check-circle text-success me-1"></i>
                                  Stock is available
                                </td>
                              </tr>
                            ) : (
                              stats?.lowStockProducts?.map((p) => (
                                <tr key={p._id}>
                                  <td className="fw-semibold">{p.title}</td>
                                  <td>
                                    <span
                                      className={`badge ${
                                        p.stockQuantity === 0
                                          ? "bg-danger"
                                          : p.stockQuantity <= 3
                                            ? "bg-warning"
                                            : "bg-info"
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
                </div>
              )}
            </div>

            {/* ── Notification Section — Template wala as-is ── */}
            <div className="row">
              <div className="col-xl-6">
                <div className="card">
                  <div className="card-header">
                    <div className="card-icon text-muted">
                      <i className="fa fa-bell"></i>
                    </div>
                    <h3 className="card-title">Notifications</h3>
                  </div>
                  <div className="card-body">
                    <div className="rich-list rich-list-bordered rich-list-action">
                      {/* Low stock notifications */}
                      {stats?.lowStockProducts?.length > 0 ? (
                        stats.lowStockProducts.map((p) => (
                          <div className="rich-list-item" key={p._id}>
                            <div className="rich-list-prepend">
                              <div className="avatar avatar-xs avatar-label-danger">
                                <div className="">
                                  <i className="mdi mdi-alert"></i>
                                </div>
                              </div>
                            </div>
                            <div className="rich-list-content">
                              <h4 className="rich-list-title mb-1">
                                Low Stock: {p.title}
                              </h4>
                              <p className="rich-list-subtitle mb-0">
                                Only {p.stockQuantity} items left
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rich-list-item">
                          <div className="rich-list-prepend">
                            <div className="avatar avatar-xs avatar-label-success">
                              <div className="">
                                <i className="mdi mdi-check"></i>
                              </div>
                            </div>
                          </div>
                          <div className="rich-list-content">
                            <h4 className="rich-list-title mb-1">
                              All products well stocked
                            </h4>
                            <p className="rich-list-subtitle mb-0">
                              No low stock alerts
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Daily bills notification */}
                      <div className="rich-list-item">
                        <div className="rich-list-prepend">
                          <div className="avatar avatar-xs avatar-label-info">
                            <div className="">
                              <i className="fa fa-receipt"></i>
                            </div>
                          </div>
                        </div>
                        <div className="rich-list-content">
                          <h4 className="rich-list-title mb-1">
                            {stats?.daily?.bills || 0} bills generated today
                          </h4>
                          <p className="rich-list-subtitle mb-0">
                            Total: Rs{" "}
                            {Number(stats?.daily?.sales || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Monthly summary */}
                      <div className="rich-list-item">
                        <div className="rich-list-prepend">
                          <div className="avatar avatar-xs avatar-label-success">
                            <div className="">
                              <i className="fa fa-chart-line"></i>
                            </div>
                          </div>
                        </div>
                        <div className="rich-list-content">
                          <h4 className="rich-list-title mb-1">
                            Monthly target progress
                          </h4>
                          <p className="rich-list-subtitle mb-0">
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
              </div>

              {/* Quick Stats — Admin only */}
              {isAdmin && (
                <div className="col-xl-6">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-icon text-muted">
                        <i className="fas fa-tachometer-alt fs-14"></i>
                      </div>
                      <h4 className="card-title mb-0">Store Overview</h4>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        {[
                          {
                            label: "Total Bills",
                            value: stats?.total?.bills || 0,
                            icon: "mdi mdi-receipt",
                            color: "primary",
                          },
                          {
                            label: "Total Products",
                            value: stats?.total?.products || 0,
                            icon: "mdi mdi-package-variant",
                            color: "info",
                          },
                          {
                            label: "Employees",
                            value: stats?.total?.employees || 0,
                            icon: "mdi mdi-account-group",
                            color: "success",
                          },
                          {
                            label: "Clients",
                            value: stats?.total?.clients || 0,
                            icon: "mdi mdi-account-tie",
                            color: "warning",
                          },
                        ].map((item) => (
                          <div className="col-6" key={item.label}>
                            <div
                              className={`border rounded p-3 border-${item.color}-subtle`}
                            >
                              <div className="d-flex align-items-center gap-2">
                                <i
                                  className={`${item.icon} text-${item.color} fs-4`}
                                ></i>
                                <div>
                                  <p className="text-muted mb-0 small">
                                    {item.label}
                                  </p>
                                  <h5 className="mb-0 fw-bold">{item.value}</h5>
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
        <footer className="footer">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-sm-6">
                {new Date().getFullYear()} © Mango technologies
              </div>
              <div className="col-sm-6">
                <div className="text-sm-end d-none d-sm-block">
                  Designed & Developed by{" "}
                  <a href="#" className="text-muted">
                    Mango Technologies
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* ── Theme Changer — Template as-is ── */}
      <div className="custom-setting bg-primary pe-0 d-flex flex-column rounded-start">
        <button
          type="button"
          className="btn btn-wide border-0 text-white fs-20 avatar-sm rounded-end-0"
          id="light-dark-mode"
        >
          <i className="mdi mdi-brightness-7 align-middle"></i>
          <i className="mdi mdi-white-balance-sunny align-middle"></i>
        </button>
        <button
          type="button"
          className="btn btn-wide border-0 text-white fs-20 avatar-sm"
          data-toggle="fullscreen"
        >
          <i className="mdi mdi-arrow-expand-all align-middle"></i>
        </button>
      </div>

      {/* ── Right Sidebar — Template as-is ── */}
      <div className="offcanvas offcanvas-end" id="offcanvas-rightsidabar">
        <div className="card h-100 rounded-0" data-simplebar="init">
          <div className="card-header bg-light">
            <h6 className="card-title text-uppercase">Activities</h6>
            <div className="card-addon">
              <button
                className="btn btn-label-danger"
                data-bs-dismiss="offcanvas"
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          </div>
          <div className="card-body">
            <div>
              <h3 className="card-title">Store Summary</h3>
              <div className="border rounded p-2 mb-2">
                <p className="text-muted mb-2">Today's Bills</p>
                <h4 className="fs-16 mb-2">{stats?.daily?.bills || 0}</h4>
                <div className="progress progress-sm" style={{ height: "4px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{
                      width: `${Math.min(((stats?.daily?.bills || 0) / 20) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="border rounded p-2 mb-2">
                <p className="text-muted mb-2">Today's Revenue</p>
                <h4 className="fs-16 mb-2">
                  Rs {Number(stats?.daily?.sales || 0).toLocaleString()}
                </h4>
                <div className="progress progress-sm" style={{ height: "4px" }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
              <div className="border rounded p-2 mb-2">
                <p className="text-muted mb-2">Total Products</p>
                <h4 className="fs-16 mb-2">{stats?.total?.products || 0}</h4>
                <div className="progress progress-sm" style={{ height: "4px" }}>
                  <div
                    className="progress-bar bg-warning"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              {isAdmin && (
                <div className="border rounded p-2 mb-2">
                  <p className="text-muted mb-2">Total Revenue</p>
                  <h4 className="fs-16 mb-2">
                    Rs {Number(stats?.total?.revenue || 0).toLocaleString()}
                  </h4>
                  <div
                    className="progress progress-sm"
                    style={{ height: "4px" }}
                  >
                    <div
                      className="progress-bar bg-info"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="card-title">Recent Activity</h3>
              <div className="timeline">
                {stats?.recentBills?.slice(0, 5).map((bill) => (
                  <div className="timeline-item" key={bill._id}>
                    <div className="timeline-pin">
                      <i className="marker marker-dot text-primary"></i>
                    </div>
                    <div className="timeline-content">
                      <div className="d-flex justify-content-between">
                        <p className="mb-0">
                          Bill {bill.invoiceNumber} — Rs{" "}
                          {Number(bill.totalAmount || 0).toLocaleString()}
                        </p>
                        <span className="text-muted" style={{ fontSize: 11 }}>
                          {bill.createdAt
                            ? new Date(bill.createdAt).toLocaleDateString(
                                "en-PK",
                              )
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}