import { useState } from "react";
import createSupplier, { updateSuppliers } from "../../Api/supplier.js";
import { toast } from "react-toastify";

function buildInitialValue(editData) {
  if (!editData) {
    return {
      name: "",
      email: "",
      contact: "",
      address: "",
    };
  }

  return {
    name: editData.name || "",
    email: editData.email || "",
    contact: editData.contact || "",
    address:
      typeof editData.address === "string"
        ? editData.address
        : editData.address?.street || "",
  };
}

const SupplierForm = ({ onSaved, editData, onClearEdit }) => {
  const empty = buildInitialValue(null);
  const [value, updateValue] = useState(() => buildInitialValue(editData));

  function handleChange(field) {
    return (e) => updateValue((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function SaveSupplier(e) {
    e.preventDefault();
    try {
      const payload = { ...value };

      if (editData) {
        await updateSuppliers(editData._id, payload);
        toast.success("Supplier updated successfully");
      } else {
        await createSupplier(payload);
        toast.success("Supplier added successfully");
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
            <h5 className="modal-title">
              {editData ? "Edit Supplier" : "Add Supplier"}
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
          <form onSubmit={SaveSupplier}>
            <div className="modal-body">
              <div className="row g-3">
                {[
                  {
                    label: "Name",
                    field: "name",
                    type: "text",
                    hint: "Enter supplier name",
                  },
                  {
                    label: "Email",
                    field: "email",
                    type: "email",
                    hint: "Enter email",
                  },
                  {
                    label: "Contact",
                    field: "contact",
                    type: "text",
                    hint: "Enter contact number",
                  },
                  {
                    label: "Address",
                    field: "address",
                    type: "text",
                    hint: "Enter address",
                  },
                ].map(({ label, field, type, hint }) => (
                  <div className="col-6" key={field}>
                    <label className="form-label">{label}</label>
                    <input
                      className="form-control"
                      type={type}
                      value={value[field]}
                      onChange={handleChange(field)}
                      placeholder={hint}
                    />
                    <small className="form-text text-muted">{hint}</small>
                  </div>
                ))}
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

export default SupplierForm;
