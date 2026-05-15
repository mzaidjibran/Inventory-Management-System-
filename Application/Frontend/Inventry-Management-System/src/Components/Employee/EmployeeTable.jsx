import { useState } from "react";
import EmployeeHook from "../../hook/EmployeeHook.jsx";
import EmployeeForm from "./EmployeeForm.jsx";
import { deleteEmployee } from "../../api/EmployeeApi.js";
import toast from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast.js";

const EmployeeTable = () => {
  function formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${day} ${month} ${year}`;
  }

  const { employees, loadEmployees } = EmployeeHook();
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  function handleDelete(id) {
    confirmToast("Delete this employee?", async () => {
      try {
        await deleteEmployee(id);
        loadEmployees();
        toast.success("Employee deleted successfully");
      } catch (err) {
        toast.error("Delete failed: " + err.message);
      }
    });
  }

  function handleEdit(emp) {
    setEditData(emp);
    const modal = new window.bootstrap.Modal(document.getElementById("modal8"));
    modal.show();
  }

  function handleView(emp) {
    setViewData(emp);
    const modal = new window.bootstrap.Modal(
      document.getElementById("modalView"),
    );
    modal.show();
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .emp-wrap { font-family: 'Nunito', sans-serif; }

        /* ── Card ── */
        .emp-card {
          background: #fffdf9;
          border: 1px solid #e8dcc8;
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(139,101,50,0.08);
          overflow: hidden;
        }

        /* ── Card Header ── */
        .emp-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          border-bottom: 1px solid #f0e4d0;
        }
        .emp-card-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .emp-header-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #c8965a, #a0733a);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .emp-card-title {
          font-size: 15px;
          font-weight: 800;
          color: #3d2a10;
          margin: 0;
          letter-spacing: 0.2px;
        }
        .emp-count-badge {
          background: #f3e5d8;
          color: #c8965a;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 9px;
          border-radius: 20px;
          margin-left: 6px;
        }
        .emp-add-btn {
          display: flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg, #c8965a, #a0733a);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 12.5px;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          transition: opacity 0.18s, transform 0.15s;
        }
        .emp-add-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        /* ── Table ── */
        .emp-table-wrap { overflow-x: auto; }
        .emp-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Nunito', sans-serif;
        }
        .emp-table thead tr {
          background: linear-gradient(135deg, #3d2a10, #5c3d11);
        }
        .emp-table thead th {
          padding: 12px 16px;
          font-size: 11px;
          font-weight: 800;
          color: #f5e6cc;
          letter-spacing: 0.9px;
          text-transform: uppercase;
          border: none;
          white-space: nowrap;
        }
        .emp-table tbody tr {
          border-bottom: 1px solid #f0e4d0;
          transition: background 0.15s;
        }
        .emp-table tbody tr:hover { background: #fef6ea; }
        .emp-table tbody td {
          padding: 11px 16px;
          font-size: 13px;
          color: #7a5c38;
          font-weight: 600;
          border: none;
          vertical-align: middle;
        }
        .emp-table tbody tr:last-child { border-bottom: none; }

        /* ── Status badge ── */
        .status-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
        }
        .status-active   { background: #e8f5e9; color: #2e7d32; }
        .status-inactive { background: #fdecea; color: #c62828; }
        .status-default  { background: #f3e5d8; color: #7a4a14; }

        /* ── Action buttons ── */
        .act-btn {
          width: 30px; height: 30px;
          border-radius: 8px;
          border: none;
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 13px;
          transition: opacity 0.15s, transform 0.13s;
          margin-right: 4px;
        }
        .act-btn:last-child { margin-right: 0; }
        .act-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .act-view   { background: #e3f0ff; color: #1565c0; }
        .act-edit   { background: #fff8e1; color: #e65100; }
        .act-delete { background: #fdecea; color: #c62828; }

        /* ── Empty state ── */
        .emp-empty {
          text-align: center;
          padding: 40px 20px;
          color: #b89060;
          font-family: 'Nunito', sans-serif;
        }
        .emp-empty i { font-size: 36px; opacity: 0.4; display: block; margin-bottom: 8px; }
        .emp-empty p { font-size: 13px; font-weight: 600; margin: 0; }

        /* ── View Modal ── */
        .emp-modal .modal-content {
          border: 1px solid #e8dcc8;
          border-radius: 16px;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
          box-shadow: 0 8px 32px rgba(139,101,50,0.12);
        }
        .emp-modal .modal-header {
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          border-bottom: 1px solid #f0e4d0;
          padding: 16px 22px;
        }
        .emp-modal .modal-title {
          font-size: 15px;
          font-weight: 800;
          color: #3d2a10;
          display: flex; align-items: center; gap: 10px;
        }
        .emp-modal .modal-title-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #c8965a, #a0733a);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }
        .emp-modal .modal-body {
          background: #fffdf9;
          padding: 22px;
        }
        .emp-modal .modal-footer {
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          border-top: 1px solid #f0e4d0;
          padding: 12px 22px;
        }

        /* View modal profile */
        .emp-profile-img {
          width: 90px; height: 90px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #e8dcc8;
          box-shadow: 0 4px 12px rgba(139,101,50,0.12);
        }
        .emp-profile-placeholder {
          width: 90px; height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5ddb8, #eac990);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto;
          box-shadow: 0 4px 12px rgba(139,101,50,0.12);
        }

        /* View detail field */
        .detail-field {
          background: linear-gradient(135deg, #fffdf9, #fef6ea);
          border: 1px solid #f0e4d0;
          border-radius: 10px;
          padding: 10px 14px;
        }
        .detail-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #c8a87a;
          margin: 0 0 3px;
        }
        .detail-value {
          font-size: 13.5px;
          font-weight: 700;
          color: #3d2a10;
          margin: 0;
        }

        /* close btn */
        .emp-close-btn {
          background: #fdecea;
          color: #c62828;
          border: none;
          border-radius: 8px;
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 14px;
          transition: opacity 0.15s;
        }
        .emp-close-btn:hover { opacity: 0.8; }
        .emp-dismiss-btn {
          background: #f3e5d8;
          color: #7a4a14;
          border: none;
          border-radius: 10px;
          padding: 8px 18px;
          font-size: 12.5px;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .emp-dismiss-btn:hover { opacity: 0.8; }
      `}</style>

      <div className="row emp-wrap">
        <div className="col-12">
          <div className="emp-card">
            {/* ── Header ── */}
            <div className="emp-card-header">
              <div className="emp-card-header-left">
                <div className="emp-header-icon">
                  <i
                    className="mdi mdi-account-group"
                    style={{ color: "#fff", fontSize: 17 }}
                  />
                </div>
                <div>
                  <h4 className="emp-card-title">
                    Employees
                    <span className="emp-count-badge">{employees.length}</span>
                  </h4>
                </div>
              </div>
              <button
                className="emp-add-btn"
                data-bs-toggle="modal"
                data-bs-target="#modal8"
                onClick={() => setEditData(null)}
              >
                <i className="mdi mdi-plus" style={{ fontSize: 15 }} />
                Add Employee
              </button>
            </div>

            {/* ── Form Modal ── */}
            <EmployeeForm
              key={editData?._id || "new-employee"}
              onSaved={loadEmployees}
              editData={editData}
              onClearEdit={() => setEditData(null)}
            />

            {/* ── View Modal ── */}
            <div className="modal fade emp-modal" id="modalView">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      <div className="modal-title-icon">
                        <i
                          className="mdi mdi-account"
                          style={{ color: "#fff", fontSize: 15 }}
                        />
                      </div>
                      Employee Details
                    </h5>
                    <button className="emp-close-btn" data-bs-dismiss="modal">
                      <i className="mdi mdi-close" />
                    </button>
                  </div>

                  <div className="modal-body">
                    {viewData && (
                      <>
                        {/* Profile pic */}
                        <div style={{ textAlign: "center", marginBottom: 22 }}>
                          {viewData.profileImage ? (
                            <img
                              src={`http://127.0.0.1:3000${viewData.profileImage}`}
                              alt={viewData.Name || "Employee"}
                              className="emp-profile-img"
                            />
                          ) : (
                            <div className="emp-profile-placeholder">
                              <i
                                className="mdi mdi-account"
                                style={{ fontSize: 36, color: "#c8965a" }}
                              />
                            </div>
                          )}
                          <p
                            style={{
                              marginTop: 10,
                              marginBottom: 0,
                              fontSize: 16,
                              fontWeight: 800,
                              color: "#3d2a10",
                            }}
                          >
                            {viewData.Name || "—"}
                          </p>
                          <span
                            className={`status-badge mt-1 ${
                              viewData.status === "active"
                                ? "status-active"
                                : viewData.status === "inactive"
                                  ? "status-inactive"
                                  : "status-default"
                            }`}
                          >
                            {viewData.status || "—"}
                          </span>
                        </div>

                        {/* Detail fields */}
                        <div className="row g-3">
                          {[
                            { label: "Email", value: viewData.email || "—" },
                            { label: "Phone", value: viewData.phone || "—" },
                            { label: "CNIC", value: viewData.cnic || "—" },
                            { label: "Gender", value: viewData.gender || "—" },
                            {
                              label: "Salary",
                              value: `Rs ${Number(viewData.salary || 0).toLocaleString()}`,
                            },
                            {
                              label: "Date of Birth",
                              value: formatDate(viewData.dateofBirth),
                            },
                            {
                              label: "Date of Joining",
                              value: formatDate(viewData.dateOfJoining),
                            },
                            {
                              label: "Created At",
                              value: formatDate(viewData.createdAt),
                            },
                          ].map((f) => (
                            <div className="col-sm-6 col-12" key={f.label}>
                              <div className="detail-field">
                                <p className="detail-label">{f.label}</p>
                                <p className="detail-value">{f.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button className="emp-dismiss-btn" data-bs-dismiss="modal">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Table ── */}
            <div className="emp-table-wrap">
              <table className="emp-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>CNIC</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="emp-empty">
                          <i className="mdi mdi-account-group-outline" />
                          <p>No employees found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp, idx) => (
                      <tr key={emp._id}>
                        <td
                          style={{
                            color: "#c8a87a",
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 9,
                            }}
                          >
                            {/* Avatar initials */}
                            <div
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg,#f5ddb8,#eac990)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 800,
                                color: "#7a4a14",
                                flexShrink: 0,
                              }}
                            >
                              {(emp.Name || "?")[0].toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 700, color: "#3d2a10" }}>
                              {emp.Name}
                            </span>
                          </div>
                        </td>
                        <td>{emp.email || "—"}</td>
                        <td>{emp.phone || "—"}</td>
                        <td
                          style={{
                            fontFamily: "monospace",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {emp.cnic || "—"}
                        </td>
                        <td style={{ fontWeight: 700, color: "#5c3d11" }}>
                          Rs {Number(emp.salary || 0).toLocaleString()}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              emp.status === "active"
                                ? "status-active"
                                : emp.status === "inactive"
                                  ? "status-inactive"
                                  : "status-default"
                            }`}
                          >
                            {emp.status || "—"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="act-btn act-view"
                            title="View"
                            onClick={() => handleView(emp)}
                          >
                            <i className="mdi mdi-eye" />
                          </button>
                          <button
                            className="act-btn act-edit"
                            title="Edit"
                            onClick={() => handleEdit(emp)}
                          >
                            <i className="mdi mdi-pencil" />
                          </button>
                          <button
                            className="act-btn act-delete"
                            title="Delete"
                            onClick={() => handleDelete(emp._id)}
                          >
                            <i className="mdi mdi-delete" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeTable;
