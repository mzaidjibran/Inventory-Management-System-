import { useState } from "react";
import UserTable from "../Components/User/UserTable.jsx"
import Topbar from "../Components/Topbar.jsx";
import Sidebar from "../Components/Sidebar.jsx";

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