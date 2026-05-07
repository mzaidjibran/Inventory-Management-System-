import { Link } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  return (
    <>
      <div
        className={`sidebar-left ${isOpen ? "show" : ""}`}
        style={{ transition: "all 0.3s ease" }}
      >
        <div data-simplebar className="h-100">
          <div id="sidebar-menu">
            <ul className="left-menu list-unstyled" id="side-menu">
              <li>
                <Link to="/product">
                  <i className="fas fa-desktop"></i>
                  <span>Management</span>
                </Link>
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
                    <Link to="/customer">
                      <i className="mdi mdi-checkbox-blank-circle align-middle"></i>{" "}
                      Customer
                    </Link>
                  </li>
                  <li>
                    <Link to="/supplier">
                      <i className="mdi mdi-checkbox-blank-circle align-middle"></i>{" "}
                      Supplier
                    </Link>
                  </li>
                  <li>
                    <Link to="/billing">
                      <i className="mdi mdi-checkbox-blank-circle align-middle"></i>{" "}
                      Billing
                    </Link>
                  </li>
                </ul>
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
