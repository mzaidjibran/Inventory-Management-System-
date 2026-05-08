import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyProfile,
  isLoggedIn,
  logOut,
  updateMyProfile,
  getUserRole,
} from "../Api/authApi.js";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:3000";

const normalizeRole = (r) => {
  if (!r) return "User";
  const lower = String(r).toLowerCase();
  if (lower === "employee" || lower === "user") return "Employee";
  if (lower === "administrator" || lower === "admin" || lower === "manager") return "Administrator";
  return "User";
};

const Topbar = ({ onSidebarToggle }) => {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
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
                src="assets/images/logo-dark.png"
                alt="logo-dark"
                height="18"
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

          <button
            type="button"
            className="btn btn-sm top-icon sidebar-btn"
            id="sidebar-btn"
            onClick={onSidebarToggle}
          >
            <i className="mdi mdi-menu-open align-middle fs-19"></i>
          </button>
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
                <button
                  type="button"
                  className="btn btn-primary btn-sm fs-14"
                  onClick={() => navigate("/signup")}
                >
                  <i className="mdi mdi-account-plus align-middle me-1"></i>
                  Sign Up
                </button>
              </>
            ) : null}
          </div>

          <div className="d-flex align-items-center gap-2">
            <form className="app-search d-none d-lg-block">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
                <span className="fab fa-sistrix fs-17 align-middle"></span>
              </div>
            </form>

            <div className="d-inline-block activities">
              <button
                type="button"
                className="btn btn-sm top-icon"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvas-rightsidabar"
              >
                <i className="fas fa-table align-middle"></i>
              </button>
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
                          <span className="rich-list-subtitle text-white" style={{ fontSize: "0.85rem" }}>
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
    </header>
  );
};

export default Topbar;
