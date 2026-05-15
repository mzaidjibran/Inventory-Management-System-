import UserTable from "../components/User/UserTable.jsx";
import Topbar from "../components/topbar.jsx";
import Sidebar from "../components/sidebar.jsx";

export default function User() {
  return (
    <div id="layout-wrapper">
      <Topbar />
      <Sidebar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <UserTable />
          </div>
        </div>
      </div>
    </div>
  );
}
