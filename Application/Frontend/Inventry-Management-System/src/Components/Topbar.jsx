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

const API_BASE = "http://127.0.0.1:3000";

const normalizeRole = (r) => {
  if (!r) return "User";
  const lower = String(r).toLowerCase();
  if (lower === "employee" || lower === "user") return "Employee";
  if (lower === "administrator" || lower === "admin" || lower === "manager")
    return "Administrator";
  return "User";
};

/* ─── inline styles (no external CSS changes needed) ─── */
const styles = {
  header: {
    background: "linear-gradient(135deg, #fffdf9 0%, #fef9f0 100%)",
    borderBottom: "1px solid #e8dcc8",
    boxShadow: "0 2px 12px rgba(139, 101, 50, 0.08)",
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  navbarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: 60,
    gap: 16,
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    minWidth: 0,
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: "linear-gradient(135deg, #c8965a, #a0733a)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.2,
  },
  logoTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#5c3d11",
    letterSpacing: "-0.3px",
    whiteSpace: "nowrap",
  },
  logoSubtitle: {
    fontSize: 10,
    color: "#a07850",
    fontWeight: 500,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginLeft: "auto",
  },
  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    background: "#fff8f0",
    border: "1.5px solid #e0ccb0",
    borderRadius: 24,
    padding: "7px 14px 7px 36px",
    fontSize: 13,
    color: "#5c3d11",
    outline: "none",
    width: 200,
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    color: "#b8926a",
    fontSize: 14,
    pointerEvents: "none",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "1.5px solid #e8dcc8",
    background: "#fff8f0",
    color: "#8b6540",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 16,
    transition: "all 0.18s",
    flexShrink: 0,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "2px solid #c8965a",
    padding: 0,
    background: "transparent",
    cursor: "pointer",
    overflow: "hidden",
    transition: "box-shadow 0.18s",
    flexShrink: 0,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
  },
  /* dropdown card */
  dropdownCard: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 10px)",
    width: 280,
    background: "#fffdf9",
    borderRadius: 14,
    border: "1px solid #e8dcc8",
    boxShadow: "0 8px 32px rgba(139,101,50,0.13)",
    overflow: "hidden",
    zIndex: 9999,
    fontFamily: "inherit",
  },
  dropdownHeader: {
    background: "linear-gradient(135deg, #c8965a 0%, #a0733a 100%)",
    padding: "16px 16px 14px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  dropdownAvatarWrap: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.6)",
    overflow: "hidden",
    flexShrink: 0,
  },
  dropdownAvatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dropdownUserName: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    margin: 0,
  },
  dropdownUserEmail: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 11.5,
    marginTop: 1,
  },
  dropdownRole: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10.5,
    marginTop: 2,
    background: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    padding: "2px 8px",
    display: "inline-block",
    fontWeight: 600,
    letterSpacing: "0.3px",
  },
  dropdownBody: {
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  btnOutline: {
    background: "transparent",
    border: "1.5px solid #c8965a",
    color: "#8b5e2a",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.18s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #c8965a, #a0733a)",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "opacity 0.18s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnDanger: {
    background: "transparent",
    border: "1.5px solid #e07070",
    color: "#c0392b",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: 6,
    width: "100%",
    justifyContent: "center",
  },
  dropdownFooter: {
    borderTop: "1px solid #e8dcc8",
    padding: "10px 14px",
  },
  /* calendar dropdown */
  calDropdown: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 10px)",
    width: 240,
    background: "#fffdf9",
    borderRadius: 12,
    border: "1px solid #e8dcc8",
    boxShadow: "0 8px 24px rgba(139,101,50,0.12)",
    padding: 14,
    zIndex: 9999,
    fontFamily: "inherit",
  },
  calLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#a07850",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginBottom: 8,
    display: "block",
  },
  calInput: {
    width: "100%",
    border: "1.5px solid #e0ccb0",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 13,
    color: "#5c3d11",
    background: "#fff8f0",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  },
  calSelected: {
    fontSize: 11,
    color: "#a07850",
    marginTop: 6,
  },
  /* modal */
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(92,61,17,0.18)",
    backdropFilter: "blur(2px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },
  modal: {
    background: "#fffdf9",
    borderRadius: 16,
    width: 380,
    maxWidth: "92vw",
    border: "1px solid #e8dcc8",
    boxShadow: "0 12px 40px rgba(139,101,50,0.15)",
    overflow: "hidden",
    fontFamily: "inherit",
  },
  modalHeader: {
    background: "linear-gradient(135deg, #c8965a, #a0733a)",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    margin: 0,
  },
  modalCloseBtn: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    color: "#fff",
    width: 26,
    height: 26,
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  },
  modalBody: {
    padding: "18px",
  },
  formLabel: {
    fontSize: 11.5,
    fontWeight: 700,
    color: "#8b6540",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    display: "block",
    marginBottom: 5,
  },
  formInput: {
    width: "100%",
    border: "1.5px solid #e0ccb0",
    borderRadius: 8,
    padding: "8px 11px",
    fontSize: 13,
    color: "#5c3d11",
    background: "#fff8f0",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 12,
    transition: "border-color 0.18s",
  },
  formRow: {
    display: "flex",
    gap: 8,
    marginTop: 4,
  },
  userListItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #f0e8d8",
  },
  userListName: {
    fontWeight: 600,
    fontSize: 13,
    color: "#5c3d11",
  },
  userListEmail: {
    fontSize: 11,
    color: "#a07850",
    marginTop: 1,
  },
  deleteBtn: {
    background: "transparent",
    border: "1.5px solid #e07070",
    color: "#c0392b",
    borderRadius: 7,
    padding: "4px 10px",
    fontSize: 11.5,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  signInBtn: {
    background: "linear-gradient(135deg, #c8965a, #a0733a)",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    padding: "7px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
};

const Topbar = () => {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [calendarDate, setCalendarDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [profile, setProfile] = useState(() => {
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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCalDropdown, setShowCalDropdown] = useState(false);

  const profileDropdownRef = useRef(null);
  const calDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        calDropdownRef.current &&
        !calDropdownRef.current.contains(e.target)
      ) {
        setShowCalDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      if (!isLoggedIn()) {
        if (active) setProfile({ Name: "", email: "", image: "" });
        return;
      }
      try {
        const response = await getMyProfile();
        if (active) {
          const userData = response.data || { Name: "", email: "", image: "" };
          setProfile(userData);
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
      [
        "accessToken",
        "refreshToken",
        "userRole",
        "userId",
        "userName",
        "userEmail",
        "userImage",
      ].forEach((k) => localStorage.removeItem(k));
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

  const openCreateUser = () => {
    setCreateOpen(true);
    setShowProfileDropdown(false);
  };
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
      try {
        const raw = localStorage.getItem("approvedUsers");
        const list = raw ? JSON.parse(raw) : [];
        if (!list.includes(createForm.email)) {
          list.push(createForm.email);
          localStorage.setItem("approvedUsers", JSON.stringify(list));
        }
      } catch (e) {
        localStorage.setItem(
          "approvedUsers",
          JSON.stringify([createForm.email]),
        );
      }
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
      setExistingUsers((prev) => prev.filter((u) => u._id !== id));
      try {
        const raw = localStorage.getItem("approvedUsers");
        const list = raw ? JSON.parse(raw) : [];
        localStorage.setItem(
          "approvedUsers",
          JSON.stringify(list.filter((e) => e !== email)),
        );
      } catch (e) {
        console.error("Failed to update approvedUsers:", e);
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
    <>
      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <header style={styles.header}>
        <div style={styles.navbarHeader}>
          {/* ── Logo ── */}
          <a
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={styles.logoIcon}>
              {/* Book icon SVG */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div style={styles.logoText}>
              <span style={styles.logoTitle}>Al-Nasiri</span>
              <span style={styles.logoSubtitle}>Stationery Shop · POS</span>
            </div>
          </a>

          {/* ── Right Section ── */}
          <div style={styles.rightSection}>
            {/* Search */}
            {/* <form
              onSubmit={handleSearchSubmit}
              style={{ ...styles.searchWrapper, display: "none" }}
              className="d-lg-flex"
            >
              <form onSubmit={handleSearchSubmit} style={styles.searchWrapper}>
                <svg
                  style={styles.searchIcon}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search pages…"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={styles.searchInput}
                  list="topbar-search-routes"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#c8965a";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(200,150,90,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0ccb0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <datalist id="topbar-search-routes">
                  {getSearchRoutes().map((route) => (
                    <option key={route.path} value={route.label} />
                  ))}
                </datalist>
              </form>
            </form> */}

            {/* Search (visible always, not just lg) */}
            <form onSubmit={handleSearchSubmit} style={styles.searchWrapper}>
              <svg
                style={styles.searchIcon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search pages…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={styles.searchInput}
                list="topbar-search-routes-2"
                onFocus={(e) => {
                  e.target.style.borderColor = "#c8965a";
                  e.target.style.boxShadow = "0 0 0 3px rgba(200,150,90,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0ccb0";
                  e.target.style.boxShadow = "none";
                }}
              />
              <datalist id="topbar-search-routes-2">
                {getSearchRoutes().map((route) => (
                  <option key={route.path} value={route.label} />
                ))}
              </datalist>
            </form>

            {/* Calendar */}
            <div style={{ position: "relative" }} ref={calDropdownRef}>
              <button
                type="button"
                style={styles.iconBtn}
                onClick={() => setShowCalDropdown((v) => !v)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f5e8d4";
                  e.currentTarget.style.borderColor = "#c8965a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff8f0";
                  e.currentTarget.style.borderColor = "#e8dcc8";
                }}
                title="Calendar"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </button>
              {showCalDropdown && (
                <div style={styles.calDropdown}>
                  <span style={styles.calLabel}>Pick a Date</span>
                  <input
                    type="date"
                    value={calendarDate}
                    onChange={(e) => setCalendarDate(e.target.value)}
                    style={styles.calInput}
                  />
                  <div style={styles.calSelected}>
                    Selected:{" "}
                    <strong style={{ color: "#8b5e2a" }}>{calendarDate}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Not logged in → Sign In button */}
            {!isLoggedIn() && (
              <button
                style={styles.signInBtn}
                onClick={() => navigate("/signin")}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign In
              </button>
            )}

            {/* Profile dropdown */}
            {isLoggedIn() && (
              <div style={{ position: "relative" }} ref={profileDropdownRef}>
                <button
                  type="button"
                  style={styles.avatarBtn}
                  onClick={() => setShowProfileDropdown((v) => !v)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(200,150,90,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <img src={avatarSrc} alt="Profile" style={styles.avatarImg} />
                </button>

                {showProfileDropdown && (
                  <div style={styles.dropdownCard}>
                    {/* Header */}
                    <div style={styles.dropdownHeader}>
                      <div style={styles.dropdownAvatarWrap}>
                        <img
                          src={avatarSrc}
                          alt="Profile"
                          style={styles.dropdownAvatarImg}
                        />
                      </div>
                      <div>
                        <div style={styles.dropdownUserName}>
                          {profile.Name || "User"}
                        </div>
                        <div style={styles.dropdownUserEmail}>
                          {profile.email || ""}
                        </div>
                        <span style={styles.dropdownRole}>
                          {normalizeRole(getUserRole())}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div style={styles.dropdownBody}>
                      <button
                        style={styles.btnOutline}
                        onClick={handleImageButtonClick}
                        disabled={uploading}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#fdf0e0";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        {uploading ? "Uploading…" : "Change Photo"}
                      </button>

                      {isAdmin() && (
                        <button
                          style={styles.btnPrimary}
                          onClick={openCreateUser}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "0.88";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "1";
                          }}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" />
                            <line x1="22" y1="11" x2="16" y2="11" />
                          </svg>
                          Create User
                        </button>
                      )}

                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                      />
                    </div>

                    {/* Footer */}
                    <div style={styles.dropdownFooter}>
                      <button
                        style={styles.btnDanger}
                        onClick={handleLogout}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#fff0f0";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Create User Modal ── */}
      {createOpen && (
        <div
          style={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeCreateUser();
          }}
        >
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <span style={styles.modalTitle}>
                <svg
                  style={{ marginRight: 8, verticalAlign: "middle" }}
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Create New User
              </span>
              <button style={styles.modalCloseBtn} onClick={closeCreateUser}>
                ×
              </button>
            </div>

            <div style={styles.modalBody}>
              <form onSubmit={handleCreateSubmit}>
                <label style={styles.formLabel}>Full Name</label>
                <input
                  name="Name"
                  style={styles.formInput}
                  placeholder="e.g. Ahmed Ali"
                  value={createForm.Name}
                  onChange={handleCreateChange}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = "#c8965a";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0ccb0";
                  }}
                />

                <label style={styles.formLabel}>Email Address</label>
                <input
                  name="email"
                  type="email"
                  style={styles.formInput}
                  placeholder="email@example.com"
                  value={createForm.email}
                  onChange={handleCreateChange}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = "#c8965a";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0ccb0";
                  }}
                />

                <label style={styles.formLabel}>Password</label>
                <input
                  name="password"
                  type="password"
                  style={styles.formInput}
                  placeholder="Set a strong password"
                  value={createForm.password}
                  onChange={handleCreateChange}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = "#c8965a";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0ccb0";
                  }}
                />

                <div style={styles.formRow}>
                  <button
                    type="submit"
                    style={{
                      ...styles.btnPrimary,
                      flex: 1,
                      padding: "9px 12px",
                    }}
                  >
                    Create User
                  </button>
                  <button
                    type="button"
                    style={{
                      ...styles.btnOutline,
                      flex: 1,
                      padding: "9px 12px",
                    }}
                    onClick={closeCreateUser}
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* Existing Users List */}
              <div style={{ marginTop: 18 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#a07850",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: 10,
                  }}
                >
                  Existing Users
                </div>
                {loadingUsers ? (
                  <div
                    style={{ fontSize: 12, color: "#b89060", padding: "8px 0" }}
                  >
                    Loading…
                  </div>
                ) : existingUsers.length === 0 ? (
                  <div
                    style={{ fontSize: 12, color: "#b89060", padding: "8px 0" }}
                  >
                    No users found.
                  </div>
                ) : (
                  <div style={{ maxHeight: 200, overflowY: "auto" }}>
                    {existingUsers.map((u) => (
                      <div key={u._id} style={styles.userListItem}>
                        <div>
                          <div style={styles.userListName}>
                            {u.User_Name || u.Name || u.name || u.email}
                          </div>
                          <div style={styles.userListEmail}>{u.email}</div>
                        </div>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDeleteUser(u._id, u.email)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#fff0f0";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
