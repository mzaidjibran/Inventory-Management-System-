import { useRef } from "react";
import "./billing.css";

const BillingTopBar = ({
  sessionActive,
  sessionId,
  sessionLoading,
  barcodeInput,
  setBarcodeInput,
  nameSearch,
  setNameSearch,
  filteredProducts,
  showDropdown,
  setShowDropdown,
  showReceipt,
  onStartSession,
  onStopSession,
  onBarcodeEnter,
  onSelectProduct,
  onPrint,
  onPDF,
  onNewBill,
}) => {
  const barcodeRef = useRef(null);

  return (
    <div className="card no-print">
      <div className="card-body py-2">
        <div className="billing-topbar">

          {/* Start / Stop Button */}
          {!sessionActive ? (
            <button
              className="btn btn-success"
              onClick={onStartSession}
              disabled={sessionLoading}
            >
              <i className="mdi mdi-play-circle me-1"></i>
              {sessionLoading ? "Starting..." : "Start Billing"}
            </button>
          ) : (
            <button className="btn btn-danger" onClick={onStopSession}>
              <i className="mdi mdi-stop-circle me-1"></i>
              Stop Billing
            </button>
          )}

          {/* Active Session Badge */}
          {sessionActive && (
            <div className="session-badge">
              <span className="dot"></span>
              Session #{sessionId} Active
            </div>
          )}

          {/* Barcode Input */}
          <input
            ref={barcodeRef}
            type="text"
            className="form-control form-control-sm barcode-input"
            placeholder={
              sessionActive ? "Please Enter Barcode + Enter" : "Start session first"
            }
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyDown={onBarcodeEnter}
            disabled={!sessionActive}
          />

          {/* Name Search */}
          <div className="position-relative">
            <input
              type="text"
              className="form-control form-control-sm name-search"
              placeholder={sessionActive ? "Find by product Name..." : ""}
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              disabled={!sessionActive}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onFocus={() => filteredProducts.length > 0 && setShowDropdown(true)}
            />
            {showDropdown && (
              <div className="search-dropdown">
                {filteredProducts.map((p) => (
                  <div
                    key={p._id}
                    className="search-dropdown-item"
                    onMouseDown={() => onSelectProduct(p)}
                  >
                    <span className="product-title">{p.title}</span>
                    <span className="product-meta ms-2">
                      — Rs {Number(p.price).toLocaleString()} | Stock: {p.stockQuantity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Receipt Buttons */}
          {showReceipt && (
            <div className="receipt-actions">
              <button className="btn btn-outline-primary btn-sm" onClick={onPrint}>
                <i className="mdi mdi-printer me-1"></i>Print
              </button>
              <button className="btn btn-outline-success btn-sm" onClick={onPDF}>
                <i className="mdi mdi-file-pdf me-1"></i>Save PDF
              </button>
              <button className="btn btn-primary btn-sm" onClick={onNewBill}>
                <i className="mdi mdi-plus me-1"></i>New Bill
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BillingTopBar;