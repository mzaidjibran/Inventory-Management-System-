import { useNavigate } from "react-router-dom";
import { logOut, isLoggedIn } from "../Api/authApi.js";
import { toast } from "react-toastify";

const Topbar = ({ onSidebarToggle }) => {
  const navigate = useNavigate();

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
      navigate("/signin");
    }
  };

  return (
    <>
      <header id="page-topbar">
        <div className="navbar-header">
          {/* Logo */}
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

          {/* Menu */}
          <div className="d-flex justify-content-between menu-sm px-3 ms-auto">
            {/* Logout / Sign In / Sign Up Buttons */}
            <div className="d-flex align-items-center gap-2">
              {isLoggedIn() ? (
                <button
                  type="button"
                  className="btn btn-danger btn-sm fs-14"
                  onClick={handleLogout}
                >
                  <i className="mdi mdi-logout align-middle me-1"></i>
                  Logout
                </button>
              ) : (
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
              )}
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* Search */}
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

              {/* Notification */}
              <div className="dropdown d-inline-block">
                <button
                  type="button"
                  className="btn btn-sm top-icon"
                  id="page-header-notifications-dropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-bell align-middle"></i>
                  <span className="btn-marker">
                    <i className="marker marker-dot text-danger"></i>
                  </span>
                </button>
                <div className="dropdown-menu dropdown-menu-lg dropdown-menu-md dropdown-menu-end p-0">
                  <div className="p-3 bg-info">
                    <div className="row align-items-center">
                      <div className="col">
                        <h6 className="text-white m-0">
                          <i className="far fa-bell me-2"></i> Notifications
                        </h6>
                      </div>
                      <div className="col-auto">
                        <a href="#!" className="badge bg-info-subtle text-info">
                          8+
                        </a>
                      </div>
                    </div>
                  </div>
                  <div data-simplebar style={{ maxHeight: "230px" }}>
                    <a href="" className="text-reset notification-item">
                      <div className="d-flex">
                        <div className="avatar avatar-xs avatar-label-primary me-3">
                          <span className="rounded fs-16">
                            <i className="mdi mdi-file-document-outline"></i>
                          </span>
                        </div>
                        <div className="flex-1">
                          <h6 className="mb-1">New report has been received</h6>
                          <div className="fs-12 text-muted">
                            <p className="mb-0">
                              <i className="mdi mdi-clock-outline"></i> 3 min
                              ago
                            </p>
                          </div>
                        </div>
                        <i className="mdi mdi-chevron-right align-middle ms-2"></i>
                      </div>
                    </a>
                    <a href="" className="text-reset notification-item">
                      <div className="d-flex">
                        <div className="avatar avatar-xs avatar-label-success me-3">
                          <span className="rounded fs-16">
                            <i className="mdi mdi-cart-variant"></i>
                          </span>
                        </div>
                        <div className="flex-1">
                          <h6 className="mb-1">Last order was completed</h6>
                          <div className="fs-12 text-muted">
                            <p className="mb-0">
                              <i className="mdi mdi-clock-outline"></i> 1 hour
                              ago
                            </p>
                          </div>
                        </div>
                        <i className="mdi mdi-chevron-right align-middle ms-2"></i>
                      </div>
                    </a>
                    <a href="" className="text-reset notification-item">
                      <div className="d-flex">
                        <div className="avatar avatar-xs avatar-label-danger me-3">
                          <span className="rounded fs-16">
                            <i className="mdi mdi-account-group"></i>
                          </span>
                        </div>
                        <div className="flex-1">
                          <h6 className="mb-1">Completed meeting canceled</h6>
                          <div className="fs-12 text-muted">
                            <p className="mb-0">
                              <i className="mdi mdi-clock-outline"></i> 5 hour
                              ago
                            </p>
                          </div>
                        </div>
                        <i className="mdi mdi-chevron-right align-middle ms-2"></i>
                      </div>
                    </a>
                    <a href="" className="text-reset notification-item">
                      <div className="d-flex">
                        <div className="avatar avatar-xs avatar-label-warning me-3">
                          <span className="rounded fs-16">
                            <i className="mdi mdi-send-outline"></i>
                          </span>
                        </div>
                        <div className="flex-1">
                          <h6 className="mb-1">New feedback received</h6>
                          <div className="fs-12 text-muted">
                            <p className="mb-0">
                              <i className="mdi mdi-clock-outline"></i> 6 hour
                              ago
                            </p>
                          </div>
                        </div>
                        <i className="mdi mdi-chevron-right align-middle ms-2"></i>
                      </div>
                    </a>
                    <a href="" className="text-reset notification-item">
                      <div className="d-flex">
                        <div className="avatar avatar-xs avatar-label-secondary me-3">
                          <span className="rounded fs-16">
                            <i className="mdi mdi-download-box"></i>
                          </span>
                        </div>
                        <div className="flex-1">
                          <h6 className="mb-1">New update was available</h6>
                          <div className="fs-12 text-muted">
                            <p className="mb-0">
                              <i className="mdi mdi-clock-outline"></i> 1 day
                              ago
                            </p>
                          </div>
                        </div>
                        <i className="mdi mdi-chevron-right align-middle ms-2"></i>
                      </div>
                    </a>
                    <a href="" className="text-reset notification-item">
                      <div className="d-flex">
                        <div className="avatar avatar-xs avatar-label-info me-3">
                          <span className="rounded fs-16">
                            <i className="mdi mdi-hexagram-outline"></i>
                          </span>
                        </div>
                        <div className="flex-1">
                          <h6 className="mb-1">Your password was changed</h6>
                          <div className="fs-12 text-muted">
                            <p className="mb-0">
                              <i className="mdi mdi-clock-outline"></i> 2 day
                              ago
                            </p>
                          </div>
                        </div>
                        <i className="mdi mdi-chevron-right align-middle ms-2"></i>
                      </div>
                    </a>
                  </div>
                  <div className="p-2 border-top">
                    <div className="d-grid">
                      <a
                        className="btn btn-sm btn-link font-size-14 text-center"
                        href="javascript:void(0)"
                      >
                        <i className="mdi mdi-arrow-right-circle me-1"></i> View
                        More..
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activities */}
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

              {/* Profile Dropdown */}
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
                    src="assets/images/users/avatar-6.png"
                    alt="Header Avatar"
                  />
                </button>
                <div className="dropdown-menu dropdown-menu-wide dropdown-menu-end dropdown-menu-animated overflow-hidden py-0">
                  <div className="card border-0">
                    <div className="card-header bg-primary rounded-0">
                      <div className="rich-list-item w-100 p-0">
                        <div className="rich-list-prepend">
                          <div className="avatar avatar-label-light avatar-circle">
                            <div className="avatar-display">
                              <i className="fa fa-user-alt"></i>
                            </div>
                          </div>
                        </div>
                        <div className="rich-list-content">
                          <h3 className="rich-list-title text-white">
                            Charlie Stone
                          </h3>
                          <span className="rich-list-subtitle text-white">
                            admin@codubucks.in
                          </span>
                        </div>
                        <div className="rich-list-append">
                          <span className="badge badge-label-light fs-6">
                            6+
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-0">
                      <div className="grid-nav grid-nav-flush grid-nav-action grid-nav-no-rounded">
                        <div className="grid-nav-row">
                          <a href="apps-contact.html" className="grid-nav-item">
                            <div className="grid-nav-icon">
                              <i className="far fa-address-card"></i>
                            </div>
                            <span className="grid-nav-content">Profile</span>
                          </a>
                          <a href="#!" className="grid-nav-item">
                            <div className="grid-nav-icon">
                              <i className="far fa-comments"></i>
                            </div>
                            <span className="grid-nav-content">Messages</span>
                          </a>
                          <a href="#!" className="grid-nav-item">
                            <div className="grid-nav-icon">
                              <i className="far fa-clone"></i>
                            </div>
                            <span className="grid-nav-content">Activities</span>
                          </a>
                        </div>
                        <div className="grid-nav-row">
                          <a href="#!" className="grid-nav-item">
                            <div className="grid-nav-icon">
                              <i className="far fa-calendar-check"></i>
                            </div>
                            <span className="grid-nav-content">Tasks</span>
                          </a>
                          <a href="#!" className="grid-nav-item">
                            <div className="grid-nav-icon">
                              <i className="far fa-sticky-note"></i>
                            </div>
                            <span className="grid-nav-content">Notes</span>
                          </a>
                          <a href="#!" className="grid-nav-item">
                            <div className="grid-nav-icon">
                              <i className="far fa-bell"></i>
                            </div>
                            <span className="grid-nav-content">
                              Notification
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer card-footer-bordered rounded-0">
                      <button
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
              {/* End Profile */}
            </div>
          </div>
          {/* End menu */}
        </div>
      </header>
    </>
  );
};

export default Topbar;
