import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  searchProductByBarcode,
  getAllProducts,
  createScanSession,
  addProductToScan,
  finalizeBill,
} from "../../Api/billApi.js";

// ── Invoice Print Helper ──────────────────────────────────────────────────────
function buildInvoiceHTML(bill, customer, cashier, items, totals) {
  const rows = items
    .map(
      (it, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>
          <div class="product-name">${it.title}</div>
          <div class="barcode">${it.barcode || "-"}</div>
        </td>
        <td class="center">${it.quantity}</td>
        <td class="right">Rs ${Number(it.price).toLocaleString()}</td>
        <td class="right">Rs ${Number(it.total).toLocaleString()}</td>
      </tr>
    `,
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Invoice ${bill?.invoiceNumber || ""}</title>

    <style>
      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
        font-family: Arial, sans-serif;
      }

      body{
        background:#f4f4f4;
        padding:20px;
        color:#222;
      }

      .invoice{
        max-width:850px;
        margin:auto;
        background:#fff;
        border-radius:10px;
        overflow:hidden;
        border:1px solid #ddd;
      }

      /* HEADER */
      .header{
        background:#3d2a10;
        color:#fff;
        padding:25px;
      }

      .header-top{
        display:flex;
        justify-content:space-between;
        align-items:center;
      }

      .store-name{
        font-size:28px;
        font-weight:bold;
        letter-spacing:1px;
      }

      .invoice-title{
        text-align:right;
      }

      .invoice-title h1{
        font-size:30px;
      }

      .invoice-title p{
        font-size:13px;
        margin-top:4px;
      }

      /* STORE INFO */
      .store-info{
        padding:20px 25px;
        border-bottom:1px solid #eee;
        display:flex;
        justify-content:space-between;
        gap:20px;
      }

      .box{
        flex:1;
      }

      .box h3{
        font-size:14px;
        color:#3d2a10;
        margin-bottom:10px;
        border-bottom:1px solid #ddd;
        padding-bottom:5px;
      }

      .box p{
        font-size:13px;
        margin-bottom:5px;
        line-height:1.5;
      }

      .label{
        font-weight:bold;
      }

      /* TABLE */
      .table-wrapper{
        padding:20px 25px;
      }

      table{
        width:100%;
        border-collapse:collapse;
      }

      thead{
        background:#f5e6cc;
      }

      thead th{
        padding:12px 10px;
        font-size:13px;
        text-align:left;
        color:#3d2a10;
        border-bottom:2px solid #3d2a10;
      }

      tbody td{
        padding:12px 10px;
        border-bottom:1px solid #eee;
        font-size:13px;
      }

      tbody tr:nth-child(even){
        background:#fcfcfc;
      }

      .product-name{
        font-weight:600;
      }

      .barcode{
        color:#888;
        font-size:11px;
        margin-top:3px;
      }

      .right{
        text-align:right;
      }

      .center{
        text-align:center;
      }

      /* TOTALS */
      .bottom{
        display:flex;
        justify-content:space-between;
        gap:20px;
        padding:0 25px 25px;
      }

      .notes{
        flex:1;
      }

      .notes h3{
        font-size:14px;
        margin-bottom:8px;
        color:#3d2a10;
      }

      .notes p{
        font-size:12px;
        color:#666;
        line-height:1.6;
      }

      .totals{
        width:320px;
      }

      .totals table td{
        padding:8px 10px;
        font-size:13px;
        border:none;
      }

      .totals table tr td:last-child{
        text-align:right;
        font-weight:bold;
      }

      .grand-total td{
        background:#3d2a10;
        color:#fff;
        font-size:15px !important;
        padding:12px 10px !important;
      }

      /* FOOTER */
      .footer{
        text-align:center;
        padding:18px;
        background:#fafafa;
        border-top:1px solid #eee;
        font-size:12px;
        color:#777;
      }

      @media print {
        body{
          background:#fff;
          padding:0;
        }

        .invoice{
          border:none;
        }
      }
    </style>
  </head>

  <body>

    <div class="invoice">

      <!-- HEADER -->
      <div class="header">
        <div class="header-top">
          <div>
            <div class="store-name">Al-Nasri Stationary & Books</div>
            <p style="margin-top:6px;font-size:13px;color:#ddd">
              School & Office Supplies
            </p>
          </div>

          <div class="invoice-title">
            <h1>INVOICE</h1>
            <p>Invoice #: ${bill?.invoiceNumber || "N/A"}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <!-- INFO -->
      <div class="store-info">

        <div class="box">
          <h3>Customer Information</h3>

          <p>
            <span class="label">Name:</span>
            ${customer?.name || "-"}
          </p>

          <p>
            <span class="label">Phone:</span>
            ${customer?.phone || "-"}
          </p>

          <p>
            <span class="label">Address:</span>
            ${customer?.address || "-"}
          </p>
        </div>

        <div class="box">
          <h3>Billing Information</h3>

          <p>
            <span class="label">Cashier:</span>
            ${cashier?.Name || "-"}
          </p>

          <p>
            <span class="label">Payment:</span>
            ${totals?.paymentMethod || "Cash"}
          </p>

          <p>
            <span class="label">Items:</span>
            ${items.length}
          </p>
        </div>

      </div>

      <!-- PRODUCTS -->
      <div class="table-wrapper">

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th class="center">Qty</th>
              <th class="right">Price</th>
              <th class="right">Total</th>
            </tr>
          </thead>

          <tbody>
            ${rows}
          </tbody>
        </table>

      </div>

      <!-- TOTALS -->
      <div class="bottom">

        <div class="notes">
          <h3>Notes</h3>

          <p>
            Thank you for shopping with us.
            Products once sold cannot be exchanged without receipt.
          </p>
        </div>

        <div class="totals">

          <table width="100%">

            <tr>
              <td>Subtotal</td>
              <td>Rs ${Number(totals.subtotal).toLocaleString()}</td>
            </tr>

            <tr>
              <td>Discount</td>
              <td>Rs ${Number(totals.discount).toLocaleString()}</td>
            </tr>

            <tr>
              <td>Tax</td>
              <td>Rs ${Number(totals.tax).toLocaleString()}</td>
            </tr>

            <tr class="grand-total">
              <td>Grand Total</td>
              <td>Rs ${Number(totals.total).toLocaleString()}</td>
            </tr>

          </table>

        </div>

      </div>

      <!-- FOOTER -->
      <div class="footer">
        Thank you for visiting ❤
      </div>

    </div>

  </body>
  </html>
  `;
}

function printBill(bill, customer, cashier, items, totals) {
  const win = window.open("", "_blank");
  win.document.write(buildInvoiceHTML(bill, customer, cashier, items, totals));
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}

function downloadBill(bill, customer, cashier, items, totals) {
  const html = buildInvoiceHTML(bill, customer, cashier, items, totals);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice-${bill?.invoiceNumber || Date.now()}.html`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Invoice downloaded!");
}

// ── Main Component ────────────────────────────────────────────────────────────
const BillingPage = () => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [cashier, setCashier] = useState({ Name: "", email: "" });
  const [lastBill, setLastBill] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  useEffect(() => {
    setCashier({
      Name: localStorage.getItem("userName") || "",
      email: localStorage.getItem("userEmail") || "",
    });
  }, []);

  useEffect(() => {
    getAllProducts()
      .then((res) => setAllProducts(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!nameSearch.trim()) {
      setFilteredProducts([]);
      setShowDropdown(false);
      return;
    }
    const q = nameSearch.toLowerCase();
    const matches = allProducts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.barcode?.toLowerCase().includes(q),
    );
    setFilteredProducts(matches.slice(0, 8));
    setShowDropdown(matches.length > 0);
  }, [nameSearch, allProducts]);

  const subtotal = cartItems.reduce((sum, it) => sum + it.total, 0);
  const grandTotal = subtotal + Number(tax) - Number(discount);
  const totalsObj = {
    subtotal,
    discount: Number(discount),
    tax: Number(tax),
    total: grandTotal,
    paymentMethod,
  };

  // ── Session ──
  const handleStartSession = async () => {
    setSessionLoading(true);
    try {
      const res = await createScanSession();
      const sid = res.data?.sessionId;
      setSessionId(sid);
      setSessionActive(true);
      setCartItems([]);
      setLastBill(null);
      setShowReceipt(false);
      setCustomer({ name: "", phone: "", address: "" });
      setDiscount(0);
      setTax(0);
      setPaymentMethod("cash");
      toast.success(`Session #${sid} started!`);
    } catch (err) {
      toast.error("Session start failed: " + err.message);
    } finally {
      setSessionLoading(false);
    }
  };

  const handleStopSession = () => {
    if (cartItems.length > 0) {
      if (!window.confirm("Cart mein items hain. Session stop karein?")) return;
    }
    setSessionActive(false);
    setSessionId(null);
    setCartItems([]);
    setBarcodeInput("");
    setNameSearch("");
    toast.info("Session stopped");
  };

  // ── Barcode ──
  const handleBarcodeEnter = async (e) => {
    if (e.key !== "Enter") return;
    const code = barcodeInput.trim();
    if (!code) return;
    try {
      const res = await searchProductByBarcode(code);
      addToCart(res.data, code);
      setBarcodeInput("");
    } catch (err) {
      toast.error(err.message || "Product not found");
    }
  };

  const handleSelectProduct = (product) => {
    addToCart(product, product.barcode);
    setNameSearch("");
    setShowDropdown(false);
  };

  const addToCart = (product, barcode) => {
    setCartItems((prev) => {
      const existing = prev.find((it) => it.productId === product._id);
      if (existing) {
        return prev.map((it) =>
          it.productId === product._id
            ? {
                ...it,
                quantity: it.quantity + 1,
                total: (it.quantity + 1) * it.price,
              }
            : it,
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          title: product.title,
          barcode: barcode || product.barcode,
          price: Number(product.price),
          quantity: 1,
          total: Number(product.price),
        },
      ];
    });
    toast.success(`${product.title} added`);
  };

  const handleQtyChange = (productId, newQty) => {
    const qty = Math.max(1, Number(newQty));
    setCartItems((prev) =>
      prev.map((it) =>
        it.productId === productId
          ? { ...it, quantity: qty, total: qty * it.price }
          : it,
      ),
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((it) => it.productId !== productId));
    toast.info("Item removed");
  };

  // ── Finalize ──
  const handleFinalize = async () => {
    if (!sessionActive || !sessionId)
      return toast.error("Please start a session first");
    if (cartItems.length === 0) return toast.error("Cart is empty");
    if (!paymentMethod) return toast.error("Select payment method");
    setFinalizing(true);
    try {
      for (const item of cartItems) {
        await addProductToScan(sessionId, item.barcode, item.quantity);
      }
    } catch (err) {
      setFinalizing(false);
      return toast.error("Cart sync failed: " + err.message);
    }
    try {
      const res = await finalizeBill(sessionId, {
        paymentMethod,
        discount: Number(discount),
        tax: Number(tax),
        customerName: customer.name,
        customerPhone: customer.phone,
        customerAddress: customer.address,
      });
      setLastBill(res.data?.billing);
      setShowReceipt(true);
      setSessionActive(false);
      setSessionId(null);
      toast.success("Bill finalized! Stock updated.");
    } catch (err) {
      toast.error("Finalize failed: " + err.message);
    } finally {
      setFinalizing(false);
    }
  };

  const handleNewBill = () => {
    setShowReceipt(false);
    setCartItems([]);
    setCustomer({ name: "", phone: "", address: "" });
    setDiscount(0);
    setTax(0);
    setPaymentMethod("cash");
    setLastBill(null);
  };

  // ── Style tokens (same as dashboard) ─────────────────────────────────────
  const CARD = {
    background: "#fffdf9",
    border: "1px solid #e8dcc8",
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(139,101,50,0.07)",
    overflow: "hidden",
    marginBottom: 18,
  };
  const CARD_HEADER = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 20px",
    borderBottom: "1px solid #f0e4d0",
    background: "linear-gradient(135deg,#fffdf9,#fef6ea)",
  };
  const CARD_TITLE = {
    margin: 0,
    fontSize: 14,
    fontWeight: 800,
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
    fontSize: 10,
    color: "#b89060",
    fontFamily: "Nunito, sans-serif",
    fontWeight: 800,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .bp-page { background: #fdf8f2; min-height: 100vh; font-family: 'Nunito', sans-serif; }

        /* Inputs */
        .bp-input {
          width: 100%; padding: 9px 14px;
          background: #fef6ea; border: 1.5px solid #e8dcc8;
          border-radius: 10px; font-family: 'Nunito', sans-serif;
          font-size: 13px; font-weight: 600; color: #3d2a10;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .bp-input:focus { border-color: #c8965a; box-shadow: 0 0 0 3px rgba(200,150,90,0.12); }
        .bp-input::placeholder { color: #d4b896; font-weight: 500; }
        .bp-input:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Buttons */
        .bp-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 11px; border: none;
          font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.18s ease; white-space: nowrap;
        }
        .bp-btn:active { transform: scale(0.97) !important; }
        .bp-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
        .bp-btn-primary { background: linear-gradient(135deg,#c8965a,#a0733a); color:#fff; box-shadow:0 3px 10px rgba(160,115,58,0.22); }
        .bp-btn-primary:hover { opacity:0.9; transform:translateY(-1px); }
        .bp-btn-success { background: linear-gradient(135deg,#2e7d32,#1b5e20); color:#fff; box-shadow:0 3px 10px rgba(46,125,50,0.2); }
        .bp-btn-success:hover { opacity:0.9; transform:translateY(-1px); }
        .bp-btn-danger  { background: linear-gradient(135deg,#c62828,#b71c1c); color:#fff; box-shadow:0 3px 10px rgba(198,40,40,0.18); }
        .bp-btn-danger:hover  { opacity:0.9; transform:translateY(-1px); }
        .bp-btn-ghost   { background:#fef6ea; color:#a0733a; border:1.5px solid #e8dcc8; }
        .bp-btn-ghost:hover   { background:#fdeede; transform:translateY(-1px); }
        .bp-btn-outline { background:transparent; color:#c8965a; border:1.5px solid #c8965a; }
        .bp-btn-outline:hover { background:#fef6ea; transform:translateY(-1px); }
        .bp-btn-sm { padding:6px 13px; font-size:12px; border-radius:9px; }
        .bp-btn-lg { padding:13px 28px; font-size:14.5px; border-radius:13px; }

        /* Session bar */
        .bp-session-active {
          background: linear-gradient(135deg,#e8f5e9,#f1faf2);
          border: 1.5px solid #a5d6a7;
          border-radius: 14px; padding: 14px 20px;
          display:flex; align-items:center; justify-content:space-between;
          flex-wrap:wrap; gap:12px; margin-bottom:20px;
          box-shadow: 0 4px 16px rgba(46,125,50,0.08);
          animation: slideDown 0.3s ease;
        }
        .bp-session-inactive {
          background: linear-gradient(135deg,#fffdf9,#fef6ea);
          border: 1.5px solid #e8dcc8;
          border-radius: 14px; padding: 14px 20px;
          display:flex; align-items:center; justify-content:space-between;
          flex-wrap:wrap; gap:12px; margin-bottom:20px;
          box-shadow: 0 2px 10px rgba(139,101,50,0.06);
        }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

        /* Cart Table */
        .bp-table { width:100%; border-collapse:collapse; }
        .bp-table thead tr { background: linear-gradient(135deg,#3d2a10,#5c3d11); }
        .bp-table thead th {
          padding:11px 14px; font-size:10px; font-weight:800;
          color:#f5e6cc; letter-spacing:1px; text-transform:uppercase; border:none;
        }
        .bp-table tbody tr { border-bottom:1px solid #f0e4d0; transition:background 0.12s; }
        .bp-table tbody tr:hover { background:#fef9f3; }
        .bp-table tbody td { padding:10px 14px; font-size:13px; color:#5c3d11; font-weight:600; border:none; vertical-align:middle; }

        /* Qty input in cart */
        .bp-qty-input {
          width:60px; padding:5px 8px; text-align:center;
          background:#fef6ea; border:1.5px solid #e8dcc8;
          border-radius:8px; font-family:'Nunito',sans-serif;
          font-size:13px; font-weight:700; color:#3d2a10;
          outline:none; transition:border-color 0.15s;
        }
        .bp-qty-input:focus { border-color:#c8965a; }

        /* Badges */
        .bp-badge {
          display:inline-block; padding:3px 9px; border-radius:20px;
          font-size:11px; font-weight:700; font-family:'Nunito',sans-serif;
        }
        .bp-badge-cash   { background:#e8f5e9; color:#2e7d32; }
        .bp-badge-card   { background:#e3f0ff; color:#1565c0; }
        .bp-badge-online { background:#e0f7fa; color:#00695c; }
        .bp-badge-inv    { background:#f3e5d8; color:#7a4a14; }
        .bp-badge-done   { background:#e8f5e9; color:#2e7d32; }

        /* Payment method radio cards */
        .bp-pay-card {
          flex:1; padding:10px 14px; border-radius:11px; cursor:pointer;
          border:2px solid #e8dcc8; background:#fef6ea;
          display:flex; align-items:center; gap:8px;
          font-family:'Nunito',sans-serif; font-size:13px; font-weight:700;
          color:#7a5c38; transition:all 0.15s ease;
          user-select:none;
        }
        .bp-pay-card:hover { border-color:#c8965a; background:#fdeede; }
        .bp-pay-card.selected { border-color:#c8965a; background:linear-gradient(135deg,#fef6ea,#fdeede); color:#3d2a10; box-shadow:0 2px 10px rgba(200,150,90,0.15); }
        .bp-pay-card.selected .bp-pay-dot { background:#c8965a; }
        .bp-pay-dot { width:10px; height:10px; border-radius:50%; background:#d4b896; transition:background 0.15s; flex-shrink:0; }

        /* Dropdown */
        .bp-dropdown {
          position:absolute; top:calc(100% + 4px); left:0; right:0;
          background:#fffdf9; border:1.5px solid #e8dcc8;
          border-radius:12px; z-index:200; overflow:hidden;
          box-shadow:0 8px 24px rgba(139,101,50,0.14);
          animation:fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        .bp-dropdown-item {
          padding:10px 14px; cursor:pointer;
          border-bottom:1px solid #f5ece0;
          display:flex; align-items:center; justify-content:space-between;
          transition:background 0.12s;
        }
        .bp-dropdown-item:last-child { border-bottom:none; }
        .bp-dropdown-item:hover { background:#fef6ea; }
        .bp-dropdown-name { font-size:13px; font-weight:700; color:#3d2a10; }
        .bp-dropdown-price { font-size:12px; font-weight:700; color:#c8965a; background:#f3e5d8; padding:2px 8px; border-radius:20px; }
        .bp-dropdown-barcode { font-size:11px; color:#b89060; }

        /* Receipt success banner */
        .bp-receipt-banner {
          background: linear-gradient(135deg,#1a4a2e,#2d7a4f);
          border-radius:14px; padding:20px 24px; margin-bottom:20px;
          display:flex; align-items:center; justify-content:space-between;
          flex-wrap:wrap; gap:14px; color:#fff;
          box-shadow:0 6px 22px rgba(26,74,46,0.2);
          animation: slideDown 0.3s ease;
        }

        /* Hover on cards */
        .bp-card-hover { transition:box-shadow 0.18s, transform 0.18s; }
        .bp-card-hover:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(139,101,50,0.12) !important; }

        /* Section label */
        .bp-section-lbl {
          font-size:10px; font-weight:800; letter-spacing:1.4px;
          text-transform:uppercase; color:#c8a87a; margin:0 0 4px;
        }

        /* Summary total row */
        .bp-total-row { display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:1px solid #f0e4d0; }
        .bp-total-row:last-child { border-bottom:none; }
        .bp-total-label { font-size:12.5px; font-weight:600; color:#b89060; }
        .bp-total-val { font-size:13px; font-weight:700; color:#5c3d11; }
        .bp-grand-row { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:linear-gradient(135deg,#3d2a10,#5c3d11); border-radius:11px; margin-top:10px; }
        .bp-grand-label { font-size:13px; font-weight:800; color:#f5e6cc; letter-spacing:0.3px; }
        .bp-grand-val { font-size:20px; font-weight:900; color:#fff; }

        /* Empty cart */
        .bp-empty {
          text-align:center; padding:48px 20px;
          color:#d4b896; font-family:'Nunito',sans-serif;
        }
        .bp-empty-icon { font-size:48px; margin-bottom:12px; opacity:0.5; }
        .bp-empty-text { font-size:14px; font-weight:700; margin:0 0 4px; }
        .bp-empty-sub  { font-size:12px; font-weight:500; }

        /* Responsive */
        @media(max-width:768px) {
          .bp-pay-card { padding:8px 10px; font-size:12px; }
        }
      `}</style>

      <div className="bp-page">
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 22,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div>
            <p className="bp-section-lbl">Billing</p>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                fontFamily: "Nunito,sans-serif",
                color: "#3d2a10",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              New <span style={{ color: "#c8965a" }}>Bill</span>
            </h2>
            <p
              style={{
                color: "#b89060",
                fontFamily: "Nunito,sans-serif",
                fontSize: 13,
                margin: "4px 0 0",
              }}
            >
              {cashier.Name
                ? `Cashier: ${cashier.Name}`
                : "Create and finalize customer bills"}
            </p>
          </div>
          <nav style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span
              style={{
                fontSize: 12,
                color: "#b89060",
                fontFamily: "Nunito,sans-serif",
                fontWeight: 600,
              }}
            >
              Al-Nasri Stationary
            </span>
            <span style={{ color: "#e8dcc8" }}>/</span>
            <span
              style={{
                fontSize: 12,
                color: "#c8965a",
                fontFamily: "Nunito,sans-serif",
                fontWeight: 700,
                background: "#f3e5d8",
                padding: "2px 10px",
                borderRadius: 20,
              }}
            >
              Billing
            </span>
          </nav>
        </div>

        {/* ── Receipt Success Banner ──────────────────────────────────── */}
        {showReceipt && lastBill && (
          <div className="bp-receipt-banner">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 13,
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 22,
                }}
              >
                ✅
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.65)",
                    margin: "0 0 3px",
                  }}
                >
                  Bill Finalized
                </p>
                <p style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                  Invoice: {lastBill.invoiceNumber}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.65)",
                    margin: "3px 0 0",
                  }}
                >
                  Grand Total: Rs {Number(grandTotal).toLocaleString()} ·{" "}
                  {paymentMethod}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="bp-btn bp-btn-sm"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                }}
                onClick={() =>
                  printBill(lastBill, customer, cashier, cartItems, totalsObj)
                }
              >
                <i className="mdi mdi-printer" /> Print
              </button>
              <button
                className="bp-btn bp-btn-sm"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                }}
                onClick={() =>
                  downloadBill(
                    lastBill,
                    customer,
                    cashier,
                    cartItems,
                    totalsObj,
                  )
                }
              >
                <i className="mdi mdi-download" /> Download
              </button>
              <button
                className="bp-btn bp-btn-sm bp-btn-primary"
                onClick={handleNewBill}
              >
                <i className="mdi mdi-plus" /> New Bill
              </button>
            </div>
          </div>
        )}

        {/* ── Session Control Bar ─────────────────────────────────────── */}
        {!showReceipt && (
          <div
            className={
              sessionActive ? "bp-session-active" : "bp-session-inactive"
            }
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  background: sessionActive
                    ? "linear-gradient(135deg,#2e7d32,#1b5e20)"
                    : "linear-gradient(135deg,#c8965a,#a0733a)",
                }}
              >
                <i
                  className={`mdi ${sessionActive ? "mdi-barcode-scan" : "mdi-receipt"}`}
                  style={{ color: "#fff" }}
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    margin: "0 0 2px",
                    color: sessionActive ? "#2e7d32" : "#b89060",
                  }}
                >
                  {sessionActive ? "Session Active" : "No Active Session"}
                </p>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    margin: 0,
                    color: sessionActive ? "#1b5e20" : "#5c3d11",
                  }}
                >
                  {sessionActive
                    ? `Session #${sessionId} · ${cartItems.length} items`
                    : "Start a session to begin billing"}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {!sessionActive ? (
                <button
                  className="bp-btn bp-btn-success"
                  onClick={handleStartSession}
                  disabled={sessionLoading}
                >
                  {sessionLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" />{" "}
                      Starting...
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-play-circle" /> Start Session
                    </>
                  )}
                </button>
              ) : (
                <>
                  {/* Barcode Input */}
                  <div style={{ position: "relative" }}>
                    <input
                      className="bp-input"
                      style={{ width: 200, paddingLeft: 36 }}
                      placeholder="Scan barcode..."
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      onKeyDown={handleBarcodeEnter}
                      autoFocus
                    />
                    <i
                      className="mdi mdi-barcode"
                      style={{
                        position: "absolute",
                        left: 11,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#c8a87a",
                        fontSize: 16,
                      }}
                    />
                  </div>
                  {/* Name Search */}
                  <div style={{ position: "relative" }}>
                    <input
                      className="bp-input"
                      style={{ width: 200, paddingLeft: 36 }}
                      placeholder="Search by name..."
                      value={nameSearch}
                      onChange={(e) => setNameSearch(e.target.value)}
                      onBlur={() =>
                        setTimeout(() => setShowDropdown(false), 200)
                      }
                    />
                    <i
                      className="mdi mdi-magnify"
                      style={{
                        position: "absolute",
                        left: 11,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#c8a87a",
                        fontSize: 16,
                      }}
                    />
                    {showDropdown && (
                      <div className="bp-dropdown">
                        {filteredProducts.map((p) => (
                          <div
                            key={p._id}
                            className="bp-dropdown-item"
                            onMouseDown={() => handleSelectProduct(p)}
                          >
                            <div>
                              <div className="bp-dropdown-name">{p.title}</div>
                              <div className="bp-dropdown-barcode">
                                {p.barcode}
                              </div>
                            </div>
                            <span className="bp-dropdown-price">
                              Rs {Number(p.price).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    className="bp-btn bp-btn-danger bp-btn-sm"
                    onClick={handleStopSession}
                  >
                    <i className="mdi mdi-stop-circle" /> Stop
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Main Grid ──────────────────────────────────────────────── */}
        <div className="row g-3">
          {/* ── LEFT: Cart ─────────────────────────────────────────── */}
          <div className="col-lg-8">
            <div style={CARD} className="bp-card-hover">
              <div style={CARD_HEADER}>
                <div
                  style={{
                    ...CARD_ICON,
                    background: "linear-gradient(135deg,#c8965a,#a0733a)",
                  }}
                >
                  <i
                    className="mdi mdi-cart"
                    style={{ color: "#fff", fontSize: 14 }}
                  />
                </div>
                <h4 style={CARD_TITLE}>Cart</h4>
                {cartItems.length > 0 && (
                  <span
                    className="bp-badge bp-badge-inv"
                    style={{ marginLeft: "auto" }}
                  >
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "item" : "items"}
                  </span>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="bp-empty">
                  <div className="bp-empty-icon">🛒</div>
                  <p className="bp-empty-text">Cart is empty</p>
                  <p className="bp-empty-sub">
                    {sessionActive
                      ? "Scan a barcode or search by name to add products"
                      : "Start a session to begin adding products"}
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="bp-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Barcode</th>
                        <th style={{ textAlign: "center" }}>Qty</th>
                        <th style={{ textAlign: "right" }}>Price</th>
                        <th style={{ textAlign: "right" }}>Total</th>
                        <th style={{ textAlign: "center" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((it, i) => (
                        <tr key={it.productId}>
                          <td style={{ color: "#b89060", fontWeight: 700 }}>
                            {i + 1}
                          </td>
                          <td>
                            <div
                              style={{
                                fontWeight: 800,
                                color: "#3d2a10",
                                fontSize: 13,
                              }}
                            >
                              {it.title}
                            </div>
                          </td>
                          <td>
                            <span className="bp-badge bp-badge-inv">
                              {it.barcode || "—"}
                            </span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {showReceipt ? (
                              <span
                                style={{ fontWeight: 800, color: "#5c3d11" }}
                              >
                                {it.quantity}
                              </span>
                            ) : (
                              <input
                                className="bp-qty-input"
                                type="number"
                                min="1"
                                value={it.quantity}
                                onChange={(e) =>
                                  handleQtyChange(it.productId, e.target.value)
                                }
                              />
                            )}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              color: "#7a5c38",
                              fontWeight: 700,
                            }}
                          >
                            Rs {Number(it.price).toLocaleString()}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              fontWeight: 800,
                              color: "#3d2a10",
                            }}
                          >
                            Rs {Number(it.total).toLocaleString()}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {!showReceipt && (
                              <button
                                className="bp-btn bp-btn-sm"
                                style={{
                                  background: "#fdecea",
                                  color: "#c62828",
                                  border: "none",
                                  padding: "5px 9px",
                                }}
                                onClick={() => handleRemoveItem(it.productId)}
                                title="Remove"
                              >
                                <i className="mdi mdi-delete" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT PANEL ────────────────────────────────────────── */}
          <div className="col-lg-4">
            {/* Customer Info */}
            <div style={CARD} className="bp-card-hover">
              <div style={CARD_HEADER}>
                <div
                  style={{
                    ...CARD_ICON,
                    background: "linear-gradient(135deg,#5b6fd6,#3d52b0)",
                  }}
                >
                  <i
                    className="mdi mdi-account"
                    style={{ color: "#fff", fontSize: 14 }}
                  />
                </div>
                <h4 style={CARD_TITLE}>Customer Info</h4>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    color: "#b89060",
                    fontWeight: 600,
                  }}
                >
                  Optional
                </span>
              </div>
              <div
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div>
                  <p style={LABEL}>Customer Name</p>
                  <input
                    className="bp-input"
                    placeholder="Enter name..."
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer((p) => ({ ...p, name: e.target.value }))
                    }
                    disabled={showReceipt}
                  />
                </div>
                <div>
                  <p style={LABEL}>Phone</p>
                  <input
                    className="bp-input"
                    placeholder="03xx-xxxxxxx"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer((p) => ({ ...p, phone: e.target.value }))
                    }
                    disabled={showReceipt}
                  />
                </div>
                <div>
                  <p style={LABEL}>Address</p>
                  <input
                    className="bp-input"
                    placeholder="Optional address..."
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer((p) => ({ ...p, address: e.target.value }))
                    }
                    disabled={showReceipt}
                  />
                </div>
                {/* Cashier info */}
                <div
                  style={{
                    padding: "10px 14px",
                    background: "linear-gradient(135deg,#fffdf9,#fef6ea)",
                    border: "1px solid #f0e4d0",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <i
                      className="mdi mdi-account-tie"
                      style={{ color: "#c8965a", fontSize: 16 }}
                    />
                    <div>
                      <p style={{ ...LABEL, marginBottom: 1 }}>Cashier</p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#3d2a10",
                          margin: 0,
                        }}
                      >
                        {cashier.Name || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill Summary */}
            <div style={CARD} className="bp-card-hover">
              <div style={CARD_HEADER}>
                <div
                  style={{
                    ...CARD_ICON,
                    background: "linear-gradient(135deg,#e8a020,#c47a10)",
                  }}
                >
                  <i
                    className="mdi mdi-calculator"
                    style={{ color: "#fff", fontSize: 14 }}
                  />
                </div>
                <h4 style={CARD_TITLE}>Bill Summary</h4>
              </div>
              <div style={{ padding: "16px 20px" }}>
                {/* Discount & Tax */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <p style={LABEL}>Discount (Rs)</p>
                    <input
                      className="bp-input"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      disabled={showReceipt}
                    />
                  </div>
                  <div>
                    <p style={LABEL}>Tax (Rs)</p>
                    <input
                      className="bp-input"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={tax}
                      onChange={(e) => setTax(e.target.value)}
                      disabled={showReceipt}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <p style={{ ...LABEL, marginBottom: 8 }}>Payment Method</p>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {[
                    { val: "cash", icon: "mdi-cash", label: "Cash" },
                    { val: "card", icon: "mdi-credit-card", label: "Card" },
                    { val: "online", icon: "mdi-cellphone", label: "Online" },
                  ].map((pm) => (
                    <div
                      key={pm.val}
                      className={`bp-pay-card${paymentMethod === pm.val ? " selected" : ""}${showReceipt ? " disabled" : ""}`}
                      onClick={() => !showReceipt && setPaymentMethod(pm.val)}
                      style={{
                        opacity: showReceipt ? 0.6 : 1,
                        cursor: showReceipt ? "default" : "pointer",
                      }}
                    >
                      <span className="bp-pay-dot" />
                      <i
                        className={`mdi ${pm.icon}`}
                        style={{ fontSize: 14 }}
                      />
                      {pm.label}
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div
                  style={{
                    background: "linear-gradient(135deg,#fef6ea,#fdeede)",
                    border: "1px solid #f0e4d0",
                    borderRadius: 12,
                    padding: "14px 16px",
                    marginBottom: 14,
                  }}
                >
                  <div className="bp-total-row">
                    <span className="bp-total-label">Subtotal</span>
                    <span className="bp-total-val">
                      Rs {Number(subtotal).toLocaleString()}
                    </span>
                  </div>
                  <div className="bp-total-row">
                    <span className="bp-total-label">Discount</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#c62828",
                      }}
                    >
                      − Rs {Number(discount).toLocaleString()}
                    </span>
                  </div>
                  <div className="bp-total-row">
                    <span className="bp-total-label">Tax</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#2e7d32",
                      }}
                    >
                      + Rs {Number(tax).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="bp-grand-row">
                  <span className="bp-grand-label">Grand Total</span>
                  <span className="bp-grand-val">
                    Rs {Number(grandTotal).toLocaleString()}
                  </span>
                </div>

                {/* Finalize Button */}
                {!showReceipt ? (
                  <button
                    className="bp-btn bp-btn-success bp-btn-lg"
                    style={{
                      width: "100%",
                      marginTop: 14,
                      justifyContent: "center",
                    }}
                    onClick={handleFinalize}
                    disabled={
                      !sessionActive || cartItems.length === 0 || finalizing
                    }
                  >
                    {finalizing ? (
                      <>
                        <span className="spinner-border spinner-border-sm" />{" "}
                        Finalizing...
                      </>
                    ) : (
                      <>
                        <i className="mdi mdi-check-circle" /> Finalize Bill
                      </>
                    )}
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <button
                      className="bp-btn bp-btn-ghost"
                      style={{ flex: 1, justifyContent: "center" }}
                      onClick={() =>
                        printBill(
                          lastBill,
                          customer,
                          cashier,
                          cartItems,
                          totalsObj,
                        )
                      }
                    >
                      <i className="mdi mdi-printer" /> Print
                    </button>
                    <button
                      className="bp-btn bp-btn-primary"
                      style={{ flex: 1, justifyContent: "center" }}
                      onClick={handleNewBill}
                    >
                      <i className="mdi mdi-plus" /> New Bill
                    </button>
                  </div>
                )}

                {/* Session warning */}
                {!sessionActive && !showReceipt && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: "9px 14px",
                      background: "#fff8e1",
                      border: "1px solid #ffe082",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <i
                      className="mdi mdi-information"
                      style={{ color: "#e65100", fontSize: 15, flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#e65100",
                      }}
                    >
                      Start a session to finalize bill
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
};

export default BillingPage;
