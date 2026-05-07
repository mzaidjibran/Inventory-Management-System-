import { useState } from "react";
import ClientTable from "../components/client/clienttable.jsx";
import Topbar from "../components/topbar.jsx";
import Sidebar from "../components/sidebar.jsx";

const Client = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div id="layout-wrapper">
        <Topbar onSidebarToggle={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} />
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <ClientTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Client;
