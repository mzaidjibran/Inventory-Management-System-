import { useState } from "react";
import ClientHook from "../../Hook/clienthook.jsx";
import ClientForm from "./clientform.jsx";
import { deleteClient } from "../../Api/client.js";
import toast from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast.js";

const tableStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

  .ct-wrap { font-family: 'Nunito', sans-serif; }

  .ct-card {
    background: #fffdf9;
    border: 1px solid #e8dcc8;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(139,101,50,0.08);
  }

  .ct-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 22px;
    background: linear-gradient(135deg, #fffdf9, #fef6ea);
    border-bottom: 1px solid #f0e4d0;
  }
  .ct-card-title {
    font-size: 16px; font-weight: 800; color: #3d2a10; margin: 0;
  }
  .ct-add-btn {
    padding: 8px 18px;
    background: linear-gradient(135deg, #c8965a, #a0733a);
    color: #fff; border: none; border-radius: 10px;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: opacity 0.15s, transform 0.15s;
  }
  .ct-add-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  .ct-table-wrap { padding: 16px 22px; overflow-x: auto; }

  .ct-table {
    width: 100%; border-collapse: collapse;
    font-size: 13px;
  }
  .ct-table thead tr {
    background: linear-gradient(135deg, #fef6ea, #fdeede);
    border-bottom: 2px solid #e8dcc8;
  }
  .ct-table th {
    padding: 10px 14px; text-align: left;
    font-size: 10px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 1px;
    color: #c8a87a;
  }
  .ct-table tbody tr {
    border-bottom: 1px solid #f5ece0;
    transition: background 0.12s;
  }
  .ct-table tbody tr:hover { background: #fef9f3; }
  .ct-table td {
    padding: 11px 14px;
    color: #3d2a10; font-weight: 600;
  }
  .ct-table td.muted { color: #b89060; }

  .ct-action-btn {
    width: 30px; height: 30px; border-radius: 8px;
    border: none; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 14px; margin-right: 5px;
    transition: opacity 0.15s, transform 0.12s;
  }
  .ct-action-btn:hover { opacity: 0.8; transform: scale(1.08); }
  .ct-btn-view   { background: #e8f4fd; color: #1a73e8; }
  .ct-btn-edit   { background: #fff8e1; color: #f59c00; }
  .ct-btn-delete { background: #fdecea; color: #c62828; }

  /* View Modal */
  .cv-overlay {
    position: fixed; inset: 0;
    background: rgba(10,10,20,0.55);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1050; padding: 1rem;
    animation: cvFade 0.2s ease;
  }
  @keyframes cvFade { from { opacity: 0 } to { opacity: 1 } }

  .cv-card {
    background: #fffdf9;
    border: 1px solid #e8dcc8;
    border-radius: 18px;
    width: 100%; max-width: 500px;
    box-shadow: 0 12px 40px rgba(139,101,50,0.14);
    font-family: 'Nunito', sans-serif;
    overflow: hidden;
    animation: cvSlide 0.25s cubic-bezier(.22,.68,0,1.2);
  }
  @keyframes cvSlide {
    from { transform: translateY(20px); opacity: 0 }
    to   { transform: translateY(0);    opacity: 1 }
  }

  .cv-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 22px;
    background: linear-gradient(135deg, #fffdf9, #fef6ea);
    border-bottom: 1px solid #f0e4d0;
  }
  .cv-header-left { display: flex; align-items: center; gap: 12px; }
  .cv-icon {
    width: 38px; height: 38px; border-radius: 11px;
    background: linear-gradient(135deg, #c8965a, #a0733a);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 1rem; flex-shrink: 0;
  }
  .cv-title { font-size: 15px; font-weight: 800; color: #3d2a10; margin: 0; }
  .cv-subtitle { font-size: 11px; color: #b89060; font-weight: 600; margin: 0; }
  .cv-close {
    width: 30px; height: 30px; border-radius: 8px;
    background: #fdecea; color: #c62828;
    border: none; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 15px; transition: opacity 0.15s;
  }
  .cv-close:hover { opacity: 0.8; }

  .cv-body { padding: 22px; background: #fffdf9; }
  .cv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.5rem; }
  .cv-field { display: flex; flex-direction: column; gap: 4px; }
  .cv-field.full { grid-column: span 2; }
  .cv-field-label {
    font-size: 10px; font-weight: 800; letter-spacing: 1px;
    text-transform: uppercase; color: #c8a87a;
  }
  .cv-field-value {
    font-size: 13px; font-weight: 700; color: #3d2a10;
    background: #fef6ea; border: 1px solid #f0e4d0;
    border-radius: 8px; padding: 8px 12px;
  }
  .cv-field-value.empty { color: #d4b896; font-style: italic; }

  .cv-footer {
    display: flex; justify-content: flex-end;
    padding: 14px 22px;
    border-top: 1px solid #f0e4d0;
    background: linear-gradient(135deg, #fffdf9, #fef6ea);
  }
  .cv-close-btn {
    padding: 9px 22px; border-radius: 10px; border: none;
    background: #fdecea; color: #c62828;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: opacity 0.15s;
  }
  .cv-close-btn:hover { opacity: 0.8; }
`;

function formatAddress(address) {
  if (!address) return "-";
  if (typeof address === "string") return address;
  if (typeof address === "object") {
    return (
      [
        address.street,
        address.city,
        address.state,
        address.country,
        address.zipCode,
      ]
        .filter(Boolean)
        .join(", ") || "-"
    );
  }
  return "-";
}

const ClientTable = () => {
  const { clients, loadClients } = ClientHook();
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  function handleDelete(id) {
    confirmToast("Delete this Client?", async () => {
      try {
        await deleteClient(id);
        loadClients();
        toast.success("Customer deleted successfully");
      } catch (err) {
        toast.error("Delete failed: " + err.message);
      }
    });
  }

  function handleEdit(client) {
    setEditData(client);
    setShowForm(true);
  }

  function handleView(client) {
    setViewData(client);
    setShowView(true);
  }

  function handleAdd() {
    setEditData(null);
    setShowForm(true);
  }

  return (
    <>
      <style>{tableStyles}</style>
      <div className="ct-wrap">
        <div className="ct-card">
          {/* Header */}
          <div className="ct-card-header">
            <h4 className="ct-card-title">Customers</h4>
            <button className="ct-add-btn" onClick={handleAdd}>
              + Add Customer
            </button>
          </div>

          {/* Table */}
          <div className="ct-table-wrap">
            <table className="ct-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client._id}>
                    <td>{client.name}</td>
                    <td className={!client.contact ? "muted" : ""}>
                      {client.contact || "-"}
                    </td>
                    <td className={!client.email ? "muted" : ""}>
                      {client.email || "-"}
                    </td>
                    <td>{formatAddress(client.address)}</td>
                    <td>
                      <button
                        className="ct-action-btn ct-btn-view"
                        title="View"
                        onClick={() => handleView(client)}
                      >
                        <i className="mdi mdi-eye" />
                      </button>
                      <button
                        className="ct-action-btn ct-btn-edit"
                        title="Edit"
                        onClick={() => handleEdit(client)}
                      >
                        <i className="mdi mdi-pencil" />
                      </button>
                      <button
                        className="ct-action-btn ct-btn-delete"
                        title="Delete"
                        onClick={() => handleDelete(client._id)}
                      >
                        <i className="mdi mdi-delete" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      <ClientForm
        key={editData?._id || "new-client"}
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSaved={loadClients}
        editData={editData}
        onClearEdit={() => setEditData(null)}
      />

      {/* View Modal */}
      {showView && viewData && (
        <div
          className="cv-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowView(false)}
        >
          <div className="cv-card" role="dialog" aria-modal="true">
            <div className="cv-header">
              <div className="cv-header-left">
                <div className="cv-icon">👤</div>
                <div>
                  <p className="cv-title">Customer Details</p>
                  <p className="cv-subtitle">Viewing {viewData.name}</p>
                </div>
              </div>
              <button
                className="cv-close"
                onClick={() => setShowView(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="cv-body">
              <div className="cv-grid">
                {[
                  { label: "Name", value: viewData.name },
                  { label: "Email", value: viewData.email },
                  { label: "Contact", value: viewData.contact },
                  {
                    label: "Address",
                    value: formatAddress(viewData.address),
                    full: true,
                  },
                ].map(({ label, value, full }) => (
                  <div className={`cv-field${full ? " full" : ""}`} key={label}>
                    <span className="cv-field-label">{label}</span>
                    <span
                      className={`cv-field-value${!value || value === "-" ? " empty" : ""}`}
                    >
                      {value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cv-footer">
              <button
                className="cv-close-btn"
                onClick={() => setShowView(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientTable;
