import { useState, useEffect } from "react";
import createProduct from "../../api/ProductApi.js";
import toast from "react-hot-toast";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

  .pf-overlay {
    position: fixed; inset: 0;
    background: rgba(10, 10, 20, 0.55);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1050;
    padding: 1rem;
    animation: pfFadeIn 0.2s ease;
  }
  @keyframes pfFadeIn { from { opacity: 0 } to { opacity: 1 } }

  .pf-card {
    background: #fffdf9;
    border: 1px solid #e8dcc8;
    border-radius: 18px;
    width: 100%; max-width: 700px;
    box-shadow: 0 12px 40px rgba(139,101,50,0.14);
    font-family: 'Nunito', sans-serif;
    overflow: hidden;
    animation: pfSlideUp 0.25s cubic-bezier(.22,.68,0,1.2);
  }
  @keyframes pfSlideUp {
    from { transform: translateY(28px); opacity: 0 }
    to   { transform: translateY(0);    opacity: 1 }
  }

  .pf-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 22px;
    background: linear-gradient(135deg, #fffdf9, #fef6ea);
    border-bottom: 1px solid #f0e4d0;
  }
  .pf-header-left { display: flex; align-items: center; gap: 12px; }
  .pf-icon {
    width: 38px; height: 38px; border-radius: 11px;
    background: linear-gradient(135deg, #c8965a, #a0733a);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 1rem;
    flex-shrink: 0;
  }
  .pf-title {
    font-size: 15px; font-weight: 800;
    color: #3d2a10; margin: 0;
  }
  .pf-subtitle { 
    font-size: 11px; color: #b89060; 
    font-weight: 600; margin: 0;
  }

  .pf-close {
    width: 30px; height: 30px; border-radius: 8px;
    background: #fdecea; color: #c62828;
    border: none; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 15px; transition: opacity 0.15s;
  }
  .pf-close:hover { opacity: 0.8; }

  .pf-body {
    padding: 22px 22px 10px;
    max-height: 62vh; overflow-y: auto;
    background: #fffdf9;
    scrollbar-width: thin; scrollbar-color: #e8dcc8 transparent;
  }

  .pf-section-label {
    font-size: 10px; font-weight: 800; letter-spacing: 1.2px;
    text-transform: uppercase; color: #c8a87a;
    margin: 0 0 14px; padding: 0;
    display: flex; align-items: center; gap: 8px;
  }
  .pf-section-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, #e8dcc8, transparent);
  }

  .pf-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .pf-field { 
    display: flex; flex-direction: column; gap: 0.35rem;
    margin-bottom: 4px;
  }
  .pf-field.full { grid-column: span 2; }

  .pf-label {
    font-size: 11.5px; font-weight: 700; color: #7a5c38;
    display: block;
    font-family: 'Nunito', sans-serif;
  }
  .pf-required { color: #c62828; font-size: 0.9em; }

  .pf-input {
    padding: 9px 12px;
    border: 1px solid #e8dcc8;
    border-radius: 10px;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 600; 
    color: #3d2a10;
    background: #fffdf9;
    transition: border-color 0.18s, box-shadow 0.18s;
    outline: none;
  }
  .pf-input:focus {
    border-color: #c8965a;
    box-shadow: 0 0 0 3px rgba(200,150,90,0.12);
    background: #fffdf9;
  }
  .pf-input::placeholder { 
    color: #d4b896; font-weight: 500;
  }

  .pf-file-label {
    display: flex; align-items: center; gap: 8px;
    border: 1.5px dashed #e0ccb0; border-radius: 10px;
    padding: 10px 14px; cursor: pointer;
    background: linear-gradient(135deg, #fffdf9, #fef6ea);
    transition: border-color 0.18s;
  }
  .pf-file-label:hover { border-color: #c8965a; }
  .pf-file-label i { color: #c8965a; font-size: 20px; }
  .pf-file-text { font-size: 12px; font-weight: 600; color: #7a5c38; }
  .pf-file-sub { font-size: 10.5px; color: #c8a87a; }
  .pf-file-input { display: none; }

  .pf-hint { 
    font-size: 10.5px; color: #c8a87a; 
    font-weight: 600; margin-top: 4px;
    font-family: 'Nunito', sans-serif;
  }

  .pf-footer {
    display: flex; align-items: center; justify-content: flex-end;
    gap: 0.75rem;
    padding: 14px 22px;
    border-top: 1px solid #f0e4d0;
    background: linear-gradient(135deg, #fffdf9, #fef6ea);
  }

  .pf-btn {
    padding: 9px 22px;
    border-radius: 10px; border: none;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: opacity 0.18s, transform 0.15s;
    display: flex; align-items: center; gap: 7px;
  }
  .pf-btn-primary {
    background: linear-gradient(135deg, #c8965a, #a0733a);
    color: #fff;
  }
  .pf-btn-primary:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  .pf-btn-primary:active { transform: translateY(0); }
  .pf-btn-ghost {
    background: #fdecea; color: #c62828;
  }
  .pf-btn-ghost:hover { opacity: 0.8; }

  @media (max-width: 560px) {
    .pf-grid { grid-template-columns: 1fr; }
    .pf-field.full { grid-column: span 1; }
  }
`;

const FIELDS = [
  {
    label: "Product Title",
    field: "title",
    type: "text",
    hint: "e.g. Wireless Headphones Pro",
  },
  { label: "Author", field: "author", type: "text", hint: "e.g. John Doe" },
  {
    label: "Category",
    field: "category",
    type: "text",
    hint: "e.g. Electronics",
  },
  {
    label: "Barcode",
    field: "barcode",
    type: "text",
    hint: "Scan or enter barcode",
    required: true,
  },
  {
    label: "Price",
    field: "price",
    type: "number",
    hint: "Enter amount in PKR",
  },
  {
    label: "Stock Quantity",
    field: "stockQuantity",
    type: "number",
    hint: "Available units",
  },
  {
    label: "Description",
    field: "description",
    type: "text",
    hint: "Short product description",
    full: true,
  },
];

const EMPTY = {
  title: "",
  description: "",
  price: "",
  stockQuantity: "",
  author: "",
  category: "",
  barcode: "",
};

const ProductForm = ({ onSaved, editData, onClearEdit, isOpen, onClose }) => {
  const [value, setValue] = useState(EMPTY);
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
      Object.entries(value).forEach(([key, val]) => formData.append(key, val));
      if (imageFile) formData.append("image", imageFile);

      if (editData) {
        const { updateProduct } = await import("../../api/ProductApi.js");
        await updateProduct(editData._id, formData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData);
        toast.success("Product added successfully");
      }
      handleReset();
      onSaved?.();
      onClose?.();
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  }

  function handleReset() {
    setValue(EMPTY);
    setImageFile(null);
    onClearEdit?.();
  }

  function handleClose() {
    handleReset();
    onClose?.();
  }

  if (!isOpen) return null;

  return (
    <>
      <style>{styles}</style>
      <div
        className="pf-overlay"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <div
          className="pf-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pf-title"
        >
          {/* Header */}
          <div className="pf-header">
            <div className="pf-header-left">
              <div className="pf-icon">{editData ? "✏️" : "＋"}</div>
              <div>
                <p className="pf-title" id="pf-title">
                  {editData ? "Edit Product" : "Add New Product"}
                </p>
                <p className="pf-subtitle">
                  {editData
                    ? "Update the product details below"
                    : "Fill in the details to add a product"}
                </p>
              </div>
            </div>
            <button
              className="pf-close"
              onClick={handleClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <form onSubmit={SaveProduct}>
            <div className="pf-body">
              <p className="pf-section-label">Product Information</p>
              <div className="pf-grid">
                {FIELDS.map(({ label, field, type, hint, required, full }) => (
                  <div className={`pf-field${full ? " full" : ""}`} key={field}>
                    <label className="pf-label" htmlFor={`pf-${field}`}>
                      {label}
                      {required && <span className="pf-required">*</span>}
                    </label>
                    <input
                      id={`pf-${field}`}
                      className="pf-input"
                      type={type}
                      placeholder={hint}
                      value={value[field]}
                      onChange={handleChange(field)}
                      required={required || false}
                    />
                    <span className="pf-hint">{hint}</span>
                  </div>
                ))}

                {/* Image Upload */}
                <div className="pf-field full">
                  <label className="pf-label" htmlFor="pf-image">
                    Product Image
                  </label>
                  <label className="pf-file-label" htmlFor="pf-image">
                    <i className="mdi mdi-cloud-upload" />
                    <div>
                      <div className="pf-file-text">Click to upload image</div>
                      <div className="pf-file-sub">
                        JPG, PNG, WEBP — optional
                      </div>
                    </div>
                  </label>
                  <input
                    id="pf-image"
                    className="pf-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imageFile && (
                    <div
                      style={{
                        marginTop: "12px",
                        fontSize: "12px",
                        color: "#7a5c38",
                        fontWeight: 600,
                      }}
                    >
                      ✓ {imageFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pf-footer">
              <button
                type="button"
                className="pf-btn pf-btn-ghost"
                onClick={handleReset}
              >
                Reset
              </button>
              <button type="submit" className="pf-btn pf-btn-primary">
                {editData ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductForm;
