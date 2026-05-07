import { useState } from "react";
import SupplierHook from "../../Hook/SupplierHook.jsx";
import SupplierForm from "./SupplierForm.jsx";
import { deleteProduct } from "../../Api/ProductApi.js";
import { toast } from "react-toastify";

const SupplierTable = () => {
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

  const { products, loadProducts } = ProductHook();
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  function handleDelete(id) {
    let confirmToastId;
    confirmToastId = toast(
      ({ closeToast }) => (
        <div>
          <div className="fw-semibold">Delete this Product?</div>
          <div className="d-flex gap-2 mt-2">
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={async () => {
                closeToast();
                try {
                  await deleteProduct(id);
                  loadProducts();
                  toast.dismiss(confirmToastId);
                  toast.success("Product deleted successfully");
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

  function handleView(pro) {
    setViewData(pro);
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
            <h4 className="card-title">Products</h4>
            <button
              type="button"
              className="btn btn-primary btn-sm ms-2"
              data-bs-toggle="modal"
              data-bs-target="#productModal"
              onClick={() => setEditData(null)}
            >
              Add Product
            </button>
          </div>

          <ProductForm
            onSaved={loadProducts}
            editData={editData}
            onClearEdit={() => setEditData(null)}
          />

          <div className="modal fade" id="modalView">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Product Details</h5>
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
                      <div className="col-12">
                        <small className="text-muted">Image</small>
                        <div className="mt-1">
                          {viewData.image ? (
                            <img
                              src={
                                viewData.image.startsWith("http")
                                  ? viewData.image
                                  : `${API_BASE}/${viewData.image}`
                              }
                              alt={viewData.title || "Product"}
                              style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                              }}
                            />
                          ) : (
                            <p className="fw-semibold mb-0">-</p>
                          )}
                        </div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Title</small>
                        <p className="fw-semibold">{viewData.title || "-"}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Author</small>
                        <p className="fw-semibold">{viewData.author || "-"}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Category</small>
                        <p className="fw-semibold">
                          {viewData.category || "-"}
                        </p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Barcode</small>
                        <p className="fw-semibold">{viewData.barcode || "-"}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Description</small>
                        <p className="fw-semibold">
                          {viewData.description || "-"}
                        </p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Price</small>
                        <p className="fw-semibold">{viewData.price || "-"}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Stock Quantity</small>
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
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Qty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((sup) => (
                  <tr key={sup._id}>
                    <td>{sup.name}</td>
                    <td>{sup.contact || "-"}</td>
                    <td>{sup.email || "-"}</td>
                    <td>{formatAddress(sup.address)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-1"
                        title="View"
                        onClick={() => handleView(pro)}
                      >
                        <i className="mdi mdi-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-warning me-1"
                        title="Edit"
                        onClick={() => handleEdit(pro)}
                      >
                        <i className="mdi mdi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        title="Delete"
                        onClick={() => handleDelete(pro._id)}
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

export default ProductTable;
