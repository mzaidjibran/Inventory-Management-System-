import { useState } from "react";
import UserHook from "../../hook/UserHook.jsx";
import UserForm from "./UserForm.jsx";
import { deleteUser } from "../../api/UserApi.js";
import toast from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast.js";

const UserTable = () => {
  const { users, loadUser } = UserHook();
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  function handleDelete(id) {
    confirmToast("Delete this user?", async () => {
      try {
        await deleteUser(id);
        loadUser();
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error("Delete failed: " + err.message);
      }
    });
  }

  function handleEdit(dept) {
    setEditData(dept);
    const modal = new window.bootstrap.Modal(
      document.getElementById("modalDeptForm"),
    );
    modal.show();
  }

  function handleView(dept) {
    setViewData(dept);
    const modal = new window.bootstrap.Modal(
      document.getElementById("modalDeptView"),
    );
    modal.show();
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Users</h4>
            <button
              type="button"
              className="btn btn-primary btn-sm ms-2"
              data-bs-toggle="modal"
              data-bs-target="#modalDeptForm"
              onClick={() => setEditData(null)}
            >
              Add User
            </button>
          </div>

          <UserForm
            onSaved={loadUser}
            editData={editData}
            onClearEdit={() => setEditData(null)}
          />

          {/* View Modal */}
          <div className="modal fade" id="modalDeptView">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">User Details</h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-label-danger btn-icon"
                    data-bs-dismiss="modal"
                  >
                    <i className="mdi mdi-close"></i>
                  </button>
                </div>
                <div className="modal-body">
                  {viewData && (
                    <div className="row g-3">
                      <div className="col-6">
                        <small className="text-muted">User Name</small>
                        <p className="fw-semibold">
                          {viewData.User_Name || "-"}
                        </p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Email</small>
                        <p className="fw-semibold">{viewData.email || "-"}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Role</small>
                        <p className="fw-semibold">
                          <span className="badge bg-info">
                            {viewData.role || "employee"}
                          </span>
                        </p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Created At</small>
                        <p className="fw-semibold">
                          {viewData.createdAt
                            ? new Date(viewData.createdAt).toLocaleDateString(
                                "en-GB",
                              )
                            : "-"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card-body">
            <table
              className="table table-hover table-bordered table-striped dt-responsive nowrap"
              style={{
                borderCollapse: "collapse",
                borderSpacing: 0,
                width: "100%",
              }}
            >
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((use) => (
                    <tr key={use._id}>
                      <td>{use.User_Name}</td>
                      <td>{use.email}</td>
                      <td>
                        <span className="badge bg-info">
                          {use.role || "employee"}
                        </span>
                      </td>
                      <td>
                        {use.createdAt
                          ? new Date(use.createdAt).toLocaleDateString("en-GB")
                          : "-"}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-1"
                          title="View"
                          onClick={() => handleView(use)}
                        >
                          <i className="mdi mdi-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-1"
                          title="Edit"
                          onClick={() => handleEdit(use)}
                        >
                          <i className="mdi mdi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          title="Delete"
                          onClick={() => handleDelete(use._id)}
                        >
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

export default UserTable;
