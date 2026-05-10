import { useState } from "react";
import Topbar from "../components/topbar.jsx";
import Sidebar from "../components/sidebar.jsx";
import BillingPage from "../components/Billing/BillingPage.jsx";

const Billing = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div id="layout-wrapper">
      <Topbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row mb-3">
              <div className="col-12">
                <h4 className="mb-0">
                  <i className="mdi mdi-point-of-sale me-2"></i>
                  Billing
                </h4>
              </div>
            </div>
            <BillingPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
