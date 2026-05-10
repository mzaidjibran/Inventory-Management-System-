import { Link } from "react-router-dom";
import { getUserRole, isLoggedIn, normalizeRole } from "../Api/authApi.js";

const Sidebar = ({ isOpen }) => {
  const role = normalizeRole(getUserRole());
  const isAdmin = role === "admin";
  const isEmployee = role === "employee";
  const loggedIn = isLoggedIn();

  return (
    <div
      className={`sidebar-left ${isOpen ? "show" : ""}`}
      style={{ transition: "all 0.3s ease" }}
    >
      <div data-simplebar className="h-100">
        <div id="sidebar-menu">
          <ul className="left-menu list-unstyled" id="side-menu">

            {loggedIn && (
              <li>
                <Link to="/dashboard">
                  <i className="fas fa-home"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
            )}

            {isAdmin && (
              <>
                <li>
                  <a href="#">
                    <i className="fas fa-desktop"></i>
                    <span>Management</span>
                  </a>
                </li>
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
                        <i className="mdi mdi-checkbox-blank-circle align-middle"></i>
                        Customer
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}

            {(isAdmin || isEmployee) && (
              <li>
                <Link to="/billing">
                  <i className="mdi mdi-point-of-sale align-middle"></i>
                  <span>Billing</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;