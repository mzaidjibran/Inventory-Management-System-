import EmployeeTable from "../components/Employee/EmployeeTable.jsx";
import Topbar from "../components/topbar.jsx";
import Sidebar from "../components/sidebar.jsx";

const Employee = () => {
  return (
    <>
      <div id="layout-wrapper">
        <Topbar />
        <Sidebar />
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <EmployeeTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Employee;
