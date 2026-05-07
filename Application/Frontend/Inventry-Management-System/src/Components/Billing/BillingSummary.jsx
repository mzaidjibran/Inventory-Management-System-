import "./billing.css";

const BillingSummary = ({
  subtotal,
  discount,
  setDiscount,
  tax,
  setTax,
  grandTotal,
  paymentMethod,
  setPaymentMethod,
  showReceipt,
  sessionActive,
  cartItems,
  onFinalize,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h6 className="card-title mb-0">
          <i className="mdi mdi-receipt me-1"></i>Summary
        </h6>
      </div>
      <div className="card-body">

        {/* Payment Method */}
        <div className="mb-2">
          <label className="form-label form-label-sm">Payment Method</label>
          <select
            className="form-select form-select-sm"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={showReceipt}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
          </select>
        </div>

        {/* Discount */}
        <div className="mb-2">
          <label className="form-label form-label-sm">Discount (Rs)</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={discount}
            min={0}
            onChange={(e) => setDiscount(e.target.value)}
            disabled={showReceipt}
          />
        </div>

        {/* Tax */}
        <div className="mb-3">
          <label className="form-label form-label-sm">Tax (Rs)</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={tax}
            min={0}
            onChange={(e) => setTax(e.target.value)}
            disabled={showReceipt}
          />
        </div>

        <hr />

        {/* Totals */}
        <table className="table summary-table mb-3">
          <tbody>
            <tr>
              <td>Subtotal</td>
              <td className="text-end">Rs {Number(subtotal).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td className="text-end text-danger">
                - Rs {Number(discount).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td>Tax</td>
              <td className="text-end">
                + Rs {Number(tax).toLocaleString()}
              </td>
            </tr>
            <tr className="grand-row">
              <td>Grand Total</td>
              <td className="text-end">
                Rs {Number(grandTotal).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Complete / Done */}
        {!showReceipt ? (
          <button
            className="btn btn-primary w-100"
            onClick={onFinalize}
            disabled={!sessionActive || cartItems.length === 0}
          >
            <i className="mdi mdi-check-circle me-1"></i>
            Complete Bill
          </button>
        ) : (
          <div className="bill-complete-alert">
            <i className="mdi mdi-check-all me-1"></i>
            Bill save ho gaya! Stock update ho gaya.
          </div>
        )}

      </div>
    </div>
  );
};

export default BillingSummary;
