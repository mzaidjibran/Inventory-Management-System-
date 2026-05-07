import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  searchProductByBarcode,
  getAllProducts,
  createScanSession,
  addProductToScan,
  finalizeBill,
} from "../../Api/billApi.js";
import BillingTopBar from "./BillingTopBar.jsx";
import BillingCart from "./BillingCart.jsx";
import BillingCustomer from "./BillingCustomer.jsx";
import BillingSummary from "./BillingSummary.jsx";
import "./billing.css";

// ── Print helper ──────────────────────────────────────────────────────────────
function buildInvoiceHTML(bill, customer, cashier, items, totals) {
  const rows = items
    .map(
      (it, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${it.title}</td>
        <td>${it.barcode || "-"}</td>
        <td style="text-align:right">${it.quantity}</td>
        <td style="text-align:right">Rs ${Number(it.price).toLocaleString()}</td>
        <td style="text-align:right">Rs ${Number(it.total).toLocaleString()}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html><html><head><title>Invoice ${bill?.invoiceNumber || ""}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif}
    body{padding:30px;font-size:13px}
    h2{text-align:center;font-size:20px;margin-bottom:4px}
    .sub{text-align:center;color:#555;margin-bottom:20px;font-size:12px}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
    .info-box p{margin:2px 0}
    .info-box strong{display:inline-block;width:90px}
    table{width:100%;border-collapse:collapse;margin-bottom:20px}
    th{background:#333;color:#fff;padding:7px 10px;text-align:left;font-size:12px}
    td{padding:6px 10px;border-bottom:1px solid #eee}
    tr:nth-child(even) td{background:#f9f9f9}
    .totals{float:right;width:280px}
    .totals table td{border:none;padding:4px 8px}
    .totals table td:last-child{text-align:right;font-weight:bold}
    .grand{font-size:15px;border-top:2px solid #333!important}
    .footer{clear:both;margin-top:40px;text-align:center;color:#888;font-size:11px}
  </style></head><body>
  <h2>INVOICE</h2>
  <p class="sub">Invoice No: ${bill?.invoiceNumber || "N/A"} | Date: ${new Date().toLocaleDateString()}</p>
  <div class="info-grid">
    <div class="info-box">
      <p><strong>Customer:</strong> ${customer.name || "-"}</p>
      <p><strong>Phone:</strong> ${customer.phone || "-"}</p>
      <p><strong>Address:</strong> ${customer.address || "-"}</p>
    </div>
    <div class="info-box">
      <p><strong>Cashier:</strong> ${cashier.Name || "-"}</p>
      <p><strong>Email:</strong> ${cashier.email || "-"}</p>
      <p><strong>Payment:</strong> ${totals.paymentMethod}</p>
    </div>
  </div>
  <table>
    <thead><tr>
      <th>#</th><th>Product</th><th>Barcode</th>
      <th style="text-align:right">Qty</th>
      <th style="text-align:right">Price</th>
      <th style="text-align:right">Total</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="totals"><table>
    <tr><td>Subtotal:</td><td>Rs ${Number(totals.subtotal).toLocaleString()}</td></tr>
    <tr><td>Discount:</td><td>Rs ${Number(totals.discount).toLocaleString()}</td></tr>
    <tr><td>Tax:</td><td>Rs ${Number(totals.tax).toLocaleString()}</td></tr>
    <tr class="grand"><td>Grand Total:</td><td>Rs ${Number(totals.total).toLocaleString()}</td></tr>
  </table></div>
  <div class="footer">Thank you for your business!</div>
  </body></html>`;
}

function printBill(bill, customer, cashier, items, totals) {
  const win = window.open("", "_blank");
  win.document.write(buildInvoiceHTML(bill, customer, cashier, items, totals));
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}

function downloadPDF(bill, customer, cashier, items, totals) {
  const html = buildInvoiceHTML(bill, customer, cashier, items, totals);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice-${bill?.invoiceNumber || Date.now()}.html`;
  a.click();
  URL.revokeObjectURL(url);
  toast.info("Downloaded!");
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
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [cashier, setCashier] = useState({ Name: "", email: "" });
  const [lastBill, setLastBill] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Cashier load from localStorage
  useEffect(() => {
    setCashier({
      Name: localStorage.getItem("userName") || "",
      email: localStorage.getItem("userEmail") || "",
    });
  }, []);

  // Load all products for name search
  useEffect(() => {
    getAllProducts()
      .then((res) => setAllProducts(res.data || []))
      .catch(() => {});
  }, []);

  // Filter products by name search
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

  // Totals
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
      toast.success(`Session #${sid} Scan Session Started`);
    } catch (err) {
      toast.error("Session start failed: " + err.message);
    } finally {
      setSessionLoading(false);
    }
  };

  const handleStopSession = () => {
    if (cartItems.length > 0) {
      if (!window.confirm("Bill mein items hain. Phir bhi stop karein?")) return;
    }
    setSessionActive(false);
    setSessionId(null);
    setCartItems([]);
    setBarcodeInput("");
    setNameSearch("");
    toast.info("Session Stopped");
  };

  // ── Barcode Enter ──
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

  // ── Name dropdown select ──
  const handleSelectProduct = (product) => {
    addToCart(product, product.barcode);
    setNameSearch("");
    setShowDropdown(false);
  };

  // ── Add to cart ──
  const addToCart = (product, barcode) => {
    setCartItems((prev) => {
      const existing = prev.find((it) => it.productId === product._id);
      if (existing) {
        return prev.map((it) =>
          it.productId === product._id
            ? { ...it, quantity: it.quantity + 1, total: (it.quantity + 1) * it.price }
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
    toast.success(`${product.title} Added`);
  };

  // ── Qty change ──
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

  // ── Remove item ──
  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((it) => it.productId !== productId));
  };

  // ── Finalize ──
  const handleFinalize = async () => {
    if (!sessionActive || !sessionId) return toast.error("Please Start Session");
    if (cartItems.length === 0) return toast.error("No product in cart");
    if (!paymentMethod) return toast.error("Select Payment Method");

    try {
      for (const item of cartItems) {
        await addProductToScan(sessionId, item.barcode, item.quantity);
      }
    } catch (err) {
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
      toast.success("Bill completed! Stock updated successfully");
    } catch (err) {
      toast.error("Finalize failed: " + err.message);
    }
  };

  // ── New Bill reset ──
  const handleNewBill = () => {
    setShowReceipt(false);
    setCartItems([]);
    setCustomer({ name: "", phone: "", address: "" });
    setDiscount(0);
    setTax(0);
    setPaymentMethod("cash");
    setLastBill(null);
  };

  return (
    <div className="row">
      {/* Top Bar */}
      <div className="col-12 mb-3">
        <BillingTopBar
          sessionActive={sessionActive}
          sessionId={sessionId}
          sessionLoading={sessionLoading}
          barcodeInput={barcodeInput}
          setBarcodeInput={setBarcodeInput}
          nameSearch={nameSearch}
          setNameSearch={setNameSearch}
          filteredProducts={filteredProducts}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          showReceipt={showReceipt}
          onStartSession={handleStartSession}
          onStopSession={handleStopSession}
          onBarcodeEnter={handleBarcodeEnter}
          onSelectProduct={handleSelectProduct}
          onPrint={() => printBill(lastBill, customer, cashier, cartItems, totalsObj)}
          onPDF={() => downloadPDF(lastBill, customer, cashier, cartItems, totalsObj)}
          onNewBill={handleNewBill}
        />
      </div>

      {/* Cart */}
      <div className="col-lg-8">
        <BillingCart
          cartItems={cartItems}
          showReceipt={showReceipt}
          onQtyChange={handleQtyChange}
          onRemove={handleRemoveItem}
        />
      </div>

      {/* Right Panel */}
      <div className="col-lg-4">
        <BillingCustomer
          customer={customer}
          setCustomer={setCustomer}
          cashier={cashier}
          showReceipt={showReceipt}
        />
        <BillingSummary
          subtotal={subtotal}
          discount={discount}
          setDiscount={setDiscount}
          tax={tax}
          setTax={setTax}
          grandTotal={grandTotal}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          showReceipt={showReceipt}
          sessionActive={sessionActive}
          cartItems={cartItems}
          onFinalize={handleFinalize}
        />
      </div>
    </div>
  );
};

export default BillingPage;