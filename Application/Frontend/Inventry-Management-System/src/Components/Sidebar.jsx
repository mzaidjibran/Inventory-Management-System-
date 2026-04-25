import { Link } from "react-router-dom"

const Sidebar = ({ isOpen }) => {
    return (
        <>
            {/* <!-- ========== Left Sidebar Start ========== --> */}
            <div className={`sidebar-left ${isOpen ? 'show' : ''}`} style={{ transition: 'all 0.3s ease' }}>

                <div data-simplebar className="h-100">

                    {/* <!--- Sidebar-menu --> */}
                    <div id="sidebar-menu">
                        {/* <!-- Left Menu Start --> */}
                        <ul className="left-menu list-unstyled" id="side-menu">
                            <li>
                                <Link to="/">
                                    <i className="fas fa-desktop"></i>
                                    <span>Dashboard</span>
                                </Link>
                            </li>

                            {/* <li>

                                <ul className="sub-menu" aria-expanded="false">
                                    <li><Link to="/"><i className="mdi mdi-checkbox-blank-circle align-middle"></i>Employee</Link></li>
                                    <li><Link to="/department"><i className="mdi mdi-checkbox-blank-circle align-middle"></i> Department</Link></li>
                                    <li><Link to="/designation"><i className="mdi mdi-checkbox-blank-circle align-middle"></i> Designation</Link></li>
                                    <li><Link to="/shift"><i className="mdi mdi-checkbox-blank-circle align-middle"></i> Shift</Link></li>
                                    <li><Link to="/user"><i className="mdi mdi-checkbox-blank-circle align-middle"></i> User</Link></li>

                                </ul>
                            </li> */}

                        </ul>
                    </div>
                    {/* <!-- Sidebar --> */}
                </div>
            </div>
            {/* <!-- Left Sidebar End --> */}

        </>
    )
}

export default Sidebar