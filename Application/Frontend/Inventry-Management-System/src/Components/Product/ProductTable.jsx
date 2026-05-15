import { useState } from "react";
import ProductHook from "../../hook/ProductHook.jsx";
import ProductForm from "./ProductForm.jsx";
import { deleteProduct } from "../../Api/ProductApi.js";
import toast from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast.js";

const ProductTable = () => {
  const API_BASE = "http://127.0.0.1:3000";

  const { products, loadProducts } = ProductHook();
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  function handleDelete(id) {
    confirmToast("Delete this Product?", async () => {
      try {
        await deleteProduct(id);
        loadProducts();
        toast.success("Product deleted successfully");
      } catch (err) {
        toast.error("Delete failed: " + err.message);
      }
    });
  }

  function handleEdit(pro) {
    setEditData(pro);
    setFormOpen(true);
  }

  function handleView(pro) {
    setViewData(pro);
    const modal = new window.bootstrap.Modal(
      document.getElementById("modalView"),
    );
    modal.show();
  }

  function handleAddClick() {
    setEditData(null);
    setFormOpen(true);
  }

  return (
    <div className="row">
      <div className="col-12">
        <div
          style={{
            background: "#fffdf9",
            border: "1px solid #e8dcc8",
            borderRadius: 14,
            overflow: "hidden",
            fontFamily: "Nunito, sans-serif",
          }}
        >
          {/* ── Card Header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 22px",
              borderBottom: "1px solid #e8dcc8",
              background: "#fdf8f2",
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 800,
                color: "#3d2a10",
              }}
            >
              Products
            </h4>
            <button
              type="button"
              onClick={handleAddClick}
              style={{
                background: "linear-gradient(135deg, #c8965a, #e8b87a)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "7px 18px",
                fontSize: 12,
                fontWeight: 800,
                fontFamily: "Nunito, sans-serif",
                cursor: "pointer",
                letterSpacing: "0.3px",
              }}
            >
              + Add Product
            </button>
          </div>

          <ProductForm
            isOpen={formOpen}
            key={editData?._id || "new-product"}
            onSaved={loadProducts}
            editData={editData}
            onClearEdit={() => setEditData(null)}
            onClose={() => setFormOpen(false)}
          />

          {/* ── View Modal ── */}
          <div className="modal fade" id="modalView">
            <div className="modal-dialog modal-lg">
              <div
                className="modal-content"
                style={{
                  border: "1px solid #e8dcc8",
                  borderRadius: 14,
                  overflow: "hidden",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                <div
                  className="modal-header"
                  style={{
                    background: "#fdf8f2",
                    borderBottom: "1px solid #e8dcc8",
                    padding: "14px 20px",
                  }}
                >
                  <h5
                    className="modal-title"
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#3d2a10",
                      margin: 0,
                    }}
                  >
                    Product Details
                  </h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-label-danger btn-icon"
                    data-bs-dismiss="modal"
                  >
                    <i className="mdi mdi-close"></i>
                  </button>
                </div>

                <div
                  className="modal-body"
                  style={{ background: "#fffdf9", padding: "20px" }}
                >
                  {viewData && (
                    <div className="row g-3">
                      {/* Image */}
                      <div className="col-12">
                        <small
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#b89060",
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                          }}
                        >
                          Image
                        </small>
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
                                borderRadius: "10px",
                                border: "1px solid #e8dcc8",
                              }}
                            />
                          ) : (
                            <p
                              style={{
                                fontWeight: 700,
                                color: "#3d2a10",
                                margin: 0,
                              }}
                            >
                              -
                            </p>
                          )}
                        </div>
                      </div>

                      {[
                        { label: "Title", value: viewData.title },
                        { label: "Author", value: viewData.author },
                        { label: "Category", value: viewData.category },
                        { label: "Barcode", value: viewData.barcode },
                        { label: "Description", value: viewData.description },
                        { label: "Price", value: viewData.price },
                        {
                          label: "Stock Quantity",
                          value: viewData.stockQuantity,
                        },
                      ].map(({ label, value }) => (
                        <div className="col-6" key={label}>
                          <small
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#b89060",
                              textTransform: "uppercase",
                              letterSpacing: "0.8px",
                            }}
                          >
                            {label}
                          </small>
                          <p
                            style={{
                              fontWeight: 700,
                              color: "#3d2a10",
                              margin: "4px 0 0",
                              fontSize: 13,
                            }}
                          >
                            {value || "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className="modal-footer"
                  style={{
                    background: "#fdf8f2",
                    borderTop: "1px solid #e8dcc8",
                    padding: "12px 20px",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-dismiss="modal"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "Nunito, sans-serif",
                      borderColor: "#e8dcc8",
                      color: "#b89060",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Table ── */}
          <div style={{ padding: "0 0 8px" }}>
            <table
              className="table table-hover dt-responsive nowrap"
              style={{
                borderCollapse: "collapse",
                width: "100%",
                fontSize: 13,
                fontFamily: "Nunito, sans-serif",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f9f1e8",
                    borderBottom: "2px solid #e8dcc8",
                  }}
                >
                  {[
                    "Title",
                    "Author",
                    "Category",
                    "Price",
                    "Stock Qty",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 14px",
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#b89060",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        border: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((pro, idx) => (
                  <tr
                    key={pro._id}
                    style={{
                      background: idx % 2 === 0 ? "#fffdf9" : "#fdf8f2",
                      borderBottom: "1px solid #f0e6d8",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f9f1e8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        idx % 2 === 0 ? "#fffdf9" : "#fdf8f2")
                    }
                  >
                    <td
                      style={{
                        padding: "10px 14px",
                        color: "#3d2a10",
                        fontWeight: 700,
                        border: "none",
                      }}
                    >
                      {pro.title}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        color: "#7a5c38",
                        border: "none",
                      }}
                    >
                      {pro.author || "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        color: "#7a5c38",
                        border: "none",
                      }}
                    >
                      {pro.category || "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        color: "#3d2a10",
                        fontWeight: 700,
                        border: "none",
                      }}
                    >
                      Rs. {pro.price}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        border: "none",
                      }}
                    >
                      <span
                        style={{
                          background:
                            pro.stockQuantity > 10 ? "#e8f5e9" : "#fff3e0",
                          color: pro.stockQuantity > 10 ? "#2e7d32" : "#e65100",
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        {pro.stockQuantity}
                      </span>
                    </td>
                    <td style={{ padding: "8px 14px", border: "none" }}>
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
