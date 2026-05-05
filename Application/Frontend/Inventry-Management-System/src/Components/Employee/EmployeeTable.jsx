import { useState } from "react";
import EmployeeHook from "../../hook/EmployeeHook.jsx";
import EmployeeForm from "./EmployeeForm.jsx";
import { deleteEmployee } from "../../api/EmployeeApi.js";
import { toast } from "react-toastify";

const EmployeeTable = () => {
    function formatDate(dateStr) {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        const day = String(date.getUTCDate()).padStart(2, "0");
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        return `${day} ${month} ${year}`;
    }

    const { employees, loadEmployees } = EmployeeHook();
    const [editData, setEditData] = useState(null);
    // 🆕 viewData: jis employee ka View button click ho us ki details store karta hai
    const [viewData, setViewData] = useState(null);

    function handleDelete(id) {
        let confirmToastId;
        confirmToastId = toast(
            ({ closeToast }) => (
                <div>
                    <div className="fw-semibold">Delete this employee?</div>
                    <div className="d-flex gap-2 mt-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={async () => {
                                closeToast();
                                try {
                                    await deleteEmployee(id);
                                    loadEmployees();
                                    toast.dismiss(confirmToastId);
                                    toast.success("Employee deleted successfully");
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
            }
        );
    }

    function handleEdit(emp) {
        setEditData(emp);
        const modal = new window.bootstrap.Modal(document.getElementById("modal8"));
        modal.show();
    }

    // 🆕 handleView: viewData mein employee set karta hai aur view modal kholata hai
    function handleView(emp) {
        setViewData(emp);
        const modal = new window.bootstrap.Modal(document.getElementById("modalView"));
        modal.show();
    }

    return (
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Employees</h4>
                        <button type="button" className="btn btn-primary btn-sm ms-2"
                            data-bs-toggle="modal" data-bs-target="#modal8"
                            onClick={() => setEditData(null)}>
                            Add Employee
                        </button>
                    </div>

                    <EmployeeForm
                        onSaved={loadEmployees}
                        editData={editData}
                        onClearEdit={() => setEditData(null)}
                    />

                    {/* 🆕 View Modal — employee ki saari details show karta hai */}
                    <div className="modal fade" id="modalView">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Employee Details</h5>
                                    <button type="button" className="btn btn-sm btn-label-danger btn-icon"
                                        data-bs-dismiss="modal">
                                        <i className="mdi mdi-close"></i>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {viewData && (
                                        <div className="row g-3">
                                            {/* 🆕 col-6 grid — 2 columns mein details neatly dikhata hai */}
                                            <div className="col-6">
                                                <small className="text-muted">Name</small>
                                                <p className="fw-semibold">{viewData.Name || "-"}</p>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Email</small>
                                                <p className="fw-semibold">{viewData.email || "-"}</p>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Phone</small>
                                                <p className="fw-semibold">{viewData.phone || "-"}</p>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">CNIC</small>
                                                <p className="fw-semibold">{viewData.cnic || "-"}</p>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Date of Birth</small>
                                                <p className="fw-semibold">{formatDate(viewData.dateofBirth)}</p>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Date of Joining</small>
                                                <p className="fw-semibold">{formatDate(viewData.dateOfJoining)}</p>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Gender</small>
                                                <p className="fw-semibold">{viewData.gender || "-"}</p>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Department</small>
                                                <p className="fw-semibold">{viewData.department || "-"}</p>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Designation</small>
                                                <p className="fw-semibold">{viewData.designation || "-"}</p>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Salary</small>
                                                <p className="fw-semibold">{Number(viewData.salary).toLocaleString()}</p>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Status</small>
                                                <p className="fw-semibold">{viewData.status || "-"}</p>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Shift</small>
                                                <p className="fw-semibold">{viewData.shift || "-"}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-secondary"
                                        data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <table className="table table-hover table-bordered table-striped dt-responsive nowrap"
                            style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp._id}>
                                        <td>{emp.Name}</td>
                                        <td>{emp.department || "-"}</td>
                                        {/* 🆕 designation column add kiya — model mein field exist karti hai */}
                                        <td>{emp.designation || "-"}</td>
                                        <td>{emp.status}</td>
                                        <td>
                                            {/* 🆕 Icons use kiye — text buttons ki jagah */}
                                            <button className="btn btn-sm btn-info me-1"
                                                title="View"
                                                onClick={() => handleView(emp)}>
                                                <i className="mdi mdi-eye"></i>
                                            </button>
                                            <button className="btn btn-sm btn-warning me-1"
                                                title="Edit"
                                                onClick={() => handleEdit(emp)}>
                                                <i className="mdi mdi-pencil"></i>
                                            </button>
                                            <button className="btn btn-sm btn-danger"
                                                title="Delete"
                                                onClick={() => handleDelete(emp._id)}>
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

export default EmployeeTable;