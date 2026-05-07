import { useState } from "react"
import ProductTable from "../components/Product/ProductTable.jsx"
import Topbar from "../components/topbar.jsx"
import Sidebar from "../components/sidebar.jsx"

const Product = () => {
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
              <ProductTable />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Product
