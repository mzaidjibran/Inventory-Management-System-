import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyProfile,
  isLoggedIn,
  logOut,
  updateMyProfile,
  getUserRole,
  signUp,
} from "../Api/authApi.js";
import { getAllUsers, deleteUser } from "../Api/UserApi.js";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:3000";

const normalizeRole = (r) => {
  if (!r) return "User";
  const lower = String(r).toLowerCase();
  if (lower === "employee" || lower === "user") return "Employee";
  if (lower === "administrator" || lower === "admin" || lower === "manager")
    return "Administrator";
  return "User";
};

const Topbar = () => {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [calendarDate, setCalendarDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [profile, setProfile] = useState(() => {
    // Load cached profile from localStorage on initial mount
    if (isLoggedIn()) {
      return {
        Name: localStorage.getItem("userName") || "",
        email: localStorage.getItem("userEmail") || "",
        image: localStorage.getItem("userImage") || "",
      };
    }
    return { Name: "", email: "", image: "" };
  });
  const [uploading, setUploading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    Name: "",
    email: "",
    password: "",
  });
  const [existingUsers, setExistingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!isLoggedIn()) {
        if (active) {
          setProfile({ Name: "", email: "", image: "" });
        }
        return;
      }

      try {
        const response = await getMyProfile();
        if (active) {
          const userData = response.data || { Name: "", email: "", image: "" };
          setProfile(userData);
          // Update cache whenever profile is fetched
          localStorage.setItem(
            "userName",
            userData.Name || userData.name || "",
          );
          localStorage.setItem("userEmail", userData.email || "");
          localStorage.setItem("userImage", userData.image || "");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const avatarSrc = profile.image
    ? `${API_BASE}${profile.image}`
    : "assets/images/users/avatar-6.png";

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed: " + error.message);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userImage");
      navigate("/signin");
    }
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      const response = await updateMyProfile(formData);
      const userData = response.data || profile;
      setProfile(userData);
      // Cache updated profile data
      localStorage.setItem("userImage", userData.image || "");
      toast.success("Profile image updated");
    } catch (error) {
      console.error("Profile image update failed:", error);
      toast.error(error.message || "Failed to update profile image");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const isAdmin = () => {
    const r = getNormalizedRole();
    return r === "admin";
  };

  const openCreateUser = () => setCreateOpen(true);
  const closeCreateUser = () => setCreateOpen(false);

  useEffect(() => {
    let active = true;
    const loadUsers = async () => {
      if (!isLoggedIn()) return;
      setLoadingUsers(true);
      try {
        const res = await getAllUsers();
        if (!active) return;
        setExistingUsers(res.data || []);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        if (active) setLoadingUsers(false);
      }
    };

    if (createOpen) loadUsers();
    return () => {
      active = false;
    };
  }, [createOpen]);

  const handleCreateChange = (e) => {
    setCreateForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp({
        Name: createForm.Name,
        email: createForm.email,
        password: createForm.password,
      });
      toast.success(
        "User created successfully. Share credentials with employee.",
      );
      closeCreateUser();
      setCreateForm({ Name: "", email: "", password: "" });
      // store approved email locally so only admin-provisioned emails can sign in
      try {
        const raw = localStorage.getItem("approvedUsers");
        const list = raw ? JSON.parse(raw) : [];
        if (!list.includes(createForm.email)) {
          list.push(createForm.email);
          localStorage.setItem("approvedUsers", JSON.stringify(list));
        }
      } catch (e) {
        console.error("Failed to update approvedUsers in localStorage:", e);
        localStorage.setItem(
          "approvedUsers",
          JSON.stringify([createForm.email]),
        );
      }
      // refresh list
      try {
        const res = await getAllUsers();
        setExistingUsers(res.data || []);
      } catch (err) {
        console.error("Failed to refresh users after create:", err);
      }
    } catch (err) {
      toast.error(err.message || "Failed to create user");
    }
  };

  const handleDeleteUser = async (id, email) => {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      // remove from existingUsers list
      setExistingUsers((prev) => prev.filter((u) => u._id !== id));
      // also remove from approvedUsers localStorage if present
      try {
        const raw = localStorage.getItem("approvedUsers");
        const list = raw ? JSON.parse(raw) : [];
        const newList = list.filter((e) => e !== email);
        localStorage.setItem("approvedUsers", JSON.stringify(newList));
      } catch (e) {
        console.error("Failed to update approvedUsers in localStorage:", e);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.message || "Failed to delete user");
    }
  };

  const getNormalizedRole = () => {
    const lower = String(getUserRole() || "").toLowerCase();
    if (lower === "administrator" || lower === "manager") return "admin";
    if (lower === "employee") return "user";
    return lower;
  };

  const getSearchRoutes = () => {
    const role = getNormalizedRole();
    const routes = [
      { label: "Dashboard", path: "/dashboard", roles: ["admin", "user"] },
      { label: "Billing", path: "/billing", roles: ["admin", "user"] },
      { label: "Products", path: "/product", roles: ["admin"] },
      { label: "Employee", path: "/employee", roles: ["admin"] },
      { label: "Supplier", path: "/supplier", roles: ["admin"] },
      { label: "Client", path: "/client", roles: ["admin"] },
      { label: "User", path: "/user", roles: ["admin"] },
    ];

    return routes.filter((route) => route.roles.includes(role));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = searchText.trim().toLowerCase();
    if (!query) {
      toast.error("Please type a page name");
      return;
    }

    const routes = getSearchRoutes();
    const matched = routes.find((route) => {
      const normalizedPath = route.path.replace("/", "");
      return (
        route.label.toLowerCase().includes(query) ||
        normalizedPath.includes(query)
      );
    });

    if (!matched) {
      toast.error("No matching page found");
      return;
    }

    navigate(matched.path);
  };

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="navbar-logo-box">
          <a href="index.html" className="logo logo-dark">
            <span className="logo-sm">
              <img
                src="assets/images/logo-sm.png"
                alt="logo-sm-dark"
                height="20"
              />
            </span>
            <span className="logo-lg">
              <img
                src="assets/images/mango_transparent.png"
                alt=""
                height="60"
              />
            </span>
          </a>

          <a href="index.html" className="logo logo-light">
            <span className="logo-sm">
              <img
                src="assets/images/logo-sm.png"
                alt="logo-sm-light"
                height="20"
              />
            </span>
            <span className="logo-lg">
              <img
                src="assets/images/logo-light.png"
                alt="logo-light"
                height="18"
              />
            </span>
          </a>
        </div>

        <div className="d-flex justify-content-between menu-sm px-3 ms-auto">
          <div className="d-flex align-items-center gap-2">
            {!isLoggedIn() ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm fs-14"
                  onClick={() => navigate("/signin")}
                >
                  <i className="mdi mdi-login align-middle me-1"></i>
                  Sign In
                </button>
                {/* Public Sign Up removed: accounts must be created by admin */}
              </>
            ) : null}
          </div>

          <div className="d-flex align-items-center gap-2">
            <form
              className="app-search d-none d-lg-block"
              onSubmit={handleSearchSubmit}
            >
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search pages..."
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  list="topbar-search-routes"
                />
                <span className="fab fa-sistrix fs-17 align-middle"></span>
                <datalist id="topbar-search-routes">
                  {getSearchRoutes().map((route) => (
                    <option key={route.path} value={route.label} />
                  ))}
                </datalist>
              </div>
            </form>

            <div className="dropdown d-inline-block activities">
              <button
                type="button"
                className="btn btn-sm top-icon"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="mdi mdi-calendar-month align-middle"></i>
              </button>
              <div
                className="dropdown-menu dropdown-menu-end p-3"
                style={{ minWidth: "260px" }}
              >
                <label className="form-label mb-2 fw-semibold">Calendar</label>
                <input
                  type="date"
                  className="form-control"
                  value={calendarDate}
                  onChange={(event) => setCalendarDate(event.target.value)}
                />
                <div className="small text-muted mt-2">
                  Selected: {calendarDate}
                </div>
              </div>
            </div>

            {isLoggedIn() ? (
              <div className="dropdown d-inline-block">
                <button
                  type="button"
                  className="btn btn-sm top-icon p-0"
                  id="page-header-user-dropdown"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img
                    className="rounded avatar-2xs p-0"
                    src={avatarSrc}
                    alt="Profile Avatar"
                  />
                </button>

                <div className="dropdown-menu dropdown-menu-wide dropdown-menu-end dropdown-menu-animated overflow-hidden py-0">
                  <div className="card border-0">
                    <div className="card-header bg-primary rounded-0">
                      <div className="rich-list-item w-100 p-0">
                        <div className="rich-list-prepend">
                          <div className="avatar avatar-label-light avatar-circle">
                            <div className="avatar-display">
                              <img
                                src={avatarSrc}
                                alt="Profile"
                                style={{
                                  width: 42,
                                  height: 42,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="rich-list-content">
                          <h3 className="rich-list-title text-white">
                            {profile.Name || "User"}
                          </h3>
                          <span className="rich-list-subtitle text-white">
                            {profile.email || ""}
                          </span>
                          <span
                            className="rich-list-subtitle text-white"
                            style={{ fontSize: "0.85rem" }}
                          >
                            Logged in as {normalizeRole(getUserRole())}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="card-body p-0">
                      <div className="px-3 py-3 d-grid gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={handleImageButtonClick}
                          disabled={uploading}
                        >
                          {uploading ? "Uploading..." : "Change Photo"}
                        </button>
                        {isAdmin() && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={openCreateUser}
                          >
                            Create User
                          </button>
                        )}
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={handleImageChange}
                        />
                        <div className="text-center">
                          <div className="fw-semibold">Profile</div>
                          <div className="text-muted small">
                            Update your profile picture from here.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer card-footer-bordered rounded-0">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="btn btn-label-danger"
                      >
                        <i className="mdi mdi-logout me-1"></i>
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {createOpen && (
        <div className="modal-backdrop-fixed">
          <div className="card p-3 create-user-modal" style={{ width: 360 }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Create User</h5>
              <button
                className="btn btn-sm btn-light"
                onClick={closeCreateUser}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input
                  name="Name"
                  className="form-control"
                  value={createForm.Name}
                  onChange={handleCreateChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  value={createForm.email}
                  onChange={handleCreateChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  value={createForm.password}
                  onChange={handleCreateChange}
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeCreateUser}
                >
                  Cancel
                </button>
              </div>
            </form>
            <div className="mt-3">
              <h6 className="mb-2">Existing Users</h6>
              {loadingUsers ? (
                <div className="small text-muted">Loading...</div>
              ) : existingUsers.length === 0 ? (
                <div className="small text-muted">No users found.</div>
              ) : (
                <div className="list-group list-group-flush">
                  {existingUsers.map((u) => (
                    <div
                      key={u._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-semibold">
                          {u.User_Name || u.Name || u.name || u.email}
                        </div>
                        <div className="small text-muted">{u.email}</div>
                      </div>
                      <div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteUser(u._id, u.email)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;