import "./billing.css";

const BillingCustomer = ({ customer, setCustomer, cashier, showReceipt }) => {
  const handleChange = (key) => (e) =>
    setCustomer((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <>
      {/* Customer Info */}
      <div className="card mb-3 info-card">
        <div className="card-header">
          <h6 className="card-title mb-0">
            <i className="mdi mdi-account me-1"></i>Customer Info
          </h6>
        </div>
        <div className="card-body">
          {[
            { label: "Name", key: "name", placeholder: "Customer name", type: "text" },
            { label: "Phone", key: "phone", placeholder: "03xx-xxxxxxx", type: "text" },
            { label: "Address", key: "address", placeholder: "Optional", type: "text" },
          ].map(({ label, key, placeholder, type }) => (
            <div className="mb-2" key={key}>
              <label className="form-label form-label-sm">{label}</label>
              <input
                type={type}
                className="form-control form-control-sm"
                value={customer[key]}
                onChange={handleChange(key)}
                placeholder={placeholder}
                disabled={showReceipt}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Cashier Info */}
      <div className="card mb-3 info-card">
        <div className="card-header">
          <h6 className="card-title mb-0">
            <i className="mdi mdi-account-tie me-1"></i>Cashier
          </h6>
        </div>
        <div className="card-body py-2">
          <p className="mb-1">
            <strong>Name:</strong> {cashier.Name || "—"}
          </p>
          <p className="mb-0">
            <strong>Email:</strong> {cashier.email || "—"}
          </p>
        </div>
      </div>
    </>
  );
};

export default BillingCustomer;