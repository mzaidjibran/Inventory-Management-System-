import { useState } from "react";
import UserTable from "../components/User/UserTable.jsx"
import Topbar from "../components/topbar.jsx";
import Sidebar from "../components/sidebar.jsx";

export default function User() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div id="layout-wrapper">
            <Topbar onSidebarToggle={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} />
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