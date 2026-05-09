import { useState } from "react";
import UserHook from "../../Hook/UserHook.jsx";
import toast from "react-hot-toast";

const emptyForm = { Name: "", email: "", password: "", role: "user" };

export default function UserTable() {
  const { users, loading, createUser, editUser, removeUser } = UserHook();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // user id to delete
  const [search, setSearch] = useState("");

  // Created by — admin ka naam
  const createdBy =
    localStorage.getItem("userName") ||
    localStorage.getItem("userEmail") ||
    "Admin";

  function openCreate() {
    setForm(emptyForm);
    setEditMode(false);
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(user) {
    setForm({
      Name: user.Name || user.name || "",
      email: user.email || "",
      password: "", // password edit mein blank rahega
      role: user.role || "user",
    });
    setEditMode(true);
    setEditId(user._id);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setForm(emptyForm);
    setEditMode(false);
    setEditId(null);
  }

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.Name.trim()) return toast.error("Name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!editMode && !form.password.trim())
      return toast.error("Password is required");

    setSubmitting(true);
    try {
      const payload = {
        Name: form.Name.trim(),
        email: form.email.trim(),
        role: form.role,
        createdBy, // track karo kaun ne banaya
      };
      if (form.password.trim()) payload.password = form.password.trim();

      if (editMode) {
        await editUser(editId, payload);
        toast.success("User updated successfully!");
      } else {
        await createUser(payload);
        toast.success(`User "${form.Name}" created! They can now login.`);
      }
      closeModal();
    } catch (err) {
      toast.error(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await removeUser(id);
      toast.success("User deleted!");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  }

  const filtered = users.filter(
    (u) =>
      (u.Name || u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  const getRoleBadge = (role) => {
    const r = (role || "").toLowerCase();
    if (r === "admin" || r === "administrator")
      return <span className="badge bg-danger">Admin</span>;
    return <span className="badge bg-primary">Employee</span>;
  };

  return (
    <div>
      {/* Header */}
      <div className="row mb-3 align-items-center">
        <div className="col">
          <h4 className="mb-0">
            <i className="mdi mdi-account-group me-2"></i>Users Management
          </h4>
          <small className="text-muted">
            Create users with login credentials — they can access the system
            after creation
          </small>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={openCreate}>
            <i className="mdi mdi-account-plus me-1"></i>Create User
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2 text-muted">Loading users...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="mdi mdi-account-off fs-1 d-block mb-2"></i>
              {search
                ? "No users match your search."
                : "No users yet. Create one above!"}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, i) => (
                    <tr key={user._id}>
                      <td>{i + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{
                              width: 36,
                              height: 36,
                              fontSize: 14,
                              background: `hsl(${((user.Name || user.name || "U").charCodeAt(0) * 37) % 360}, 55%, 50%)`,
                              flexShrink: 0,
                            }}
                          >
                            {(user.Name || user.name || "U")[0].toUpperCase()}
                          </div>
                          <span className="fw-medium">
                            {user.Name || user.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-muted">{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>
                        <small className="text-muted">
                          <i className="mdi mdi-account-check me-1 text-success"></i>
                          {user.createdBy || "Admin"}
                        </small>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => openEdit(user)}
                          title="Edit"
                        >
                          <i className="mdi mdi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setDeleteConfirm(user._id)}
                          title="Delete"
                        >
                          <i className="mdi mdi-delete"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="card modal-card-custom">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <i
                  className={`mdi ${editMode ? "mdi-account-edit" : "mdi-account-plus"} me-2`}
                ></i>
                {editMode ? "Edit User" : "Create New User"}
              </h5>
              <button
                type="button"
                className="btn btn-sm btn-light"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            {!editMode && (
              <div
                className="alert alert-info py-2 mb-3"
                style={{ fontSize: "0.85rem" }}
              >
                <i className="mdi mdi-information me-1"></i>
                This user will be saved to the database and can login with these
                credentials. Created by: <strong>{createdBy}</strong>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  name="Name"
                  type="text"
                  className="form-control"
                  placeholder="Enter full name"
                  value={form.Name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Password{" "}
                  {editMode ? (
                    <small className="text-muted">
                      (leave blank to keep current)
                    </small>
                  ) : (
                    <span className="text-danger">*</span>
                  )}
                </label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder={
                    editMode
                      ? "Leave blank to keep current password"
                      : "Set login password"
                  }
                  value={form.password}
                  onChange={handleChange}
                  required={!editMode}
                />
              </div>
              <div className="mb-4">
                <label className="form-label">
                  Role <span className="text-danger">*</span>
                </label>
                <select
                  name="role"
                  className="form-select"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="user">👷 Employee</option>
                  <option value="admin">🛡️ Admin</option>
                </select>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" />
                      {editMode ? "Updating..." : "Creating..."}
                    </span>
                  ) : editMode ? (
                    "Update User"
                  ) : (
                    "Create User"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="modal-backdrop-custom">
          <div className="card modal-card-custom" style={{ maxWidth: 380 }}>
            <div className="text-center py-2">
              <div style={{ fontSize: "3rem" }}>🗑️</div>
              <h5 className="mt-2">Delete User?</h5>
              <p className="text-muted">
                This user will be permanently deleted and will no longer be able
                to login.
              </p>
            </div>
            <div className="d-flex gap-2 mt-2">
              <button
                className="btn btn-danger w-100"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-backdrop-custom {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1055;
          padding: 1rem;
        }
        .modal-card-custom {
          width: 100%;
          max-width: 480px;
          padding: 1.75rem;
          border-radius: 1rem;
          background: #fff;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          animation: modalIn 0.2s ease-out;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
