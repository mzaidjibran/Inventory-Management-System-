import { Link } from "react-router-dom";
import { getUserRole, isLoggedIn } from "../Api/authApi.js";

const Sidebar = ({ isOpen }) => {
  const userRole = getUserRole();
  const normalizeRole = (r) => {
    if (!r) return null;
    const lower = String(r).toLowerCase();
    if (lower === "employee") return "user";
    if (lower === "administrator") return "admin";
    if (lower === "manager") return "admin";
    return lower;
  };
  const normalizedRole = normalizeRole(userRole);
  const isAdmin = normalizedRole === "admin";
  const loggedIn = isLoggedIn();

  return (
    <>
      <div
        className={`sidebar-left ${isOpen ? "show" : ""}`}
        style={{ transition: "all 0.3s ease" }}
      >
        <div data-simplebar className="h-100">
          <div id="sidebar-menu">
            <ul className="left-menu list-unstyled" id="side-menu">
              {isAdmin && (
                <li>
                  <Link to="/product">
                    <i className="fas fa-desktop"></i>
                    <span>Management</span>
                  </Link>
                </li>
              )}

              {isAdmin && (
                <li>
                  <ul className="sub-menu" aria-expanded="false">
                    <li>
                      <Link to="/employee">
                        <i className="mdi mdi-checkbox-blank-circle align-middle"></i>
                        Employee
                      </Link>
                    </li>
                    <li>
                      <Link to="/supplier">
                        <i className="mdi mdi-checkbox-blank-circle align-middle"></i>
                        Supplier
                      </Link>
                    </li>
                    <li>
                      <Link to="/product">
                        <i className="mdi mdi-checkbox-blank-circle align-middle"></i>
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link to="/client">
                        <i className="mdi mdi-checkbox-blank-circle align-middle"></i>{" "}
                        Customer
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

              {loggedIn && (
                <li>
                  <Link to="/dashboard">
                    <i className="fas fa-home"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>
              )}

              <li>
                <Link to="/billing">
                  <i className="mdi mdi-checkbox-blank-circle align-middle"></i>{" "}
                  Billing
                </Link>
              </li>
            </ul>
          </div>
          {/* <!-- Sidebar --> */}
        </div>
      </div>
      {/* <!-- Left Sidebar End --> */}
    </>
  );
};

export default Sidebar;
