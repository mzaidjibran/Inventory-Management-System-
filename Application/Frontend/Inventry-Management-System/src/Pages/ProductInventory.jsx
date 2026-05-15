import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Topbar from "../components/Topbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

import { getUserRole } from "../Api/authApi.js";

const API_BASE = "http://127.0.0.1:3000";
const getToken = () => localStorage.getItem("accessToken");

// ── API calls ─────────────────────────────────────────────────────────────
const fetchProducts = async () => {
  const res = await fetch(`${API_BASE}/api/product`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch products");
  return data.data || [];
};

const fetchBillings = async () => {
  const res = await fetch(`${API_BASE}/api/billing`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch billings");
  return data.data || [];
};

const updateProductStock = async (id, stockQuantity) => {
  const res = await fetch(`${API_BASE}/api/product/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ stockQuantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update stock");
  return data;
};

// ── Compute per-product stats from billing records ─────────────────────────
const computeProductStats = (products, billings) => {
  // totalSold per product from billing items
  const soldMap = {};

  billings.forEach((bill) => {
    (bill.items || []).forEach((item) => {
      // Extract product ID - handle both populated object and ID string
      let pid = null;
      if (item.product) {
        if (typeof item.product === "object" && item.product._id) {
          pid = item.product._id?.toString?.() || item.product._id;
        } else {
          pid = item.product?.toString?.() || item.product;
        }
      }
      if (!pid) return;
      soldMap[pid] = (soldMap[pid] || 0) + (item.quantity || 0);
    });
  });

  return products.map((p) => {
    const pid = p._id?.toString?.() || p._id;
    const totalSold = soldMap[pid] || 0;
    const currentStock = p.stockQuantity || 0;
    // totalPurchased = current stock + total sold (what was originally there)
    const totalPurchased = currentStock + totalSold;
    // addedStock: we don't track additions separately in this schema,
    // so we show it as the initial purchase quantity (totalPurchased)
    return {
      ...p,
      totalPurchased,
      totalSold,
      currentStock,
    };
  });
};

export default function ProductInventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingStock, setEditingStock] = useState({}); // { [id]: value }
  const [adjustMap, setAdjustMap] = useState({}); // { [id]: { type: 'add'|'sub', qty: number } }
  const [savingId, setSavingId] = useState(null);

  const userRole = getUserRole();
  const isAdmin = userRole === "admin";

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, bills] = await Promise.all([
        fetchProducts(),
        fetchBillings(),
      ]);
      setProducts(computeProductStats(prods, bills));
    } catch (e) {
      if (e?.status === 401) {
        toast.error("Session expired");
        navigate("/signin");
        return;
      }
      toast.error(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);

    // Refresh when page comes back into focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // ── Adjust stock (add or subtract) ─────────────────────────────────────
  const handleAdjust = async (product) => {
    const adj = adjustMap[product._id];
    if (!adj || !adj.qty || adj.qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    const newQty =
      adj.type === "add"
        ? product.currentStock + Number(adj.qty)
        : Math.max(0, product.currentStock - Number(adj.qty));

    setSavingId(product._id);
    try {
      await updateProductStock(product._id, newQty);
      toast.success(`Stock updated: ${product.title}`);
      setAdjustMap((prev) => ({
        ...prev,
        [product._id]: { type: "add", qty: "" },
      }));
      await loadData();
    } catch (e) {
      toast.error(e.message || "Update failed");
    } finally {
      setSavingId(null);
    }
  };

  const getAdj = (id) => adjustMap[id] || { type: "add", qty: "" };

  // ── Filter products by search ───────────────────────────────────────────
  const filtered = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Summary totals ──────────────────────────────────────────────────────
  const totalWorth = products.reduce(
    (s, p) => s + (p.price || 0) * (p.currentStock || 0),
    0,
  );
  const totalSoldAll = products.reduce((s, p) => s + (p.totalSold || 0), 0);
  const totalStockAll = products.reduce((s, p) => s + (p.currentStock || 0), 0);

  // ── Styles ──────────────────────────────────────────────────────────────
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
    fontSize: 10.5,
    color: "#b89060",
    fontFamily: "Nunito, sans-serif",
    fontWeight: 600,
    marginBottom: 2,
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
                Loading Inventory...
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
        .inv-page { background: #fdf8f2; min-height: 100vh; }

        /* product card */
        .prod-card {
          background: #fffdf9;
          border: 1px solid #e8dcc8;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(139,101,50,0.06);
          transition: transform 0.18s, box-shadow 0.18s;
          margin-bottom: 20px;
        }
        .prod-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139,101,50,0.11);
        }
        .prod-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          border-bottom: 1px solid #f0e4d0;
        }
        .prod-img {
          width: 42px; height: 42px;
          border-radius: 10px;
          object-fit: cover;
          background: #f0e4d0;
          border: 1px solid #e8dcc8;
          flex-shrink: 0;
        }
        .prod-img-placeholder {
          width: 42px; height: 42px;
          border-radius: 10px;
          background: linear-gradient(135deg, #f5ddb8, #eac990);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* 4-stat boxes */
        .stat-boxes {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-bottom: 1px solid #f0e4d0;
        }
        .stat-box {
          padding: 12px 14px;
          border-right: 1px solid #f0e4d0;
          transition: background 0.15s;
        }
        .stat-box:last-child { border-right: none; }
        .stat-box:hover { background: #fef6ea; }
        .stat-box-val {
          font-size: 18px;
          font-weight: 800;
          font-family: Nunito, sans-serif;
          margin: 0;
          line-height: 1.1;
        }
        .val-blue   { color: #1565c0; }
        .val-green  { color: #2e7d32; }
        .val-amber  { color: #b45309; }
        .val-teal   { color: #0f766e; }

        /* adjust controls */
        .adj-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #fffdf9;
          flex-wrap: wrap;
        }
        .adj-type-btn {
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          font-family: Nunito, sans-serif;
          cursor: pointer;
          border: 1px solid;
          transition: all 0.15s;
        }
        .adj-type-btn.add  { background: #e8f5e9; color: #2e7d32; border-color: #a5d6a7; }
        .adj-type-btn.sub  { background: #fdecea; color: #c62828; border-color: #ef9a9a; }
        .adj-type-btn.add.active { background: #2e7d32; color: #fff; }
        .adj-type-btn.sub.active { background: #c62828; color: #fff; }
        .adj-input {
          width: 80px;
          padding: 5px 10px;
          border: 1px solid #e8dcc8;
          border-radius: 8px;
          font-size: 13px;
          font-family: Nunito, sans-serif;
          font-weight: 600;
          color: #5c3d11;
          background: #fffdf9;
          outline: none;
        }
        .adj-input:focus { border-color: #c8965a; }
        .adj-save-btn {
          padding: 5px 16px;
          border-radius: 8px;
          background: linear-gradient(135deg, #c8965a, #a0733a);
          color: #fff;
          border: none;
          font-size: 12px;
          font-weight: 700;
          font-family: Nunito, sans-serif;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .adj-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* summary top cards */
        .sum-card {
          background: var(--bg);
          border: 1px solid #e8dcc8;
          border-radius: 12px;
          padding: 16px 18px;
          transition: transform 0.15s;
        }
        .sum-card:hover { transform: translateY(-2px); }

        /* search */
        .inv-search {
          padding: 8px 14px;
          border: 1px solid #e8dcc8;
          border-radius: 10px;
          font-size: 13px;
          font-family: Nunito, sans-serif;
          color: #5c3d11;
          background: #fffdf9;
          outline: none;
          width: 260px;
          transition: border-color 0.15s;
        }
        .inv-search:focus { border-color: #c8965a; }

        .section-lbl {
          font-size: 10px; font-weight: 800; letter-spacing: 1.4px;
          text-transform: uppercase; color: #c8a87a;
          font-family: Nunito, sans-serif; margin: 0 0 10px;
        }

        .warm-badge {
          display: inline-block; padding: 2px 9px; border-radius: 20px;
          font-size: 11px; font-weight: 700; font-family: Nunito, sans-serif;
        }
        .badge-danger { background:#fdecea; color:#c62828; }
        .badge-warn   { background:#fff8e1; color:#e65100; }
        .badge-ok     { background:#e8f5e9; color:#2e7d32; }

        @media (max-width: 600px) {
          .stat-boxes { grid-template-columns: repeat(2, 1fr); }
          .stat-box:nth-child(2) { border-right: none; }
          .stat-box:nth-child(1), .stat-box:nth-child(2) { border-bottom: 1px solid #f0e4d0; }
        }
      `}</style>

      <div id="layout-wrapper" className="inv-page">
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
                    Inventory
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
                    Product Inventory
                  </h2>
                  <p
                    style={{
                      color: "#b89060",
                      fontFamily: "Nunito, sans-serif",
                      fontSize: 13,
                      margin: "4px 0 0",
                    }}
                  >
                    Stock levels, sales, and inventory management
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
                    Inventory
                  </span>
                </nav>
              </div>

              {/* ── Summary Cards ── */}
              <div className="row g-3 mb-4">
                {[
                  {
                    label: "Total Products",
                    value: products.length,
                    icon: "mdi mdi-package-variant",
                    bg: "#c8965a",
                    textColor: "#5c3d11",
                  },
                  {
                    label: "Total Stock Units",
                    value: totalStockAll.toLocaleString(),
                    icon: "mdi mdi-layers-triple",
                    bg: "#1D9E75",
                    textColor: "#064e3b",
                  },
                  {
                    label: "Total Sold (All Time)",
                    value: totalSoldAll.toLocaleString(),
                    icon: "mdi mdi-cart-check",
                    bg: "#5b6fd6",
                    textColor: "#1e3a8a",
                  },
                  {
                    label: "Inventory Worth",
                    value: `Rs ${totalWorth.toLocaleString()}`,
                    icon: "mdi mdi-cash-multiple",
                    bg: "#e8a020",
                    textColor: "#78350f",
                  },
                ].map((s) => (
                  <div className="col-xl-3 col-sm-6" key={s.label}>
                    <div
                      style={{
                        background: "#fffdf9",
                        border: "1px solid #e8dcc8",
                        borderRadius: 14,
                        padding: "16px 18px",
                        boxShadow: "0 2px 10px rgba(139,101,50,0.06)",
                        transition: "transform 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "translateY(-3px)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                    >
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
                            background: s.bg,
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
                              fontSize: 19,
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

              {/* ── Search ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <p className="section-lbl" style={{ margin: 0 }}>
                  All Products ({filtered.length})
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <i
                    className="mdi mdi-magnify"
                    style={{ color: "#b89060", fontSize: 18 }}
                  />
                  <input
                    className="inv-search"
                    type="text"
                    placeholder="Search by name, category, barcode..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* ── Product Cards ── */}
              {filtered.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#b89060",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  <i
                    className="mdi mdi-package-variant-closed"
                    style={{ fontSize: 48, display: "block", marginBottom: 12 }}
                  />
                  No products found
                </div>
              ) : (
                <div className="row g-3">
                  {filtered.map((p) => {
                    const adj = getAdj(p._id);
                    const stockStatus =
                      p.currentStock === 0
                        ? "danger"
                        : p.currentStock <= 5
                          ? "warn"
                          : "ok";
                    const stockLabel =
                      p.currentStock === 0
                        ? "Out of Stock"
                        : p.currentStock <= 5
                          ? "Low Stock"
                          : "In Stock";
                    const imgSrc = p.image ? `${API_BASE}/${p.image}` : null;

                    return (
                      <div className="col-xl-6 col-12" key={p._id}>
                        <div className="prod-card">
                          {/* Card Header */}
                          <div className="prod-card-header">
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={p.title}
                                className="prod-img"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className="prod-img-placeholder"
                              style={{ display: imgSrc ? "none" : "flex" }}
                            >
                              <i
                                className="mdi mdi-book-open-variant"
                                style={{ color: "#8b5e2a", fontSize: 20 }}
                              />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 14,
                                  fontWeight: 800,
                                  color: "#3d2a10",
                                  fontFamily: "Nunito, sans-serif",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {p.title}
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  marginTop: 4,
                                  flexWrap: "wrap",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: "#9a7550",
                                    fontFamily: "Nunito, sans-serif",
                                  }}
                                >
                                  <i className="mdi mdi-account-edit me-1" />
                                  {p.author}
                                </span>
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: "#9a7550",
                                    fontFamily: "Nunito, sans-serif",
                                  }}
                                >
                                  <i className="mdi mdi-tag-outline me-1" />
                                  {p.category}
                                </span>
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: "#9a7550",
                                    fontFamily: "Nunito, sans-serif",
                                  }}
                                >
                                  <i className="mdi mdi-barcode me-1" />
                                  {p.barcode}
                                </span>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                gap: 4,
                                flexShrink: 0,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 14,
                                  fontWeight: 800,
                                  color: "#5c3d11",
                                  fontFamily: "Nunito, sans-serif",
                                }}
                              >
                                Rs {Number(p.price).toLocaleString()}
                              </span>
                              <span
                                className={`warm-badge badge-${stockStatus}`}
                              >
                                {stockLabel}
                              </span>
                            </div>
                          </div>

                          {/* ── 4 Stat Boxes ── */}
                          <div className="stat-boxes">
                            {/* Box 1: Total Available */}
                            <div className="stat-box">
                              <p style={LABEL}>
                                <i className="mdi mdi-cart-plus me-1" />
                                Total Products
                              </p>
                              <p className="stat-box-val val-blue">
                                {p.currentStock}
                              </p>
                              <p
                                style={{
                                  fontSize: 10,
                                  color: "#94a3b8",
                                  fontFamily: "Nunito, sans-serif",
                                  margin: "2px 0 0",
                                }}
                              >
                                currently available
                              </p>
                            </div>

                            {/* Box 2: Added Quantity */}
                            <div className="stat-box">
                              <p style={LABEL}>
                                <i className="mdi mdi-plus-circle-outline me-1" />
                                Added
                              </p>
                              <p className="stat-box-val val-green">
                                {p.initialStockQuantity || p.totalPurchased}
                              </p>
                              <p
                                style={{
                                  fontSize: 10,
                                  color: "#94a3b8",
                                  fontFamily: "Nunito, sans-serif",
                                  margin: "2px 0 0",
                                }}
                              >
                                qty added initially
                              </p>
                            </div>

                            {/* Box 3: Total Sold */}
                            <div className="stat-box">
                              <p style={LABEL}>
                                <i className="mdi mdi-cart-arrow-right me-1" />
                                Total Sold
                              </p>
                              <p className="stat-box-val val-amber">
                                {p.totalSold}
                              </p>
                              <p
                                style={{
                                  fontSize: 10,
                                  color: "#94a3b8",
                                  fontFamily: "Nunito, sans-serif",
                                  margin: "2px 0 0",
                                }}
                              >
                                units sold via bills
                              </p>
                            </div>

                            {/* Box 4: Remaining Stock */}
                            <div className="stat-box">
                              <p style={LABEL}>
                                <i className="mdi mdi-warehouse me-1" />
                                Remaining
                              </p>
                              <p className="stat-box-val val-teal">
                                {p.currentStock}
                              </p>
                              <p
                                style={{
                                  fontSize: 10,
                                  color: "#94a3b8",
                                  fontFamily: "Nunito, sans-serif",
                                  margin: "2px 0 0",
                                }}
                              >
                                in stock now
                              </p>
                            </div>
                          </div>

                          {/* ── Stock Adjust Row (Admin only) ── */}
                          {isAdmin && (
                            <div className="adj-row">
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#9a7550",
                                  fontFamily: "Nunito, sans-serif",
                                  fontWeight: 700,
                                }}
                              >
                                Adjust Stock:
                              </span>

                              {/* Add / Subtract toggle */}
                              <button
                                className={`adj-type-btn add ${adj.type === "add" ? "active" : ""}`}
                                onClick={() =>
                                  setAdjustMap((prev) => ({
                                    ...prev,
                                    [p._id]: { ...getAdj(p._id), type: "add" },
                                  }))
                                }
                              >
                                <i className="mdi mdi-plus me-1" />
                                Add
                              </button>
                              <button
                                className={`adj-type-btn sub ${adj.type === "sub" ? "active" : ""}`}
                                onClick={() =>
                                  setAdjustMap((prev) => ({
                                    ...prev,
                                    [p._id]: { ...getAdj(p._id), type: "sub" },
                                  }))
                                }
                              >
                                <i className="mdi mdi-minus me-1" />
                                Subtract
                              </button>

                              <input
                                className="adj-input"
                                type="number"
                                min="1"
                                placeholder="Qty"
                                value={adj.qty}
                                onChange={(e) =>
                                  setAdjustMap((prev) => ({
                                    ...prev,
                                    [p._id]: {
                                      ...getAdj(p._id),
                                      qty: e.target.value,
                                    },
                                  }))
                                }
                              />

                              <button
                                className="adj-save-btn"
                                disabled={savingId === p._id}
                                onClick={() => handleAdjust(p)}
                              >
                                {savingId === p._id ? (
                                  <span className="spinner-border spinner-border-sm me-1" />
                                ) : (
                                  <i className="mdi mdi-content-save me-1" />
                                )}
                                Save
                              </button>

                              <span
                                style={{
                                  marginLeft: "auto",
                                  fontSize: 11,
                                  color: "#b89060",
                                  fontFamily: "Nunito, sans-serif",
                                }}
                              >
                                Worth: Rs{" "}
                                {(
                                  Number(p.price) * p.currentStock
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
