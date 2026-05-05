import React, { useState, useEffect } from "react";
import createProduct from "../../api/ProductApi.js";
import { toast } from "react-toastify";

const ProductForm = ({ onSaved, editData, onClearEdit }) => {
    const empty = {
        productName: "", productDescription: "", productPrice: "",
        productStock: ""
    };
    const [value, updateValue] = useState(empty);

    useEffect(() => {
        if (editData) {
            updateValue({
                productName: editData.productName || "",
                productDescription: editData.productDescription || "",
                productPrice: editData.productPrice || "",
                productStock: editData.productStock || ""
            });
        }
    }, [editData]);

    function handleChange(field) {
        return (e) => updateValue(prev => ({ ...prev, [field]: e.target.value }));
    }

    async function SaveProduct(e) {
        e.preventDefault();
        try {
            if (editData) {
                const { updateProduct } = await import("../../api/ProductApi.js");
                await updateProduct(editData._id, value);
                toast.success("Product updated successfully");
            } else {
                await createProduct(value);
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
                                    { label: "product Name", field: "productName", type: "text", hint: "Enter Product Name" },
                                    { label: "product Description", field: "productDescription", type: "text", hint: "Enter Product description" },
                                    { label: "product Price", field: "productPrice", type: "Number", hint: "Enter Product Price" },
                                    { label: "product Stock", field: "productStock", type: "Number", hint: "Enter Product Quantity" }
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