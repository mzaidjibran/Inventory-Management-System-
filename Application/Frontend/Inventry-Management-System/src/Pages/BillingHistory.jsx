import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Topbar from "../components/Topbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import { getUserRole } from "../Api/authApi.js";

const API_BASE = "http://127.0.0.1:3000";
const getToken = () => localStorage.getItem("accessToken");

const fetchBillings = async () => {
  const res = await fetch(`${API_BASE}/api/billing?populate=items.product`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || "Failed to fetch billing history");
    err.status = res.status;
    throw err;
  }
  return data.data || [];
};

const deleteBill = async (id) => {
  const res = await fetch(`${API_BASE}/api/billing/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete bill");
  return data;
};

export default function BillingHistory() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const userRole = getUserRole();
  const isAdmin = userRole === "admin";

  const loadBills = async () => {
    setLoading(true);
    try {
      const data = await fetchBillings();
      setBills(data);
    } catch (e) {
      if (e?.status === 401) {
        toast.error("Session expired");
        navigate("/signin");
        return;
      }
      toast.error(e.message || "Failed to load billing history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  // ── Handle delete ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    setDeletingId(id);
    try {
      await deleteBill(id);
      toast.success("Bill deleted successfully");
      setBills((prev) => prev.filter((b) => b._id !== id));
    } catch (e) {
      toast.error(e.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Filter bills ──────────────────────────────────────────────────────
  const filtered = bills.filter((b) => {
    const matchSearch =
      !search ||
      (b.invoiceNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.paymentMethod || "").toLowerCase().includes(search.toLowerCase());

    const matchPayment =
      filterPayment === "all" || b.paymentMethod === filterPayment;
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    const matchDate =
      !filterDate ||
      new Date(b.createdAt).toLocaleDateString("en-CA") === filterDate;

    return matchSearch && matchPayment && matchStatus && matchDate;
  });

  // ── Totals ────────────────────────────────────────────────────────────
  const totalRevenue = filtered.reduce((s, b) => s + (b.totalAmount || 0), 0);
  const totalBills = filtered.length;
  const cashCount = filtered.filter((b) => b.paymentMethod === "cash").length;
  const cardCount = filtered.filter((b) => b.paymentMethod === "card").length;
  const onlineCount = filtered.filter(
    (b) => b.paymentMethod === "online",
  ).length;

  // ── Styles ────────────────────────────────────────────────────────────
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
  const LABEL = {
    fontSize: 11,
    color: "#b89060",
    fontFamily: "Nunito, sans-serif",
    fontWeight: 600,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  if (loading) {
    return (
      <div id="layout-wrapper">
        <Topbar />
        <Sidebar />
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid text-center py-5">
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
                Loading Billing History...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .bh-page { background: #fdf8f2; min-height: 100vh; }

        .warm-table { width: 100%; border-collapse: collapse; font-family: Nunito, sans-serif; }
        .warm-table thead tr { background: linear-gradient(135deg,#3d2a10,#5c3d11); }
        .warm-table thead th {
          padding: 11px 14px; font-size: 11px; font-weight: 700;
          color: #f5e6cc; letter-spacing: 0.8px; text-transform: uppercase; border: none;
        }
        .warm-table tbody tr { border-bottom: 1px solid #f0e4d0; transition: background 0.15s; }
        .warm-table tbody tr:hover { background: #fef6ea; }
        .warm-table tbody td {
          padding: 10px 14px; font-size: 13px; color: #7a5c38;
          font-weight: 600; border: none; vertical-align: middle;
        }

        .warm-badge {
          display: inline-block; padding: 3px 9px; border-radius: 20px;
          font-size: 11px; font-weight: 700; font-family: Nunito, sans-serif; letter-spacing: 0.3px;
        }
        .badge-cash   { background:#e8f5e9; color:#2e7d32; }
        .badge-card   { background:#e3f0ff; color:#1565c0; }
        .badge-online { background:#e0f7fa; color:#00695c; }
        .badge-done   { background:#e8f5e9; color:#2e7d32; }
        .badge-pend   { background:#fff8e1; color:#e65100; }
        .badge-inv    { background:#f3e5d8; color:#7a4a14; }

        .section-lbl {
          font-size: 10px; font-weight: 800; letter-spacing: 1.4px;
          text-transform: uppercase; color: #c8a87a;
          font-family: Nunito, sans-serif; margin: 0 0 10px;
        }

        /* Filter bar */
        .filter-bar {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          padding: 14px 18px; border-bottom: 1px solid #f0e4d0;
          background: #fffdf9;
        }
        .filter-input {
          padding: 7px 12px; border: 1px solid #e8dcc8; border-radius: 8px;
          font-size: 12.5px; font-family: Nunito, sans-serif; color: #5c3d11;
          background: #fffdf9; outline: none; transition: border-color 0.15s;
        }
        .filter-input:focus { border-color: #c8965a; }
        .filter-select {
          padding: 7px 10px; border: 1px solid #e8dcc8; border-radius: 8px;
          font-size: 12.5px; font-family: Nunito, sans-serif; color: #5c3d11;
          background: #fffdf9; outline: none; cursor: pointer;
        }

        /* Expanded row */
        .expanded-row td { padding: 0 !important; }
        .expanded-inner {
          background: #fef6ea;
          border-bottom: 2px solid #e8dcc8;
          padding: 16px 20px;
        }
        .items-table { width: 100%; border-collapse: collapse; font-family: Nunito, sans-serif; font-size: 12px; }
        .items-table th { padding: 7px 12px; background: #f5ddb8; color: #5c3d11; font-weight: 700; text-align: left; }
        .items-table td { padding: 7px 12px; border-bottom: 1px solid #e8dcc8; color: #7a5c38; font-weight: 600; }

        /* Delete btn */
        .del-btn {
          padding: 4px 10px; border-radius: 7px;
          background: #fdecea; color: #c62828; border: 1px solid #ef9a9a;
          font-size: 11px; font-weight: 700; font-family: Nunito, sans-serif;
          cursor: pointer; transition: all 0.15s;
        }
        .del-btn:hover { background: #c62828; color: #fff; }
        .del-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Expand btn */
        .exp-btn {
          padding: 4px 10px; border-radius: 7px;
          background: #f3e5d8; color: #7a4a14; border: 1px solid #e8c49a;
          font-size: 11px; font-weight: 700; font-family: Nunito, sans-serif;
          cursor: pointer; transition: all 0.15s;
        }
        .exp-btn:hover { background: #c8965a; color: #fff; }

        /* Stat cards */
        .bh-stat-card {
          background: #fffdf9; border: 1px solid #e8dcc8;
          border-radius: 12px; padding: 14px 16px;
          transition: transform 0.15s;
        }
        .bh-stat-card:hover { transform: translateY(-2px); }
      `}</style>

      <div id="layout-wrapper" className="bh-page">
        <Topbar />
        <Sidebar />

        <div className="main-content">
          <div className="page-content" style={{ padding: "24px 20px" }}>
            <div className="container-fluid">
              {/* ── Header ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: 24,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div>
                  <p className="section-lbl" style={{ marginBottom: 4 }}>
                    Records
                  </p>
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      fontFamily: "Nunito, sans-serif",
                      color: "#3d2a10",
                      margin: 0,
                    }}
                  >
                    Billing History
                  </h2>
                  <p
                    style={{
                      color: "#b89060",
                      fontFamily: "Nunito, sans-serif",
                      fontSize: 13,
                      margin: "4px 0 0",
                    }}
                  >
                    Complete record of all generated bills
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
                    Billing History
                  </span>
                </nav>
              </div>

              {/* ── Summary Stat Cards ── */}
              <div className="row g-3 mb-4">
                {[
                  {
                    label: "Total Bills",
                    value: totalBills,
                    icon: "mdi mdi-receipt",
                    color: "#c8965a",
                    textColor: "#5c3d11",
                  },
                  {
                    label: "Total Revenue",
                    value: `Rs ${totalRevenue.toLocaleString()}`,
                    icon: "mdi mdi-cash-multiple",
                    color: "#1D9E75",
                    textColor: "#064e3b",
                  },
                  {
                    label: "Cash Bills",
                    value: cashCount,
                    icon: "mdi mdi-cash",
                    color: "#2e9688",
                    textColor: "#134e4a",
                  },
                  {
                    label: "Card / Online",
                    value: `${cardCount} / ${onlineCount}`,
                    icon: "mdi mdi-credit-card-outline",
                    color: "#5b6fd6",
                    textColor: "#1e3a8a",
                  },
                ].map((s) => (
                  <div className="col-xl-3 col-sm-6" key={s.label}>
                    <div className="bh-stat-card">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 11,
                            background: s.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <i
                            className={s.icon}
                            style={{ color: "#fff", fontSize: 18 }}
                          />
                        </div>
                        <div>
                          <p style={LABEL}>{s.label}</p>
                          <p
                            style={{
                              fontSize: 18,
                              fontWeight: 800,
                              color: s.textColor,
                              fontFamily: "Nunito, sans-serif",
                              margin: 0,
                            }}
                          >
                            {s.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Billing Table Card ── */}
              <div style={CARD}>
                <div style={CARD_HEADER}>
                  <div style={CARD_ICON}>
                    <i
                      className="fas fa-receipt"
                      style={{ color: "#c8965a", fontSize: 13 }}
                    />
                  </div>
                  <h4 style={CARD_TITLE}>All Bills</h4>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      color: "#b89060",
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {filtered.length} records
                  </span>
                </div>

                {/* ── Filter Bar ── */}
                <div className="filter-bar">
                  <i
                    className="mdi mdi-magnify"
                    style={{ color: "#b89060", fontSize: 18 }}
                  />
                  <input
                    className="filter-input"
                    type="text"
                    placeholder="Search invoice #..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 200 }}
                  />

                  <select
                    className="filter-select"
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                  >
                    <option value="all">All Payments</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="online">Online</option>
                  </select>

                  <select
                    className="filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>

                  <input
                    className="filter-input"
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    title="Filter by date"
                  />

                  {(search ||
                    filterPayment !== "all" ||
                    filterStatus !== "all" ||
                    filterDate) && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setFilterPayment("all");
                        setFilterStatus("all");
                        setFilterDate("");
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        background: "#fdecea",
                        color: "#c62828",
                        border: "1px solid #ef9a9a",
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "Nunito, sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      <i className="mdi mdi-close me-1" />
                      Clear
                    </button>
                  )}
                </div>

                {/* ── Table ── */}
                <div style={{ overflowX: "auto" }}>
                  <table className="warm-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Invoice No</th>
                        <th>Amount</th>
                        <th>Discount</th>
                        <th>Tax</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td
                            colSpan={10}
                            style={{
                              textAlign: "center",
                              padding: "40px",
                              color: "#b89060",
                            }}
                          >
                            <i
                              className="mdi mdi-receipt-outline"
                              style={{
                                fontSize: 32,
                                display: "block",
                                marginBottom: 8,
                              }}
                            />
                            No billing records found
                          </td>
                        </tr>
                      ) : (
                        filtered.map((bill, idx) => (
                          <>
                            <tr key={bill._id}>
                              <td style={{ color: "#c8a87a", fontSize: 12 }}>
                                {idx + 1}
                              </td>
                              <td>
                                <span className="warm-badge badge-inv">
                                  {bill.invoiceNumber || "—"}
                                </span>
                              </td>
                              <td style={{ fontWeight: 800, color: "#5c3d11" }}>
                                Rs{" "}
                                {Number(bill.totalAmount || 0).toLocaleString()}
                              </td>
                              <td
                                style={{
                                  color:
                                    bill.discount > 0 ? "#c62828" : "#b89060",
                                }}
                              >
                                {bill.discount > 0
                                  ? `- Rs ${bill.discount}`
                                  : "—"}
                              </td>
                              <td
                                style={{
                                  color: bill.tax > 0 ? "#1565c0" : "#b89060",
                                }}
                              >
                                {bill.tax > 0 ? `+ Rs ${bill.tax}` : "—"}
                              </td>
                              <td>
                                <span
                                  className={`warm-badge badge-${bill.paymentMethod || "cash"}`}
                                >
                                  {bill.paymentMethod || "—"}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`warm-badge ${bill.status === "completed" ? "badge-done" : "badge-pend"}`}
                                >
                                  {bill.status || "—"}
                                </span>
                              </td>
                              <td>
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: "#7a5c38",
                                    fontFamily: "Nunito, sans-serif",
                                    fontWeight: 700,
                                  }}
                                >
                                  {(bill.items || []).length} items
                                </span>
                              </td>
                              <td
                                style={{
                                  color: "#b89060",
                                  fontSize: 12,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <div>
                                  {bill.createdAt
                                    ? new Date(
                                        bill.createdAt,
                                      ).toLocaleDateString("en-PK")
                                    : "—"}
                                </div>
                                <div style={{ fontSize: 10, color: "#c8a87a" }}>
                                  {bill.createdAt
                                    ? new Date(
                                        bill.createdAt,
                                      ).toLocaleTimeString("en-PK", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : ""}
                                </div>
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: 6 }}>
                                  <button
                                    className="exp-btn"
                                    onClick={() =>
                                      setExpandedId(
                                        expandedId === bill._id
                                          ? null
                                          : bill._id,
                                      )
                                    }
                                  >
                                    <i
                                      className={`mdi ${expandedId === bill._id ? "mdi-chevron-up" : "mdi-eye-outline"} me-1`}
                                    />
                                    {expandedId === bill._id ? "Hide" : "View"}
                                  </button>
                                  {isAdmin && (
                                    <button
                                      className="del-btn"
                                      disabled={deletingId === bill._id}
                                      onClick={() => handleDelete(bill._id)}
                                    >
                                      {deletingId === bill._id ? (
                                        <span className="spinner-border spinner-border-sm" />
                                      ) : (
                                        <i className="mdi mdi-trash-can-outline me-1" />
                                      )}
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>

                            {/* ── Expanded: Items detail ── */}
                            {expandedId === bill._id && (
                              <tr
                                key={`${bill._id}-expanded`}
                                className="expanded-row"
                              >
                                <td colSpan={10}>
                                  <div className="expanded-inner">
                                    <p
                                      style={{
                                        fontSize: 12,
                                        fontWeight: 800,
                                        color: "#5c3d11",
                                        fontFamily: "Nunito, sans-serif",
                                        marginBottom: 10,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.8px",
                                      }}
                                    >
                                      <i className="mdi mdi-cart-outline me-1" />
                                      Bill Items — {bill.invoiceNumber}
                                    </p>
                                    <table className="items-table">
                                      <thead>
                                        <tr>
                                          <th>#</th>
                                          <th>Product</th>
                                          <th>Qty</th>
                                          <th>Unit Price</th>
                                          <th>Total</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {(bill.items || []).map((item, i) => (
                                          <tr key={i}>
                                            <td style={{ color: "#c8a87a" }}>
                                              {i + 1}
                                            </td>
                                            <td
                                              style={{
                                                fontWeight: 700,
                                                color: "#3d2a10",
                                              }}
                                            >
                                              {item.title ||
                                                item.name ||
                                                item.product?.title ||
                                                item.product?.name ||
                                                (item.product &&
                                                typeof item.product === "object"
                                                  ? item.product._id
                                                  : item.product
                                                    ? `Product ID: ${item.product}`
                                                    : "Unknown")}
                                            </td>
                                            <td>
                                              <span
                                                style={{
                                                  background: "#e8f5e9",
                                                  color: "#2e7d32",
                                                  borderRadius: 6,
                                                  padding: "2px 8px",
                                                  fontSize: 12,
                                                  fontWeight: 700,
                                                }}
                                              >
                                                × {item.quantity}
                                              </span>
                                            </td>
                                            <td>
                                              Rs{" "}
                                              {Number(
                                                item.price || 0,
                                              ).toLocaleString()}
                                            </td>
                                            <td
                                              style={{
                                                fontWeight: 800,
                                                color: "#5c3d11",
                                              }}
                                            >
                                              Rs{" "}
                                              {Number(
                                                item.total || 0,
                                              ).toLocaleString()}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>

                                    {/* Bill summary */}
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 20,
                                        marginTop: 14,
                                        justifyContent: "flex-end",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      {bill.discount > 0 && (
                                        <span
                                          style={{
                                            fontSize: 12,
                                            fontFamily: "Nunito, sans-serif",
                                            color: "#c62828",
                                            fontWeight: 700,
                                          }}
                                        >
                                          Discount: - Rs{" "}
                                          {Number(
                                            bill.discount,
                                          ).toLocaleString()}
                                        </span>
                                      )}
                                      {bill.tax > 0 && (
                                        <span
                                          style={{
                                            fontSize: 12,
                                            fontFamily: "Nunito, sans-serif",
                                            color: "#1565c0",
                                            fontWeight: 700,
                                          }}
                                        >
                                          Tax: + Rs{" "}
                                          {Number(bill.tax).toLocaleString()}
                                        </span>
                                      )}
                                      <span
                                        style={{
                                          fontSize: 14,
                                          fontFamily: "Nunito, sans-serif",
                                          color: "#5c3d11",
                                          fontWeight: 800,
                                        }}
                                      >
                                        Total: Rs{" "}
                                        {Number(
                                          bill.totalAmount || 0,
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ── Footer total ── */}
                {filtered.length > 0 && (
                  <div
                    style={{
                      padding: "12px 18px",
                      borderTop: "1px solid #f0e4d0",
                      background: "linear-gradient(135deg,#fffdf9,#fef6ea)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#b89060",
                        fontFamily: "Nunito, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Showing {filtered.length} of {bills.length} bills
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#5c3d11",
                        fontFamily: "Nunito, sans-serif",
                      }}
                    >
                      Total Revenue: Rs {totalRevenue.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
