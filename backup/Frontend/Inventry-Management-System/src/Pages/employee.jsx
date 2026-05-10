import { useState } from "react"
import EmployeeTable from "../components/Employee/EmployeeTable.jsx"
import Topbar from "../components/topbar.jsx"
import Sidebar from "../components/sidebar.jsx"

const Employee = () => {
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
              <EmployeeTable />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Employee
