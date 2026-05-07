import React, { useState, useEffect } from "react";
import createProduct from "../../Api/ProductApi.js";
import { toast } from "react-toastify";

const ProductForm = ({ onSaved, editData, onClearEdit }) => {
    const empty = {
        title: "", author: "", description: "", price: "",
        stockQuantity: "", category: "", barcode: ""
    };
    const [value, updateValue] = useState(empty);

    useEffect(() => {
        if (editData) {
            updateValue({
                title: editData.title || "",
                author: editData.author || "",
                description: editData.description || "",
                price: editData.price || "",
                stockQuantity: editData.stockQuantity || "",
                category: editData.category || "",
                barcode: editData.barcode || ""
            });
        }
    }, [editData]);

    function handleChange(field) {
        return (e) => updateValue(prev => ({ ...prev, [field]: e.target.value }));
    }

    async function SaveProduct(e) {
        e.preventDefault();
        try {
            // Validate required fields
            if (!value.title || !value.author || !value.category || !value.price || !value.stockQuantity) {
                toast.error("Please fill all required fields (Title, Author, Category, Price, Stock)");
                return;
            }

            // Convert string fields to correct types
            const productData = {
                ...value,
                price: parseFloat(value.price) || 0,
                stockQuantity: parseInt(value.stockQuantity) || 0
            };

            if (editData) {
                const { updateProduct } = await import("../../Api/ProductApi.js");
                await updateProduct(editData._id, productData);
                toast.success("Product updated successfully");
            } else {
                await createProduct(productData);
                toast.success("Product added successfully");
            }
            updateValue(empty);
            onSaved && onSaved();
            onClearEdit && onClearEdit();
            const modal = document.getElementById("modal8");
            const bsModal = window.bootstrap?.Modal?.getInstance(modal);
            bsModal?.hide();
        } catch (err) {
            toast.error("Error: " + err.message);
        }
    }

    function handleReset() {
        updateValue(empty);
        onClearEdit && onClearEdit();
    }

    return (
        <div className="modal fade" id="modal8">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{editData ? "Edit Product" : "Add Product"}</h5>
                        <button type="button" className="btn btn-sm btn-label-danger btn-icon"
                            data-bs-dismiss="modal" onClick={handleReset}>
                            <i className="mdi mdi-close"></i>
                        </button>
                    </div>
                    <form onSubmit={SaveProduct}>
                        <div className="modal-body">
                            <div className="row g-3">
                                {[
                                    { label: "Product Title", field: "title", type: "text", hint: "Enter Product Title" },
                                    { label: "Author/Brand", field: "author", type: "text", hint: "Enter Author/Brand" },
                                    { label: "Description", field: "description", type: "text", hint: "Enter Product description" },
                                    { label: "Category", field: "category", type: "text", hint: "Enter Product Category" },
                                    { label: "Price", field: "price", type: "number", hint: "Enter Product Price" },
                                    { label: "Stock Quantity", field: "stockQuantity", type: "number", hint: "Enter Stock Quantity" },
                                    { label: "Barcode", field: "barcode", type: "text", hint: "Enter Barcode (optional)" }
                                ].map(({ label, field, type, hint }) => (
                                    <div className="col-6" key={field}>
                                        <label className="form-label">{label}</label>
                                        <input className="form-control" type={type}
                                            value={value[field]} onChange={handleChange(field)} />
                                        <small className="form-text text-muted">{hint}</small>
                                    </div>
                                ))}

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary">
                                {editData ? "Update" : "Submit"}
                            </button>
                            <button type="button" className="btn btn-outline-danger" onClick={handleReset}>
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