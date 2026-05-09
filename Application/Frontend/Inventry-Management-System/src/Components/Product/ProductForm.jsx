import { useState, useEffect } from "react";
import createProduct from "../../api/ProductApi.js";
import toast from "react-hot-toast";

const ProductForm = ({ onSaved, editData, onClearEdit }) => {
  const empty = {
    title: "",
    description: "",
    price: "",
    stockQuantity: "",
    author: "",
    category: "",
    barcode: "",
  };
  const [value, setValue] = useState(empty);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (editData) {
      setValue({
        title: editData.title || "",
        description: editData.description || "",
        price: editData.price || "",
        stockQuantity: editData.stockQuantity || "",
        author: editData.author || "",
        category: editData.category || "",
        barcode: editData.barcode || "",
      });
    }
  }, [editData]);

  function handleChange(field) {
    return (e) => setValue((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleImageChange(e) {
    setImageFile(e.target.files[0] || null);
  }

  async function SaveProduct(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(value).forEach(([key, val]) => {
        formData.append(key, val);
      });
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editData) {
        const { updateProduct } = await import("../../api/ProductApi.js");
        await updateProduct(editData._id, formData);
        notify.success("Product updated successfully");
      } else {
        await createProduct(formData);
        notify.success("Product added successfully");
      }
      setValue(empty);
      setImageFile(null);
      onSaved && onSaved();
      onClearEdit && onClearEdit();
      const modal = document.getElementById("productModal");
      const bsModal = window.bootstrap?.Modal?.getInstance(modal);
      bsModal?.hide();
    } catch (err) {
      notify.error("Error: " + err.message);
    }
  }

  function handleReset() {
    setValue(empty);
    setImageFile(null);
    onClearEdit && onClearEdit();
  }

  return (
    <div className="modal fade" id="productModal">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editData ? "Edit Product" : "Add Product"}
            </h5>
            <button
              type="button"
              className="btn btn-sm btn-label-danger btn-icon"
              data-bs-dismiss="modal"
              onClick={handleReset}
            >
              <i className="mdi mdi-close"></i>
            </button>
          </div>
          <form onSubmit={SaveProduct}>
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <div className="row g-3">
                {[
                  {
                    label: "Product Title",
                    field: "title",
                    type: "text",
                    hint: "Enter Product Title",
                  },
                  {
                    label: "Author",
                    field: "author",
                    type: "text",
                    hint: "Enter Product Author",
                  },
                  {
                    label: "Category",
                    field: "category",
                    type: "text",
                    hint: "Enter Product Category",
                  },
                  {
                    label: "Barcode",
                    field: "barcode",
                    type: "text",
                    hint: "Enter Product Barcode",
                    required: true,
                  },
                  {
                    label: "Description",
                    field: "description",
                    type: "text",
                    hint: "Enter Product Description",
                  },
                  {
                    label: "Price",
                    field: "price",
                    type: "number",
                    hint: "Enter Product Price",
                  },
                  {
                    label: "Stock Quantity",
                    field: "stockQuantity",
                    type: "number",
                    hint: "Enter Stock Quantity",
                  },
                ].map(({ label, field, type, hint, required }) => (
                  <div className="col-6" key={field}>
                    <label className="form-label">{label}</label>
                    <input
                      className="form-control"
                      type={type}
                      value={value[field]}
                      onChange={handleChange(field)}
                      required={required || false}
                    />
                    <small className="form-text text-muted">{hint}</small>
                  </div>
                ))}
                <div className="col-6">
                  <label className="form-label">Product Image</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small className="form-text text-muted">
                    Upload product image (optional). JPG, PNG, WEBP supported.
                  </small>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                {editData ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
