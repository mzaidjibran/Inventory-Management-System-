import EmployeeTable from "../components/Employee/EmployeeTable.jsx";
import Topbar from "../components/topbar.jsx";
import Sidebar from "../components/sidebar.jsx";
import Footer from "../components/Footer.jsx";

const Employee = () => {
  return (
    <div
      id="layout-wrapper"
      style={{ background: "#fdf8f2", minHeight: "100vh" }}
    >
      <Topbar />
      <Sidebar />
      <div className="main-content">
        <div className="page-content" style={{ padding: "24px 8px" }}>
          <div className="container-fluid px-0">
            {/* ── Page Header ── */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 24,
                flexWrap: "wrap",
                gap: 10,
                fontFamily: "Nunito, sans-serif",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "1.4px",
                    textTransform: "uppercase",
                    color: "#c8a87a",
                    margin: "0 0 4px",
                  }}
                >
                  Management
                </p>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#3d2a10",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Employees
                </h2>
                <p
                  style={{
                    color: "#b89060",
                    fontSize: 13,
                    margin: "4px 0 0",
                    fontWeight: 600,
                  }}
                >
                  Manage your store employees
                </p>
              </div>

              <nav style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span
                  style={{ fontSize: 12, color: "#b89060", fontWeight: 600 }}
                >
                  Al-Nasri Stationary & Books
                </span>
                <span style={{ color: "#e8dcc8" }}>/</span>
                <span
                  style={{ fontSize: 12, color: "#b89060", fontWeight: 600 }}
                >
                  Management
                </span>
                <span style={{ color: "#e8dcc8" }}>/</span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#c8965a",
                    fontWeight: 700,
                    background: "#f3e5d8",
                    padding: "2px 10px",
                    borderRadius: 20,
                  }}
                >
                  Employees
                </span>
              </nav>
            </div>

            <EmployeeTable />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Employee;
