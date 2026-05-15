import { useState } from "react";
import createEmployee from "../../api/EmployeeApi.js";
import toast from "react-hot-toast";

const API_BASE = "http://127.0.0.1:3000";

const EMPTY_EMPLOYEE_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  cnic: "",
  dateofBirth: "",
  gender: "",
  dateOfJoining: "",
  salary: "",
  status: "",
};

function buildInitialValue(editData) {
  if (!editData) return { ...EMPTY_EMPLOYEE_FORM };
  return {
    firstName: editData.firstName || "",
    lastName: editData.lastName || "",
    email: editData.email || "",
    phone: editData.phone || "",
    cnic: editData.cnic || "",
    dateofBirth: editData.dateofBirth ? editData.dateofBirth.slice(0, 10) : "",
    gender: editData.gender || "",
    dateOfJoining: editData.dateOfJoining
      ? editData.dateOfJoining.slice(0, 10)
      : "",
    salary: editData.salary || "",
    status: editData.status || "",
  };
}

const EmployeeForm = ({ onSaved, editData, onClearEdit }) => {
  const [value, updateValue] = useState(() => buildInitialValue(editData));
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(() =>
    editData?.profileImage ? `${API_BASE}${editData.profileImage}` : "",
  );

  function handleChange(field) {
    return (e) => updateValue((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(
        editData?.profileImage ? `${API_BASE}${editData.profileImage}` : "",
      );
    }
  }

  async function SaveEmployee(e) {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(value).forEach(([key, currentValue]) => {
        if (
          currentValue !== "" &&
          currentValue !== null &&
          currentValue !== undefined
        ) {
          payload.append(key, currentValue);
        }
      });
      if (selectedImage) payload.append("profileImage", selectedImage);

      if (editData) {
        const { updateEmployee } = await import("../../api/EmployeeApi.js");
        await updateEmployee(editData._id, payload);
        toast.success("Employee updated successfully");
      } else {
        await createEmployee(payload);
        toast.success("Employee added successfully");
      }
      updateValue({ ...EMPTY_EMPLOYEE_FORM });
      setSelectedImage(null);
      setImagePreview("");
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
    updateValue({ ...EMPTY_EMPLOYEE_FORM });
    setSelectedImage(null);
    setImagePreview("");
    onClearEdit && onClearEdit();
  }

  const fields = [
    {
      label: "First Name",
      field: "firstName",
      type: "text",
      icon: "mdi-account-outline",
      hint: "Enter first name",
    },
    {
      label: "Last Name",
      field: "lastName",
      type: "text",
      icon: "mdi-account-outline",
      hint: "Enter last name",
    },
    {
      label: "Email",
      field: "email",
      type: "email",
      icon: "mdi-email-outline",
      hint: "Enter email address",
    },
    {
      label: "Mobile Number",
      field: "phone",
      type: "text",
      icon: "mdi-phone-outline",
      hint: "e.g. 0312-3456789",
    },
    {
      label: "CNIC",
      field: "cnic",
      type: "text",
      icon: "mdi-card-account-details-outline",
      hint: "e.g. 42101-1234567-1",
    },
    {
      label: "Date of Birth",
      field: "dateofBirth",
      type: "date",
      icon: "mdi-calendar-outline",
      hint: "Select date of birth",
    },
    {
      label: "Date of Joining",
      field: "dateOfJoining",
      type: "date",
      icon: "mdi-calendar-check-outline",
      hint: "Select joining date",
    },
    {
      label: "Salary",
      field: "salary",
      type: "number",
      icon: "mdi-cash-outline",
      hint: "Enter monthly salary",
    },
  ];

  return (
    <>
      <style>{`
        .ef-modal .modal-content {
          border: 1px solid #e8dcc8;
          border-radius: 18px;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
          box-shadow: 0 12px 40px rgba(139,101,50,0.14);
        }

        /* header */
        .ef-modal .modal-header {
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          border-bottom: 1px solid #f0e4d0;
          padding: 16px 22px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ef-header-left { display: flex; align-items: center; gap: 12px; }
        .ef-header-icon {
          width: 38px; height: 38px; border-radius: 11px;
          background: linear-gradient(135deg, #c8965a, #a0733a);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ef-header-icon i { color: #fff; font-size: 18px; }
        .ef-modal-title {
          font-size: 15px; font-weight: 800; color: #3d2a10; margin: 0;
        }
        .ef-modal-subtitle {
          font-size: 11px; color: #b89060; font-weight: 600; margin: 0;
        }
        .ef-close-btn {
          width: 30px; height: 30px; border-radius: 8px;
          background: #fdecea; color: #c62828;
          border: none; display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 15px; transition: opacity 0.15s;
        }
        .ef-close-btn:hover { opacity: 0.8; }

        /* body */
        .ef-modal .modal-body {
          background: #fffdf9;
          padding: 22px 22px 10px;
        }

        /* section divider */
        .ef-section-label {
          font-size: 10px; font-weight: 800; letter-spacing: 1.2px;
          text-transform: uppercase; color: #c8a87a;
          margin: 0 0 14px; padding: 0;
          display: flex; align-items: center; gap: 8px;
        }
        .ef-section-label::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, #e8dcc8, transparent);
        }

        /* form field */
        .ef-field { margin-bottom: 4px; }
        .ef-label {
          font-size: 11.5px; font-weight: 700; color: #7a5c38;
          margin-bottom: 5px; display: block;
          font-family: 'Nunito', sans-serif;
        }
        .ef-input-wrap {
          position: relative; display: flex; align-items: center;
        }
        .ef-input-icon {
          position: absolute; left: 11px;
          color: #c8a87a; font-size: 16px; pointer-events: none; z-index: 1;
        }
        .ef-input {
          width: 100%;
          padding: 9px 12px 9px 36px;
          border: 1px solid #e8dcc8;
          border-radius: 10px;
          background: #fffdf9;
          font-size: 13px; font-weight: 600; color: #3d2a10;
          font-family: 'Nunito', sans-serif;
          transition: border-color 0.18s, box-shadow 0.18s;
          outline: none;
        }
        .ef-input:focus {
          border-color: #c8965a;
          box-shadow: 0 0 0 3px rgba(200,150,90,0.12);
          background: #fffdf9;
        }
        .ef-input::placeholder { color: #d4b896; font-weight: 500; }

        /* select */
        .ef-select {
          width: 100%;
          padding: 9px 12px 9px 36px;
          border: 1px solid #e8dcc8;
          border-radius: 10px;
          background: #fffdf9;
          font-size: 13px; font-weight: 600; color: #3d2a10;
          font-family: 'Nunito', sans-serif;
          transition: border-color 0.18s, box-shadow 0.18s;
          outline: none;
          appearance: none;
          cursor: pointer;
        }
        .ef-select:focus {
          border-color: #c8965a;
          box-shadow: 0 0 0 3px rgba(200,150,90,0.12);
        }
        .ef-select-arrow {
          position: absolute; right: 11px;
          color: #c8a87a; font-size: 14px; pointer-events: none;
        }

        /* hint text */
        .ef-hint {
          font-size: 10.5px; color: #c8a87a; font-weight: 600;
          margin-top: 4px; font-family: 'Nunito', sans-serif;
        }

        /* file input */
        .ef-file-label {
          display: flex; align-items: center; gap: 8px;
          border: 1.5px dashed #e0ccb0; border-radius: 10px;
          padding: 10px 14px; cursor: pointer;
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          transition: border-color 0.18s;
        }
        .ef-file-label:hover { border-color: #c8965a; }
        .ef-file-label i { color: #c8965a; font-size: 20px; }
        .ef-file-text { font-size: 12px; font-weight: 600; color: #7a5c38; }
        .ef-file-sub  { font-size: 10.5px; color: #c8a87a; }
        .ef-file-input { display: none; }

        /* image preview */
        .ef-img-preview {
          width: 70px; height: 70px; border-radius: 10px;
          object-fit: cover; border: 2px solid #e8dcc8;
          box-shadow: 0 3px 10px rgba(139,101,50,0.1);
          margin-top: 10px;
        }

        /* footer */
        .ef-modal .modal-footer {
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          border-top: 1px solid #f0e4d0;
          padding: 14px 22px;
          display: flex; align-items: center; gap: 10px; justify-content: flex-end;
        }
        .ef-submit-btn {
          display: flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg, #c8965a, #a0733a);
          color: #fff; border: none; border-radius: 10px;
          padding: 9px 22px; font-size: 13px; font-weight: 700;
          font-family: 'Nunito', sans-serif; cursor: pointer;
          transition: opacity 0.18s, transform 0.15s;
        }
        .ef-submit-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .ef-reset-btn {
          display: flex; align-items: center; gap: 7px;
          background: #fdecea; color: #c62828;
          border: none; border-radius: 10px;
          padding: 9px 18px; font-size: 13px; font-weight: 700;
          font-family: 'Nunito', sans-serif; cursor: pointer;
          transition: opacity 0.18s;
        }
        .ef-reset-btn:hover { opacity: 0.8; }
      `}</style>

      <div className="modal fade ef-modal" id="modal8">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* ── Header ── */}
            <div className="modal-header">
              <div className="ef-header-left">
                <div className="ef-header-icon">
                  <i
                    className={`mdi ${editData ? "mdi-account-edit" : "mdi-account-plus"}`}
                  />
                </div>
                <div>
                  <p className="ef-modal-title">
                    {editData ? "Edit Employee" : "Add New Employee"}
                  </p>
                  <p className="ef-modal-subtitle">
                    {editData
                      ? "Update employee information"
                      : "Fill in the details to add an employee"}
                  </p>
                </div>
              </div>
              <button
                className="ef-close-btn"
                data-bs-dismiss="modal"
                onClick={handleReset}
              >
                <i className="mdi mdi-close" />
              </button>
            </div>

            <form onSubmit={SaveEmployee}>
              <div className="modal-body">
                {/* ── Personal Info ── */}
                <p className="ef-section-label">Personal Information</p>
                <div className="row g-3">
                  {fields
                    .slice(0, 5)
                    .map(({ label, field, type, icon, hint }) => (
                      <div className="col-sm-6 col-12 ef-field" key={field}>
                        <label className="ef-label">{label}</label>
                        <div className="ef-input-wrap">
                          <i className={`mdi ${icon} ef-input-icon`} />
                          <input
                            className="ef-input"
                            type={type}
                            placeholder={hint}
                            value={value[field]}
                            onChange={handleChange(field)}
                          />
                        </div>
                      </div>
                    ))}

                  {/* Gender */}
                  <div className="col-sm-6 col-12 ef-field">
                    <label className="ef-label">Gender</label>
                    <div className="ef-input-wrap">
                      <i className="mdi mdi-gender-male-female ef-input-icon" />
                      <select
                        className="ef-select"
                        value={value.gender}
                        onChange={handleChange("gender")}
                      >
                        <option value="">-- Select Gender --</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <i className="mdi mdi-chevron-down ef-select-arrow" />
                    </div>
                  </div>
                </div>

                {/* ── Employment Info ── */}
                <p className="ef-section-label" style={{ marginTop: 20 }}>
                  Employment Details
                </p>
                <div className="row g-3">
                  {fields
                    .slice(5, 8)
                    .map(({ label, field, type, icon, hint }) => (
                      <div className="col-sm-6 col-12 ef-field" key={field}>
                        <label className="ef-label">{label}</label>
                        <div className="ef-input-wrap">
                          <i className={`mdi ${icon} ef-input-icon`} />
                          <input
                            className="ef-input"
                            type={type}
                            placeholder={hint}
                            value={value[field]}
                            onChange={handleChange(field)}
                          />
                        </div>
                      </div>
                    ))}

                  {/* Status */}
                  <div className="col-sm-6 col-12 ef-field">
                    <label className="ef-label">Status</label>
                    <div className="ef-input-wrap">
                      <i className="mdi mdi-shield-account-outline ef-input-icon" />
                      <select
                        className="ef-select"
                        value={value.status}
                        onChange={handleChange("status")}
                      >
                        <option value="">-- Select Status --</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="terminated">Terminated</option>
                        <option value="leave">Leave</option>
                      </select>
                      <i className="mdi mdi-chevron-down ef-select-arrow" />
                    </div>
                  </div>
                </div>

                {/* ── Profile Image ── */}
                <p className="ef-section-label" style={{ marginTop: 20 }}>
                  Profile Photo
                </p>
                <div className="row g-3">
                  <div className="col-sm-6 col-12">
                    <label className="ef-file-label">
                      <i className="mdi mdi-cloud-upload-outline" />
                      <div>
                        <p className="ef-file-text">
                          {selectedImage
                            ? selectedImage.name
                            : "Click to upload photo"}
                        </p>
                        <p className="ef-file-sub">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        className="ef-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="ef-img-preview"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* ── Footer ── */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="ef-reset-btn"
                  onClick={handleReset}
                >
                  <i className="mdi mdi-refresh" />
                  Reset
                </button>
                <button type="submit" className="ef-submit-btn">
                  <i
                    className={`mdi ${editData ? "mdi-content-save-outline" : "mdi-plus-circle-outline"}`}
                  />
                  {editData ? "Update Employee" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeForm;
