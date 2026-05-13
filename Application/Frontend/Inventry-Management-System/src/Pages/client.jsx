import { useState } from "react";
import ClientTable from "../components/client/clienttable.jsx";
import Topbar from "../components/topbar.jsx";
import Sidebar from "../components/sidebar.jsx";
import Footer from "../components/Footer.jsx";

const Client = () => {
  return (
    <div id="layout-wrapper">
      <Topbar />
      <Sidebar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <ClientTable />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Client;
