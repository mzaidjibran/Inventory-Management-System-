import { useState } from "react";
import SupplierHook from "../../Hook/SupplierHook.jsx";
import SupplierForm from "./SupplierForm.jsx";
import { deleteSupplier } from "../../Api/supplier.js";
import toast from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast.js";

const SupplierTable = () => {
  const { suppliers, loadSuppliers } = SupplierHook();
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  function handleDelete(id) {
    confirmToast("Delete this Supplier?", async () => {
      try {
        await deleteSupplier(id);
        loadSuppliers();
        toast.success("Supplier deleted successfully");
      } catch (err) {
        toast.error("Delete failed: " + err.message);
      }
    });
  }

  function handleEdit(sup) {
    setEditData(sup);
    const modal = new window.bootstrap.Modal(document.getElementById("modal8"));
    modal.show();
  }

  function handleView(sup) {
    setViewData(sup);
    const modal = new window.bootstrap.Modal(
      document.getElementById("modalView"),
    );
    modal.show();
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .sup-wrap { font-family: 'Nunito', sans-serif; }

        .sup-card {
          background: #fffdf9;
          border: 1px solid #e8dcc8;
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(139,101,50,0.08);
          overflow: hidden;
        }

        /* ── Header ── */
        .sup-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          border-bottom: 1px solid #f0e4d0;
        }
        .sup-header-left { display: flex; align-items: center; gap: 11px; }
        .sup-header-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #c8965a, #a0733a);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sup-header-icon i { color: #fff; font-size: 17px; }
        .sup-card-title { font-size: 15px; font-weight: 800; color: #3d2a10; margin: 0; }
        .sup-count-badge {
          display: inline-block; background: #f3e5d8; color: #c8965a;
          font-size: 11px; font-weight: 700; padding: 2px 9px;
          border-radius: 20px; margin-left: 7px;
        }
        .sup-add-btn {
          display: flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg, #c8965a, #a0733a);
          color: #fff; border: none; border-radius: 10px;
          padding: 8px 16px; font-size: 12.5px; font-weight: 700;
          font-family: 'Nunito', sans-serif; cursor: pointer;
          transition: opacity 0.18s, transform 0.15s;
        }
        .sup-add-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        /* ── Table ── */
        .sup-table-wrap { overflow-x: auto; }
        .sup-table { width: 100%; border-collapse: collapse; font-family: 'Nunito', sans-serif; }
        .sup-table thead tr { background: linear-gradient(135deg, #3d2a10, #5c3d11); }
        .sup-table thead th {
          padding: 12px 16px; font-size: 11px; font-weight: 800;
          color: #f5e6cc; letter-spacing: 0.9px; text-transform: uppercase;
          border: none; white-space: nowrap;
        }
        .sup-table tbody tr { border-bottom: 1px solid #f0e4d0; transition: background 0.15s; }
        .sup-table tbody tr:hover { background: #fef6ea; }
        .sup-table tbody tr:last-child { border-bottom: none; }
        .sup-table tbody td {
          padding: 11px 16px; font-size: 13px; color: #7a5c38;
          font-weight: 600; border: none; vertical-align: middle;
        }

        /* ── Initials avatar ── */
        .sup-avatar {
          width: 30px; height: 30px; border-radius: 8px;
          background: linear-gradient(135deg, #f5ddb8, #eac990);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; color: #7a4a14; flex-shrink: 0;
        }
        .sup-name-cell { display: flex; align-items: center; gap: 9px; }
        .sup-name-text { font-weight: 700; color: #3d2a10; }

        /* ── Action buttons ── */
        .act-btn {
          width: 30px; height: 30px; border-radius: 8px; border: none;
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 13px; margin-right: 4px;
          transition: opacity 0.15s, transform 0.13s;
        }
        .act-btn:last-child { margin-right: 0; }
        .act-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .act-view   { background: #e3f0ff; color: #1565c0; }
        .act-edit   { background: #fff8e1; color: #e65100; }
        .act-delete { background: #fdecea; color: #c62828; }

        /* ── Row number ── */
        .row-num { color: #c8a87a; font-weight: 700; font-size: 12px; }

        /* ── Empty state ── */
        .sup-empty { text-align: center; padding: 40px 20px; color: #b89060; }
        .sup-empty i { font-size: 36px; opacity: 0.4; display: block; margin-bottom: 8px; }
        .sup-empty p { font-size: 13px; font-weight: 600; margin: 0; }

        /* ── View Modal ── */
        .sup-modal .modal-content {
          border: 1px solid #e8dcc8; border-radius: 16px; overflow: hidden;
          font-family: 'Nunito', sans-serif;
          box-shadow: 0 8px 32px rgba(139,101,50,0.12);
        }
        .sup-modal .modal-header {
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          border-bottom: 1px solid #f0e4d0; padding: 16px 22px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .sup-modal-title {
          font-size: 15px; font-weight: 800; color: #3d2a10;
          display: flex; align-items: center; gap: 10px; margin: 0;
        }
        .sup-modal-title-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #c8965a, #a0733a);
          border-radius: 9px; display: flex; align-items: center; justify-content: center;
        }
        .sup-modal .modal-body { background: #fffdf9; padding: 22px; }
        .sup-modal .modal-footer {
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          border-top: 1px solid #f0e4d0; padding: 12px 22px;
        }
        .detail-field {
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          border: 1px solid #f0e4d0; border-radius: 10px; padding: 10px 14px;
        }
        .detail-label {
          font-size: 10px; font-weight: 800; letter-spacing: 0.8px;
          text-transform: uppercase; color: #c8a87a; margin: 0 0 3px;
        }
        .detail-value { font-size: 13.5px; font-weight: 700; color: #3d2a10; margin: 0; }
        .sup-close-btn {
          background: #fdecea; color: #c62828; border: none; border-radius: 8px;
          width: 30px; height: 30px; display: flex; align-items: center;
          justify-content: center; cursor: pointer; font-size: 14px;
        }
        .sup-close-btn:hover { opacity: 0.8; }
        .sup-dismiss-btn {
          background: #f3e5d8; color: #7a4a14; border: none; border-radius: 10px;
          padding: 8px 18px; font-size: 12.5px; font-weight: 700;
          font-family: 'Nunito', sans-serif; cursor: pointer;
        }
        .sup-dismiss-btn:hover { opacity: 0.8; }
      `}</style>

      <div className="row sup-wrap">
        <div className="col-12">
          <div className="sup-card">
            {/* ── Header ── */}
            <div className="sup-card-header">
              <div className="sup-header-left">
                <div className="sup-header-icon">
                  <i className="mdi mdi-truck-outline" />
                </div>
                <span className="sup-card-title">
                  Suppliers
                  <span className="sup-count-badge">{suppliers.length}</span>
                </span>
              </div>
              <button
                className="sup-add-btn"
                data-bs-toggle="modal"
                data-bs-target="#modal8"
                onClick={() => setEditData(null)}
              >
                <i className="mdi mdi-plus" style={{ fontSize: 15 }} />
                Add Supplier
              </button>
            </div>

            {/* ── Form Modal ── */}
            <SupplierForm
              key={editData?._id || "new-supplier"}
              onSaved={loadSuppliers}
              editData={editData}
              onClearEdit={() => setEditData(null)}
            />

            {/* ── View Modal ── */}
            <div className="modal fade sup-modal" id="modalView">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="sup-modal-title">
                      <div className="sup-modal-title-icon">
                        <i
                          className="mdi mdi-truck-outline"
                          style={{ color: "#fff", fontSize: 15 }}
                        />
                      </div>
                      Supplier Details
                    </h5>
                    <button className="sup-close-btn" data-bs-dismiss="modal">
                      <i className="mdi mdi-close" />
                    </button>
                  </div>
                  <div className="modal-body">
                    {viewData && (
                      <>
                        {/* Avatar */}
                        <div style={{ textAlign: "center", marginBottom: 22 }}>
                          <div
                            style={{
                              width: 70,
                              height: 70,
                              borderRadius: 14,
                              background:
                                "linear-gradient(135deg,#f5ddb8,#eac990)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto",
                              fontSize: 28,
                              fontWeight: 800,
                              color: "#7a4a14",
                            }}
                          >
                            {(viewData.name || "?")[0].toUpperCase()}
                          </div>
                          <p
                            style={{
                              marginTop: 10,
                              marginBottom: 0,
                              fontSize: 16,
                              fontWeight: 800,
                              color: "#3d2a10",
                            }}
                          >
                            {viewData.name || "—"}
                          </p>
                          <p
                            style={{
                              fontSize: 12,
                              color: "#b89060",
                              fontWeight: 600,
                              margin: "2px 0 0",
                            }}
                          >
                            Supplier
                          </p>
                        </div>

                        <div className="row g-3">
                          {[
                            {
                              label: "Email",
                              value: viewData.email || "—",
                              icon: "mdi-email-outline",
                            },
                            {
                              label: "Contact",
                              value: viewData.contact || "—",
                              icon: "mdi-phone-outline",
                            },
                            {
                              label: "Address",
                              value:
                                typeof viewData.address === "string"
                                  ? viewData.address
                                  : viewData.address?.street || "—",
                              icon: "mdi-map-marker-outline",
                            },
                          ].map((f) => (
                            <div className="col-sm-6 col-12" key={f.label}>
                              <div className="detail-field">
                                <p className="detail-label">
                                  <i className={`mdi ${f.icon} me-1`} />
                                  {f.label}
                                </p>
                                <p className="detail-value">{f.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button className="sup-dismiss-btn" data-bs-dismiss="modal">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Table ── */}
            <div className="sup-table-wrap">
              <table className="sup-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="sup-empty">
                          <i className="mdi mdi-truck-outline" />
                          <p>No suppliers found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    suppliers.map((sup, idx) => (
                      <tr key={sup._id}>
                        <td className="row-num">
                          {String(idx + 1).padStart(2, "0")}
                        </td>
                        <td>
                          <div className="sup-name-cell">
                            <div className="sup-avatar">
                              {(sup.name || "?")[0].toUpperCase()}
                            </div>
                            <span className="sup-name-text">{sup.name}</span>
                          </div>
                        </td>
                        <td>{sup.contact || "—"}</td>
                        <td>{sup.email || "—"}</td>
                        <td>
                          {typeof sup.address === "string"
                            ? sup.address || "—"
                            : sup.address?.street || "—"}
                        </td>
                        <td>
                          <button
                            className="act-btn act-view"
                            title="View"
                            onClick={() => handleView(sup)}
                          >
                            <i className="mdi mdi-eye" />
                          </button>
                          <button
                            className="act-btn act-edit"
                            title="Edit"
                            onClick={() => handleEdit(sup)}
                          >
                            <i className="mdi mdi-pencil" />
                          </button>
                          <button
                            className="act-btn act-delete"
                            title="Delete"
                            onClick={() => handleDelete(sup._id)}
                          >
                            <i className="mdi mdi-delete" />
                          </button>
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
    </>
  );
};

export default SupplierTable;
