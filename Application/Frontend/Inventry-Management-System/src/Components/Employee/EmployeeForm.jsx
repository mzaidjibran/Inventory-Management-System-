import { useState, useEffect } from "react";
import createEmployee from "../../api/EmployeeApi.js";
import { toast } from "react-toastify";

const EmployeeForm = ({ onSaved, editData, onClearEdit }) => {
  const empty = {
    Name: "",
    email: "",
    phone: "",
    cnic: "",
    dateofBirth: "",
    gender: "",
    dateOfJoining: "",
    salary: "",
    status: "",
  };
  const [value, updateValue] = useState(empty);

  useEffect(() => {
    if (editData) {
      updateValue({
        Name: editData.Name || "",
        email: editData.email || "",
        phone: editData.phone || "",
        cnic: editData.cnic || "",
        dateofBirth: editData.dateofBirth
          ? editData.dateofBirth.slice(0, 10)
          : "",
        gender: editData.gender || "",
        dateOfJoining: editData.dateOfJoining
          ? editData.dateOfJoining.slice(0, 10)
          : "",
        salary: editData.salary || "",
        status: editData.status || "",
      });
    }
  }, [editData]);

  function handleChange(field) {
    return (e) => updateValue((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function SaveEmployee(e) {
    e.preventDefault();
    try {
      const payload = { ...value };

      if (editData) {
        const { updateEmployee } = await import("../../api/EmployeeApi.js");
        await updateEmployee(editData._id, payload);
        toast.success("Employee updated successfully");
      } else {
        await createEmployee(payload);
        toast.success("Employee added successfully");
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
              {editData ? "Edit Employee" : "Add Employee"}
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
          <form onSubmit={SaveEmployee}>
            <div className="modal-body">
              <div className="row g-3">
                {[
                  {
                    label: "Name",
                    field: "Name",
                    type: "text",
                    hint: "Enter your Name",
                  },
                  {
                    label: "Email",
                    field: "email",
                    type: "email",
                    hint: "Enter email",
                  },
                  {
                    label: "Mobile Number",
                    field: "phone",
                    type: "text",
                    hint: "Enter mobile number",
                  },
                  {
                    label: "CNIC",
                    field: "cnic",
                    type: "text",
                    hint: "Enter CNIC number",
                  },
                  {
                    label: "Date of Birth",
                    field: "dateofBirth",
                    type: "date",
                    hint: "Select date of birth",
                  },
                  {
                    label: "Date of Joining",
                    field: "dateOfJoining",
                    type: "date",
                    hint: "Select date of joining",
                  },
                  {
                    label: "Salary",
                    field: "salary",
                    type: "number",
                    hint: "Enter salary",
                  },
                ].map(({ label, field, type, hint }) => (
                  <div className="col-6" key={field}>
                    <label className="form-label">{label}</label>
                    <input
                      className="form-control"
                      type={type}
                      value={value[field]}
                      onChange={handleChange(field)}
                    />
                    <small className="form-text text-muted">{hint}</small>
                  </div>
                ))}

                <div className="col-6">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={value.gender}
                    onChange={handleChange("gender")}
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="rather_not_say">Rather Not Say</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={value.status}
                    onChange={handleChange("status")}
                  >
                    <option value="">-- Select Status --</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="terminated">Terminated</option>
                    <option value="leave">Leave</option>
                  </select>
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

export default EmployeeForm;
