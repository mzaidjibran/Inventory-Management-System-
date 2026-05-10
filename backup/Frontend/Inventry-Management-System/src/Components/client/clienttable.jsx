import { useState } from "react";
import ClientHook from "../../Hook/clienthook.jsx";
import ClientForm from "./clientform.jsx";
import { deleteClient } from "../../Api/client.js";
import toast from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast.js";

const ClientTable = () => {
  function formatAddress(address) {
    if (!address) {
      return "-";
    }

    if (typeof address === "string") {
      return address;
    }

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

  const { clients, loadClients } = ClientHook();
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

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
    const modal = new window.bootstrap.Modal(document.getElementById("modal8"));
    modal.show();
  }

  function handleView(client) {
    setViewData(client);
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
            <h4 className="card-title">Customers</h4>
            <button
              type="button"
              className="btn btn-primary btn-sm ms-2"
              data-bs-toggle="modal"
              data-bs-target="#modal8"
              onClick={() => setEditData(null)}
            >
              Add Customers
            </button>
          </div>

          <ClientForm
            key={editData?._id || "new-client"}
            onSaved={loadClients}
            editData={editData}
            onClearEdit={() => setEditData(null)}
          />

          <div className="modal fade" id="modalView">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Customer Details</h5>
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
                          {formatAddress(viewData.address)}
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
                {clients.map((client) => (
                  <tr key={client._id}>
                    <td>{client.name}</td>
                    <td>{client.contact || "-"}</td>
                    <td>{client.email || "-"}</td>
                    <td>{formatAddress(client.address)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-1"
                        title="View"
                        onClick={() => handleView(client)}
                      >
                        <i className="mdi mdi-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-warning me-1"
                        title="Edit"
                        onClick={() => handleEdit(client)}
                      >
                        <i className="mdi mdi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        title="Delete"
                        onClick={() => handleDelete(client._id)}
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

export default ClientTable;