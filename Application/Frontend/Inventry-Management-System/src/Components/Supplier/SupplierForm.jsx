import { useState } from "react";
import createSupplier, { updateSuppliers } from "../../Api/supplier.js";
import toast from "react-hot-toast";

function buildInitialValue(editData) {
  if (!editData) return { name: "", email: "", contact: "", address: "" };
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
      if (!value.name.trim() || !value.email.trim() || !value.contact.trim()) {
        toast.error("Name, email, and contact are required");
        return;
      }
      const payload = {
        ...value,
        name: value.name.trim(),
        email: value.email.trim(),
        contact: value.contact.trim(),
        address: value.address.trim() || "",
      };
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

  const fields = [
    {
      label: "Supplier Name",
      field: "name",
      type: "text",
      icon: "mdi-truck-outline",
      hint: "Enter supplier name",
      required: true,
    },
    {
      label: "Email",
      field: "email",
      type: "email",
      icon: "mdi-email-outline",
      hint: "Enter email address",
      required: true,
    },
    {
      label: "Contact",
      field: "contact",
      type: "text",
      icon: "mdi-phone-outline",
      hint: "e.g. 0312-3456789",
      required: true,
    },
    {
      label: "Address",
      field: "address",
      type: "text",
      icon: "mdi-map-marker-outline",
      hint: "Enter full address",
      required: false,
    },
  ];

  return (
    <>
      <style>{`
        .sf-modal .modal-content {
          border: 1px solid #e8dcc8;
          border-radius: 18px;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
          box-shadow: 0 12px 40px rgba(139,101,50,0.14);
        }
        .sf-modal .modal-header {
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          border-bottom: 1px solid #f0e4d0;
          padding: 16px 22px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .sf-header-left { display: flex; align-items: center; gap: 12px; }
        .sf-header-icon {
          width: 38px; height: 38px; border-radius: 11px;
          background: linear-gradient(135deg, #c8965a, #a0733a);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sf-header-icon i { color: #fff; font-size: 18px; }
        .sf-modal-title  { font-size: 15px; font-weight: 800; color: #3d2a10; margin: 0; }
        .sf-modal-subtitle { font-size: 11px; color: #b89060; font-weight: 600; margin: 0; }
        .sf-close-btn {
          width: 30px; height: 30px; border-radius: 8px;
          background: #fdecea; color: #c62828; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 15px; transition: opacity 0.15s;
        }
        .sf-close-btn:hover { opacity: 0.8; }

        .sf-modal .modal-body { background: #fffdf9; padding: 22px 22px 10px; }

        .sf-section-label {
          font-size: 10px; font-weight: 800; letter-spacing: 1.2px;
          text-transform: uppercase; color: #c8a87a; margin: 0 0 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .sf-section-label::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, #e8dcc8, transparent);
        }

        .sf-label { font-size: 11.5px; font-weight: 700; color: #7a5c38; margin-bottom: 5px; display: block; }
        .sf-input-wrap { position: relative; display: flex; align-items: center; }
        .sf-input-icon {
          position: absolute; left: 11px; color: #c8a87a;
          font-size: 16px; pointer-events: none; z-index: 1;
        }
        .sf-input {
          width: 100%; padding: 9px 12px 9px 36px;
          border: 1px solid #e8dcc8; border-radius: 10px;
          background: #fffdf9; font-size: 13px; font-weight: 600; color: #3d2a10;
          font-family: 'Nunito', sans-serif;
          transition: border-color 0.18s, box-shadow 0.18s; outline: none;
        }
        .sf-input:focus {
          border-color: #c8965a;
          box-shadow: 0 0 0 3px rgba(200,150,90,0.12);
        }
        .sf-input::placeholder { color: #d4b896; font-weight: 500; }

        .sf-required {
          display: inline-block; background: #fdecea; color: #c62828;
          font-size: 9px; font-weight: 800; padding: 1px 6px;
          border-radius: 20px; margin-left: 5px; letter-spacing: 0.4px;
        }

        .sf-modal .modal-footer {
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          border-top: 1px solid #f0e4d0; padding: 14px 22px;
          display: flex; align-items: center; gap: 10px; justify-content: flex-end;
        }
        .sf-submit-btn {
          display: flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg, #c8965a, #a0733a);
          color: #fff; border: none; border-radius: 10px;
          padding: 9px 22px; font-size: 13px; font-weight: 700;
          font-family: 'Nunito', sans-serif; cursor: pointer;
          transition: opacity 0.18s, transform 0.15s;
        }
        .sf-submit-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .sf-reset-btn {
          display: flex; align-items: center; gap: 7px;
          background: #fdecea; color: #c62828; border: none; border-radius: 10px;
          padding: 9px 18px; font-size: 13px; font-weight: 700;
          font-family: 'Nunito', sans-serif; cursor: pointer; transition: opacity 0.18s;
        }
        .sf-reset-btn:hover { opacity: 0.8; }
      `}</style>

      <div className="modal fade sf-modal" id="modal8">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* ── Header ── */}
            <div className="modal-header">
              <div className="sf-header-left">
                <div className="sf-header-icon">
                  <i
                    className={`mdi ${editData ? "mdi-truck-check-outline" : "mdi-truck-plus-outline"}`}
                  />
                </div>
                <div>
                  <p className="sf-modal-title">
                    {editData ? "Edit Supplier" : "Add New Supplier"}
                  </p>
                  <p className="sf-modal-subtitle">
                    {editData
                      ? "Update supplier information"
                      : "Fill in the details to add a supplier"}
                  </p>
                </div>
              </div>
              <button
                className="sf-close-btn"
                data-bs-dismiss="modal"
                onClick={handleReset}
              >
                <i className="mdi mdi-close" />
              </button>
            </div>

            <form onSubmit={SaveSupplier}>
              <div className="modal-body">
                <p className="sf-section-label">Supplier Information</p>
                <div className="row g-3">
                  {fields.map(
                    ({ label, field, type, icon, hint, required }) => (
                      <div className="col-sm-6 col-12" key={field}>
                        <label className="sf-label">
                          {label}
                          {required && (
                            <span className="sf-required">required</span>
                          )}
                        </label>
                        <div className="sf-input-wrap">
                          <i className={`mdi ${icon} sf-input-icon`} />
                          <input
                            className="sf-input"
                            type={type}
                            value={value[field]}
                            onChange={handleChange(field)}
                            placeholder={hint}
                            required={required}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* ── Footer ── */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="sf-reset-btn"
                  onClick={handleReset}
                >
                  <i className="mdi mdi-refresh" />
                  Reset
                </button>
                <button type="submit" className="sf-submit-btn">
                  <i
                    className={`mdi ${editData ? "mdi-content-save-outline" : "mdi-plus-circle-outline"}`}
                  />
                  {editData ? "Update Supplier" : "Add Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplierForm;
