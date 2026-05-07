import "./billing.css";

const BillingCart = ({ cartItems, showReceipt, onQtyChange, onRemove }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="mdi mdi-cart me-2"></i>
          Bill Items
          {cartItems.length > 0 && (
            <span className="badge bg-primary ms-2">{cartItems.length}</span>
          )}
        </h5>
      </div>
      <div className="card-body p-0">
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <i className="mdi mdi-barcode-scan"></i>
            <p>Scan Barcode or Enter Product Name</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-bordered mb-0 cart-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Barcode</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  {!showReceipt && <th></th>}
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, idx) => (
                  <tr key={item.productId}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{item.title}</td>
                    <td>
                      <span className="badge bg-secondary">{item.barcode}</span>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm qty-input"
                        value={item.quantity}
                        min={1}
                        onChange={(e) => onQtyChange(item.productId, e.target.value)}
                        disabled={showReceipt}
                      />
                    </td>
                    <td>Rs {Number(item.price).toLocaleString()}</td>
                    <td className="total-cell">
                      Rs {Number(item.total).toLocaleString()}
                    </td>
                    {!showReceipt && (
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onRemove(item.productId)}
                          title="Remove"
                        >
                          <i className="mdi mdi-delete"></i>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingCart;
