import { useState } from "react"
import SupplierTable from "../Components/Supplier/SupplierTable.jsx"
import Topbar from "../components/topbar.jsx"
import Sidebar from "../components/sidebar.jsx"

const Supplier = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
 
  return (
    <>
      <div id="layout-wrapper">
        <Topbar onSidebarToggle={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} />
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <SupplierTable />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Supplier