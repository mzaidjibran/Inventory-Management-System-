import { useState } from "react";
import SupplierHook from "../../Hook/SupplierHook.jsx";
import SupplierForm from "./SupplierForm.jsx";
import { deleteSupplier } from "../../Api/supplier.js";
import { toast } from "react-toastify";

const SupplierTable = () => {
  // function formatAddress(address) {
  //   if (!address) {
  //     return "-";
  //   }

  //   if (typeof address == "string") {
  //     return address;
  //   }

  //   if (typeof address == "object") {
  //     return (
  //       [
  //         address.street,
  //         address.city,
  //         address.state,
  //         address.country,
  //         address.zipCode,
  //       ]
  //         .filter(Boolean)
  //         .join(", ") || "-"
  //     );
  //   }

  //   return "-";
  // }

  const { suppliers, loadSuppliers } = SupplierHook();
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  function handleDelete(id) {
    let confirmToastId;
    confirmToastId = toast(
      ({ closeToast }) => (
        <div>
          <div className="fw-semibold">Delete this Supplier?</div>
          <div className="d-flex gap-2 mt-2">
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={async () => {
                closeToast();
                try {
                  await deleteSupplier(id);
                  loadSuppliers();
                  toast.dismiss(confirmToastId);
                  toast.success("Supplier deleted successfully");
                } catch (err) {
                  toast.error("Delete failed: " + err.message);
                }
              }}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={closeToast}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        position: "top-right",
      },
    );
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
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Suppliers</h4>
            <button
              type="button"
              className="btn btn-primary btn-sm ms-2"
              data-bs-toggle="modal"
              data-bs-target="#modal8"
              onClick={() => setEditData(null)}
            >
              Add Supplier
            </button>
          </div>

          <SupplierForm
            key={editData?._id || "new-supplier"}
            onSaved={loadSuppliers}
            editData={editData}
            onClearEdit={() => setEditData(null)}
          />

          <div className="modal fade" id="modalView">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Supplier Details</h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-label-danger btn-icon"
                    data-bs-dismiss="modal"
                  >
                    <i className="mdi mdi-close"></i>
                  </button>
                </div>
                <div className="modal-body">
                  {viewData && (
                    <div className="row g-3">
                      <div className="col-6">
                        <small className="text-muted">Name</small>
                        <p className="fw-semibold">{viewData.name || "-"}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Email</small>
                        <p className="fw-semibold">{viewData.email || "-"}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Contact</small>
                        <p className="fw-semibold">{viewData.contact || "-"}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Address</small>
                        <p className="fw-semibold">
                          {viewData.address || "-"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card-body">
            <table
              className="table table-hover table-bordered table-striped dt-responsive nowrap"
              style={{
                borderCollapse: "collapse",
                borderSpacing: 0,
                width: "100%",
              }}
            >
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
                {suppliers.map((sup) => (
                  <tr key={sup._id}>
                    <td>{sup.name}</td>
                    <td>{sup.contact || "-"}</td>
                    <td>{sup.email || "-"}</td>
                    <td>{sup.address || "-"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-1"
                        title="View"
                        onClick={() => handleView(sup)}
                      >
                        <i className="mdi mdi-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-warning me-1"
                        title="Edit"
                        onClick={() => handleEdit(sup)}
                      >
                        <i className="mdi mdi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        title="Delete"
                        onClick={() => handleDelete(sup._id)}
                      >
                        <i className="mdi mdi-delete"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierTable;
