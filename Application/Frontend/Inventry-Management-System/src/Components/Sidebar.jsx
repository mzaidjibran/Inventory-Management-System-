import { Link, useLocation } from "react-router-dom";
import { getUserRole, isLoggedIn, normalizeRole } from "../Api/authApi.js";

const Sidebar = () => {
  const role = normalizeRole(getUserRole());
  const isAdmin = role === "admin";
  const isEmployee = role === "employee";
  const loggedIn = isLoggedIn();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Google Font - same as Topbar */}
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .sidebar-warm {
          width: 230px;
          height: calc(100vh - 60px);
          background: linear-gradient(180deg, #fffdf9 0%, #fef6ea 100%);
          border-right: 1px solid #e8dcc8;
          box-shadow: 2px 0 12px rgba(139, 101, 50, 0.07);
          font-family: 'Nunito', 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          position: fixed;
          top: 60px;
          left: 0;
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 900;
          /* Hide scrollbar — Chrome, Safari, Edge */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .sidebar-warm::-webkit-scrollbar {
          display: none;
        }

        .sidebar-warm.hidden {
          transform: translateX(-100%);
        }

        .sidebar-section-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #c8a87a;
          padding: 20px 20px 6px;
          margin: 0;
        }

        .sidebar-nav {
          list-style: none;
          margin: 0;
          padding: 8px 10px;
        }

        .sidebar-nav li {
          margin-bottom: 2px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: #7a5c38;
          font-size: 13.5px;
          font-weight: 600;
          transition: background 0.18s, color 0.18s, transform 0.15s;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }

        .sidebar-link:hover {
          background: #fdefd8;
          color: #8b5e2a;
          transform: translateX(2px);
        }

        .sidebar-link.active {
          background: linear-gradient(135deg, #f5ddb8, #f0d0a0);
          color: #7a4a14;
          box-shadow: 0 2px 8px rgba(200, 150, 90, 0.18);
        }

        .sidebar-link .nav-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(200, 150, 90, 0.1);
          flex-shrink: 0;
          transition: background 0.18s;
        }

        .sidebar-link:hover .nav-icon,
        .sidebar-link.active .nav-icon {
          background: rgba(200, 150, 90, 0.22);
        }

        .sidebar-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e8dcc8, transparent);
          margin: 10px 16px;
        }

        /* submenu */
        .sidebar-submenu {
          list-style: none;
          margin: 2px 0 4px 0;
          padding: 0 0 0 14px;
        }

        .sidebar-submenu li {
          margin-bottom: 1px;
        }

        .sidebar-submenu .sidebar-link {
          font-size: 12.5px;
          font-weight: 600;
          padding: 7px 10px;
          color: #9a7550;
        }

        .sidebar-submenu .sidebar-link .nav-icon {
          width: 24px;
          height: 24px;
          background: transparent;
        }

        .sidebar-submenu .sidebar-link.active {
          background: linear-gradient(135deg, #fae8c8, #f5ddb0);
          color: #7a4a14;
        }

        /* management parent highlight */
        .mgmt-parent {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          color: #7a5c38;
          font-size: 13.5px;
          font-weight: 700;
          margin-bottom: 2px;
        }

        .mgmt-parent .nav-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(200, 150, 90, 0.1);
          flex-shrink: 0;
        }

        /* dot indicator for active sub item */
        .dot-active {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c8965a;
          flex-shrink: 0;
          margin-left: auto;
        }
      `}</style>

      <div className="sidebar-warm">
        {/* ── Main Navigation ── */}
        <p className="sidebar-section-label">Navigation</p>
        <ul className="sidebar-nav">
          {loggedIn && (
            <li>
              <Link
                to="/dashboard"
                className={`sidebar-link ${isActive("/dashboard") ? "active" : ""}`}
              >
                <span className="nav-icon">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                Dashboard
                {isActive("/dashboard") && <span className="dot-active" />}
              </Link>
            </li>
          )}

          {(isAdmin || isEmployee) && (
            <li>
              <Link
                to="/billing"
                className={`sidebar-link ${isActive("/billing") ? "active" : ""}`}
              >
                <span className="nav-icon">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </span>
                Billing
                {isActive("/billing") && <span className="dot-active" />}
              </Link>
            </li>
          )}
        </ul>

        {/* ── Management (Admin only) ── */}
        {isAdmin && (
          <>
            <div className="sidebar-divider" />
            <p className="sidebar-section-label">Management</p>
            <ul className="sidebar-nav">
              <li>
                <div className="mgmt-parent">
                  <span className="nav-icon">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </span>
                  Manage
                </div>

                <ul className="sidebar-submenu">
                  <li>
                    <Link
                      to="/employee"
                      className={`sidebar-link ${isActive("/employee") ? "active" : ""}`}
                    >
                      <span className="nav-icon">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                      </span>
                      Employee
                      {isActive("/employee") && <span className="dot-active" />}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/supplier"
                      className={`sidebar-link ${isActive("/supplier") ? "active" : ""}`}
                    >
                      <span className="nav-icon">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="1" y="3" width="15" height="13" rx="1" />
                          <path d="M16 8h4l3 3v5h-7V8z" />
                          <circle cx="5.5" cy="18.5" r="2.5" />
                          <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                      </span>
                      Supplier
                      {isActive("/supplier") && <span className="dot-active" />}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/product"
                      className={`sidebar-link ${isActive("/product") ? "active" : ""}`}
                    >
                      <span className="nav-icon">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                      </span>
                      Products
                      {isActive("/product") && <span className="dot-active" />}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/client"
                      className={`sidebar-link ${isActive("/client") ? "active" : ""}`}
                    >
                      <span className="nav-icon">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </span>
                      Customer
                      {isActive("/client") && <span className="dot-active" />}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </>
        )}

        {/* Bottom spacer — pushes footer branding to the very bottom */}
        <div style={{ flex: 1, minHeight: 0 }} />

        {/* Footer branding */}
        <div
          style={{
            padding: "14px 18px",
            borderTop: "1px solid #e8dcc8",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background: "linear-gradient(135deg, #c8965a, #a0733a)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="14"
              height="14"
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
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#5c3d11",
                lineHeight: 1.2,
              }}
            >
              Al-Nasiri
            </div>
            <div
              style={{
                fontSize: 9.5,
                color: "#b89060",
                fontWeight: 500,
                letterSpacing: "0.3px",
              }}
            >
              POS v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
