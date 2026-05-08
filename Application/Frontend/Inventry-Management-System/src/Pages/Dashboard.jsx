import { useState } from "react";
import Topbar from "../components/Topbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div id="layout-wrapper">
      <Topbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fs-16 fw-semibold mb-1 mb-md-2">
                      Good Morning, <span className="text-primary">Jonas!</span>
                    </h4>
                    <p className="text-muted mb-0">
                      Here's what's happening with your store today.
                    </p>
                  </div>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <a href="javascript: void(0);">Clivax</a>
                      </li>
                      <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xxl-9">
                <div className="card">
                  <div className="card-header">
                    <div className="card-icon">
                      <i className="fas fa-cart-plus fs-14 text-muted"></i>
                    </div>
                    <h4 className="card-title mb-0">Overall Sales</h4>
                    <div className="dropdown card-addon">
                      <a
                        href="#"
                        className="dropdown-toggle arrow-none card-drop"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="mdi mdi-dots-sidebar"></i>
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:void(0);" className="dropdown-item">
                          Sales Report
                        </a>

                        <a href="javascript:void(0);" className="dropdown-item">
                          Export Report
                        </a>

                        <a href="javascript:void(0);" className="dropdown-item">
                          Profit
                        </a>

                        <a href="javascript:void(0);" className="dropdown-item">
                          Action
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="d-flex justify-content-between align-content-end shadow-lg p-3">
                          <div>
                            <p className="text-muted text-truncate mb-2">
                              Total sales
                            </p>
                            <h5 className="mb-0">$12,253</h5>
                          </div>
                          <div className="text-success float-end">
                            <i className="mdi mdi-menu-up"> </i>2.2%
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-4">
                        <div className="d-flex justify-content-between align-content-end shadow-lg p-3">
                          <div>
                            <p className="text-muted text-truncate mb-2">
                              Latest sales
                            </p>
                            <h5 className="mb-0">$34,254</h5>
                          </div>
                          <div className="text-success float-end">
                            <i className="mdi mdi-menu-up"> </i>2.1%
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="d-flex justify-content-between align-content-end shadow-lg p-3">
                          <div>
                            <p className="text-muted text-truncate mb-2">
                              Last sales
                            </p>
                            <h5 className="mb-0">$32,695</h5>
                          </div>
                          <div className="text-success float-end">
                            <i className="mdi mdi-menu-up"> </i>1.8%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div
                      id="sales_figures"
                      data-colors='["--bs-info", "--bs-success"]'
                      className="apex-charts"
                      dir="ltr"
                    ></div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-4">
                    <div
                      className="card bg-danger-subtle"
                      style={{
                        background:
                          "url('assets/images/dashboard/dashboard-shape-1.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom center",
                      }}
                    >
                      <div className="card-body">
                        <div className="d-flex">
                          <div className="avatar avatar-sm avatar-label-danger">
                            <i className="mdi mdi-buffer mt-1"></i>
                          </div>
                          <div className="ms-3">
                            <p className="text-danger mb-1">Total balance</p>
                            <h4 className="mb-0">$1,452.55</h4>
                          </div>
                        </div>
                        <div className="hstack gap-2 mt-3">
                          <button className="btn btn-light">Transfer</button>
                          <button className="btn btn-info">Request</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4">
                    <div
                      className="card bg-success-subtle"
                      style={{
                        background:
                          "url('assets/images/dashboard/dashboard-shape-2.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom center",
                      }}
                    >
                      <div className="card-body">
                        <div className="d-flex">
                          <div className="avatar avatar-sm avatar-label-success">
                            <i className="mdi mdi-cash-usd-outline mt-1"></i>
                          </div>
                          <div className="ms-3">
                            <p className="text-success mb-1">
                              Upcoming payments
                            </p>
                            <h4 className="mb-0">$120</h4>
                          </div>
                        </div>
                        <div className="mt-3 mb-2">
                          <p className="mb-0">4 not confirmed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4">
                    <div
                      className="card bg-info-subtle"
                      style={{
                        background:
                          "url('assets/images/dashboard/dashboard-shape-3.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom center",
                      }}
                    >
                      <div className="card-body">
                        <div className="d-flex">
                          <div className="avatar avatar-sm avatar-label-info">
                            <i className="mdi mdi-webhook mt-1"></i>
                          </div>
                          <div className="ms-3">
                            <p className="text-info mb-1">Finished appt.</p>
                            <h4 className="mb-0">72</h4>
                          </div>
                        </div>
                        <div className="mt-3 mb-2">
                          <p className="mb-0">
                            <span className="text-primary me-2 fs-14">
                              <i className="fas fa-caret-up me-1"></i>3.4%
                            </span>
                            vs last month
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-xl-8">
                    <div className="card">
                      <div className="card-header">
                        <div className="card-icon">
                          <i className="fas fa-hockey-puck fs-14 text-muted"></i>
                        </div>
                        <h4 className="card-title mb-0">
                          Sales by product category
                        </h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-6">
                            <div className="row mb-2">
                              <div className="col-6">
                                <div>
                                  <p>
                                    <i className="mdi mdi-brightness-5 text-primary me-2"></i>
                                    Clothes{" "}
                                    <span className="text-muted fs-14">
                                      -50%
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="col-6">
                                <div>
                                  <p>
                                    <i className="mdi mdi-briefcase-variant-outline text-danger me-2"></i>
                                    Kids{" "}
                                    <span className="text-muted fs-14">
                                      -50%
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="row mb-2">
                              <div className="col-6">
                                <div>
                                  <p>
                                    <i className="mdi mdi-cart-arrow-right text-info me-2"></i>
                                    Cosmetics{" "}
                                    <span className="text-muted fs-14">
                                      -50%
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="col-6">
                                <div>
                                  <p>
                                    <i className="mdi mdi-checkbox-multiple-blank text-warning me-2"></i>
                                    Men{" "}
                                    <span className="text-muted fs-14">
                                      -50%
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="row mb-2">
                              <div className="col-6">
                                <div>
                                  <p>
                                    <i className="mdi mdi-chess-queen text-success me-2"></i>
                                    Kitchen{" "}
                                    <span className="text-muted fs-14">
                                      -50%
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="col-6">
                                <div>
                                  <p>
                                    <i className="mdi mdi-church text-info me-2"></i>
                                    Decor{" "}
                                    <span className="text-muted fs-14">
                                      -50%
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="row mb-2">
                              <div className="col-6">
                                <div>
                                  <p>
                                    <i className="mdi mdi-city text-warning me-2"></i>
                                    Outdoor{" "}
                                    <span className="text-muted fs-14">
                                      -50%
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="col-6">
                                <div>
                                  <p>
                                    <i className="mdi mdi-currency-usd-circle text-primary me-2"></i>
                                    Lighting{" "}
                                    <span className="text-muted fs-14">
                                      -50%
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="row mb-2">
                              <div className="col-6">
                                <div>
                                  <p>
                                    <i className="mdi mdi-gamepad-circle text-danger me-2"></i>
                                    Dining{" "}
                                    <span className="text-muted fs-14">
                                      -50%
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="col-6">
                                <div>
                                  <p>
                                    <i className="mdi mdi-hexagon-multiple text-info me-2"></i>
                                    Women{" "}
                                    <span className="text-muted fs-14">
                                      -50%
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div>
                              <div
                                id="gradient_chart"
                                data-colors='["--bs-primary", "--bs-success", "--bs-warning", "--bs-danger", "--bs-info", "--bs-dark", "--bs-purple", "--bs-orange"]'
                                className="apex-charts"
                                dir="ltr"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4">
                    <div
                      className="card"
                      style={{ overflowY: "auto", height: "304px" }}
                      data-simplebar=""
                    >
                      <div className="card-header card-header-bordered">
                        <div className="card-icon text-muted">
                          <i className="fa fa-clipboard-list fs-14"></i>
                        </div>
                        <h3 className="card-title">Recent activities</h3>
                        <div className="card-addon">
                          <button className="btn btn-sm btn-label-primary">
                            See all
                          </button>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="timeline timeline-timed">
                          <div className="timeline-item">
                            <span className="timeline-time">10:00</span>
                            <div className="timeline-pin">
                              <i className="marker marker-circle text-primary"></i>
                            </div>
                            <div className="timeline-content">
                              <div>
                                <span>Meeting with</span>
                                <div className="avatar-group ms-2">
                                  <div className="avatar avatar-circle">
                                    <img
                                      src="assets/images/users/avatar-1.png"
                                      alt="Avatar image"
                                      className="avatar-2xs"
                                    />
                                  </div>
                                  <div className="avatar avatar-circle">
                                    <img
                                      src="assets/images/users/avatar-2.png"
                                      alt="Avatar image"
                                      className="avatar-2xs"
                                    />
                                  </div>
                                  <div className="avatar avatar-circle">
                                    <img
                                      src="assets/images/users/avatar-3.png"
                                      alt="Avatar image"
                                      className="avatar-2xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="timeline-item">
                            <span className="timeline-time">14:00</span>
                            <div className="timeline-pin">
                              <i className="marker marker-circle text-danger"></i>
                            </div>
                            <div className="timeline-content">
                              <p className="mb-0">
                                Received a new feedback on{" "}
                                <a href="#">GoFinance</a> App product.
                              </p>
                            </div>
                          </div>
                          <div className="timeline-item">
                            <span className="timeline-time">15:20</span>
                            <div className="timeline-pin">
                              <i className="marker marker-circle text-success"></i>
                            </div>
                            <div className="timeline-content">
                              <p className="mb-0">
                                Lorem ipsum dolor sit amit,consectetur eiusmdd
                                tempor incididunt ut labore et dolore magna.
                              </p>
                            </div>
                          </div>
                          <div className="timeline-item">
                            <span className="timeline-time">17:00</span>
                            <div className="timeline-pin">
                              <i className="marker marker-circle text-info"></i>
                            </div>
                            <div className="timeline-content">
                              <p className="mb-0">
                                Make Deposit <a href="#">USD 700</a> o ESL.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div
                      className="card"
                      style={{ height: "495px", overflow: "hidden auto" }}
                      data-simplebar=""
                    >
                      <div className="card-header">
                        <div className="card-icon text-muted">
                          <i className="fas fa-sync-alt fs-14"></i>
                        </div>
                        <h3 className="card-title">Order Progress</h3>
                        <div className="card-addon dropdown">
                          <button
                            className="btn btn-label-secondary btn-sm dropdown-toggle"
                            data-bs-toggle="dropdown"
                          >
                            {" "}
                            <i className="fas fa-filter fs-12 align-middle ms-1"></i>
                          </button>
                          <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated">
                            <a className="dropdown-item" href="#">
                              <div className="dropdown-icon">
                                <i className="fa fa-poll"></i>
                              </div>
                              <span className="dropdown-content">Today</span>
                            </a>
                            <a className="dropdown-item" href="#">
                              <div className="dropdown-icon">
                                <i className="fa fa-chart-pie"></i>
                              </div>
                              <span className="dropdown-content">
                                Yesterday
                              </span>
                            </a>
                            <a className="dropdown-item" href="#">
                              <div className="dropdown-icon">
                                <i className="fa fa-chart-line"></i>
                              </div>
                              <span className="dropdown-content">Week</span>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive-md">
                          <table className="table text-nowrap mb-0">
                            <thead>
                              <tr>
                                <th>Order ID</th>
                                <th>Status</th>
                                <th>Operators</th>
                                <th>Location</th>
                                <th>Progress</th>
                                <th>Start date</th>
                                <th>Estimation</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="align-middle">837563</td>
                                <td className="align-middle">
                                  <i className="marker marker-dot m-0 me-2 text-primary"></i>{" "}
                                  Arrived
                                </td>
                                <td className="align-middle">
                                  <div className="avatar-group">
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-1.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-2.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-3.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-4.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-5.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">Tokyo</td>
                                <td className="align-middle">
                                  <div className="">
                                    <h6 className="">90%</h6>
                                    <div className="progress progress-sm">
                                      <div
                                        className="progress-bar bg-primary"
                                        style={{ width: "90%" }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">26/06/2023</td>
                                <td className="align-middle">27/06/2023</td>
                              </tr>
                              <tr>
                                <td className="align-middle">982365</td>
                                <td className="align-middle">
                                  <i className="marker marker-dot m-0 me-2 text-danger"></i>{" "}
                                  Pending
                                </td>
                                <td className="align-middle">
                                  <div className="avatar-group">
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-6.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-7.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-8.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">San Francisco</td>
                                <td className="align-middle">
                                  <div className="">
                                    <h6 className="">20%</h6>
                                    <div className="progress progress-sm">
                                      <div
                                        className="progress-bar bg-primary"
                                        style={{ width: "20%" }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">23/04/2023</td>
                                <td className="align-middle">28/04/2023</td>
                              </tr>
                              <tr>
                                <td className="align-middle">872048</td>
                                <td className="align-middle">
                                  <i className="marker marker-dot m-0 me-2 text-success"></i>{" "}
                                  Moving
                                </td>
                                <td className="align-middle">
                                  <div className="avatar-group">
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-5.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-4.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-1.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-2.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">Edinburgh</td>
                                <td className="align-middle">
                                  <div className="">
                                    <h6 className="">75%</h6>
                                    <div className="progress progress-sm">
                                      <div
                                        className="progress-bar bg-primary"
                                        style={{ width: "75%" }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">26/04/2023</td>
                                <td className="align-middle">30/04/2023</td>
                              </tr>
                              <tr>
                                <td className="align-middle">324712</td>
                                <td className="align-middle">
                                  <i className="marker marker-dot m-0 me-2 text-warning"></i>{" "}
                                  Hold
                                </td>
                                <td className="align-middle">
                                  <div className="avatar-group">
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-3.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-4.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-5.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">Tokyo</td>
                                <td className="align-middle">
                                  <div className="">
                                    <h6 className="">30%</h6>
                                    <div className="progress progress-sm">
                                      <div
                                        className="progress-bar bg-primary"
                                        style={{ width: "30%" }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">26/06/2023</td>
                                <td className="align-middle">30/06/2023</td>
                              </tr>
                              <tr>
                                <td className="align-middle">128747</td>
                                <td className="align-middle">
                                  <i className="marker marker-dot m-0 me-2 text-success"></i>{" "}
                                  Moving
                                </td>
                                <td className="align-middle">
                                  <div className="avatar-group">
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-6.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-7.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-8.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-5.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">New York</td>
                                <td className="align-middle">
                                  <div className="">
                                    <h6 className="">60%</h6>
                                    <div className="progress progress-sm">
                                      <div
                                        className="progress-bar bg-primary"
                                        style={{ width: "60%" }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">10/05/2023</td>
                                <td className="align-middle">15/05/2023</td>
                              </tr>
                              <tr>
                                <td className="align-middle">415423</td>
                                <td className="align-middle">
                                  <i className="marker marker-dot m-0 me-2 text-danger"></i>{" "}
                                  Pending
                                </td>
                                <td className="align-middle">
                                  <div className="avatar-group">
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-2.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                    <div className="avatar avatar-circle">
                                      <img
                                        src="assets/images/users/avatar-6.png"
                                        alt="Avatar image"
                                        className="avatar-2xs"
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">London</td>
                                <td className="align-middle">
                                  <div className="">
                                    <h6 className="">72%</h6>
                                    <div className="progress progress-sm">
                                      <div
                                        className="progress-bar bg-primary"
                                        style={{ width: "72%" }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">05/06/2023</td>
                                <td className="align-middle">26/06/2023</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xxl-3">
                <div className="row">
                  <div className="col-xxl-12 col-xl-6 order-1">
                    <div className="card">
                      <div className="card-body">
                        <div className="float-end">
                          <select
                            className="form-select form-select-sm"
                            defaultValue="Apr"
                          >
                            <option>Apr</option>
                            <option value="1">Mar</option>
                            <option value="2">Feb</option>
                            <option value="3">Jan</option>
                          </select>
                        </div>
                        <h4 className="card-title mb-4">Sales Analytics</h4>
                        <div
                          id="pattern_chart"
                          data-colors='["--bs-primary", "--bs-success", "--bs-warning", "--bs-danger", "--bs-info"]'
                          className="apex-charts"
                          dir="ltr"
                        ></div>

                        <div className="row">
                          <div className="col-4">
                            <div className="text-center mt-4">
                              <p className="mb-2 text-truncate">
                                <i className="mdi mdi-circle text-primary font-size-10 me-1"></i>{" "}
                                Product A
                              </p>
                              <h5>42 %</h5>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="text-center mt-4">
                              <p className="mb-2 text-truncate">
                                <i className="mdi mdi-circle text-success font-size-10 me-1"></i>{" "}
                                Product B
                              </p>
                              <h5>26 %</h5>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="text-center mt-4">
                              <p className="mb-2 text-truncate">
                                <i className="mdi mdi-circle text-warning font-size-10 me-1"></i>{" "}
                                Product C
                              </p>
                              <h5>42 %</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-12 order-4 order-xxl-2">
                    <div className="card">
                      <div className="card-header">
                        <div className="card-icon text-muted">
                          <i className="fa fa-bell"></i>
                        </div>
                        <h3 className="card-title">Notification</h3>
                        <div className="card-addon">
                          <div className="dropdown">
                            <button
                              className="btn btn-sm py-0 btn-label-primary dropdown-toggle"
                              data-bs-toggle="dropdown"
                            >
                              All{" "}
                              <i className="mdi mdi-chevron-down fs-17 align-middle ms-1"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated">
                              <a className="dropdown-item" href="#">
                                <span className="badge badge-label-primary">
                                  Personal
                                </span>{" "}
                              </a>
                              <a className="dropdown-item" href="#">
                                <span className="badge badge-label-info">
                                  Work
                                </span>{" "}
                              </a>
                              <a className="dropdown-item" href="#">
                                <span className="badge badge-label-success">
                                  Important
                                </span>{" "}
                              </a>
                              <a className="dropdown-item" href="#">
                                <span className="badge badge-label-danger">
                                  Company
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="rich-list rich-list-bordered rich-list-action">
                          <div className="rich-list-item">
                            <div className="rich-list-prepend">
                              <div className="avatar avatar-xs avatar-label-info">
                                <div className="">
                                  <i className="fa fa-file-invoice"></i>
                                </div>
                              </div>
                            </div>
                            <div className="rich-list-content">
                              <h4 className="rich-list-title mb-1">
                                New report has been received
                              </h4>
                              <p className="rich-list-subtitle mb-0">
                                2 min ago
                              </p>
                            </div>
                            <div className="rich-list-append">
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-label-secondary btn-icon"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="fa fa-ellipsis-h fs-12"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated">
                                  <a className="dropdown-item" href="#">
                                    <div className="dropdown-icon">
                                      <i className="fa fa-check"></i>
                                    </div>
                                    <span className="dropdown-content">
                                      Mark as read
                                    </span>
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    <div className="dropdown-icon">
                                      <i className="fa fa-trash-alt"></i>
                                    </div>
                                    <span className="dropdown-content">
                                      Delete
                                    </span>
                                  </a>
                                  <div className="dropdown-divider"></div>
                                  <a className="dropdown-item" href="#">
                                    <div className="dropdown-icon">
                                      <i className="fa fa-cog"></i>
                                    </div>
                                    <span className="dropdown-content">
                                      Settings
                                    </span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="rich-list-item">
                            <div className="rich-list-prepend">
                              <div className="avatar avatar-xs avatar-label-success">
                                <div className="">
                                  <i className="fa fa-shopping-basket"></i>
                                </div>
                              </div>
                            </div>
                            <div className="rich-list-content">
                              <h4 className="rich-list-title mb-1">
                                Last order was completed
                              </h4>
                              <p className="rich-list-subtitle mb-0">
                                1 hrs ago
                              </p>
                            </div>
                            <div className="rich-list-append">
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-label-secondary btn-icon"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="fa fa-ellipsis-h fs-12"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated">
                                  <a className="dropdown-item" href="#">
                                    <div className="dropdown-icon">
                                      <i className="fa fa-check"></i>
                                    </div>
                                    <span className="dropdown-content">
                                      Mark as read
                                    </span>
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    <div className="dropdown-icon">
                                      <i className="fa fa-trash-alt"></i>
                                    </div>
                                    <span className="dropdown-content">
                                      Delete
                                    </span>
                                  </a>
                                  <div className="dropdown-divider"></div>
                                  <a className="dropdown-item" href="#">
                                    <div className="dropdown-icon">
                                      <i className="fa fa-cog"></i>
                                    </div>
                                    <span className="dropdown-content">
                                      Settings
                                    </span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="rich-list-item">
                            <div className="rich-list-prepend">
                              <div className="avatar avatar-xs avatar-label-danger">
                                <div className="">
                                  <i className="fa fa-users"></i>
                                </div>
                              </div>
                            </div>
                            <div className="rich-list-content">
                              <h4 className="rich-list-title mb-1">
                                Company meeting canceled
                              </h4>
                              <p className="rich-list-subtitle mb-0">
                                5 hrs ago
                              </p>
                            </div>
                            <div className="rich-list-append">
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-label-secondary btn-icon"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="fa fa-ellipsis-h fs-12"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated">
                                  <a className="dropdown-item" href="#">
                                    <div className="dropdown-icon">
                                      <i className="fa fa-check"></i>
                                    </div>
                                    <span className="dropdown-content">
                                      Mark as read
                                    </span>
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    <div className="dropdown-icon">
                                      <i className="fa fa-trash-alt"></i>
                                    </div>
                                    <span className="dropdown-content">
                                      Delete
                                    </span>
                                  </a>
                                  <div className="dropdown-divider"></div>
                                  <a className="dropdown-item" href="#">
                                    <div className="dropdown-icon">
                                      <i className="fa fa-cog"></i>
                                    </div>
                                    <span className="dropdown-content">
                                      Settings
                                    </span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-12 order-3">
                    <div className="card">
                      <div className="card-header">
                        <h4 className="card-title">Compaign Earnings</h4>
                        <div className="dropdown card-addon">
                          <a
                            href="#"
                            className="dropdown-toggle arrow-none card-drop"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="mdi mdi-dots-sidebar"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a
                              href="javascript:void(0);"
                              className="dropdown-item"
                            >
                              Sales Report
                            </a>

                            <a
                              href="javascript:void(0);"
                              className="dropdown-item"
                            >
                              Export Report
                            </a>

                            <a
                              href="javascript:void(0);"
                              className="dropdown-item"
                            >
                              Profit
                            </a>

                            <a
                              href="javascript:void(0);"
                              className="dropdown-item"
                            >
                              Action
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="">
                          <div className="mb-3">
                            <div
                              id="semi_donut_chart"
                              data-colors='["--bs-primary", "--bs-warning"]'
                              className="apex-charts"
                              dir="ltr"
                            ></div>
                          </div>

                          <div className="row justify-content-center mt-n5">
                            <div className="col-6">
                              <div className="p-2 shadow">
                                <p className="text-muted text-truncate mb-2">
                                  Earnings
                                </p>
                                <h5 className="mb-0">
                                  $15.5k{" "}
                                  <span className="fs-12 text-primary ms-2">
                                    <i className="mdi mdi-arrow-up"></i> 17%
                                  </span>
                                </h5>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="p-2 shadow">
                                <p className="text-muted text-truncate mb-2">
                                  Expenses
                                </p>
                                <h5 className="mb-0">
                                  $11.4k{" "}
                                  <span className="fs-12 text-danger ms-2">
                                    <i className="mdi mdi-arrow-down"></i> 14%
                                  </span>
                                </h5>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div
                              id="bar_chart"
                              data-colors='["--bs-danger"]'
                              className="apex-charts"
                              dir="ltr"
                            ></div>
                          </div>

                          <div
                            className="card"
                            style={{
                              background:
                                "url('assets/images/widgets-shape2.png')",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                            }}
                          >
                            <div className="bg-overlay bg-primary-subtle rounded"></div>
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-7">
                                  <h4 className="fs-16 mb-1">
                                    Need more idea?{" "}
                                  </h4>
                                  <p className="text-muted mb-0">
                                    Upgrade to pro max for added benefits.
                                  </p>
                                  <button className="btn btn-primary mt-4">
                                    Upgarde Now
                                  </button>
                                </div>
                                <div className="col-5">
                                  <img
                                    src="assets/images/dashboard/upgarde-1.png"
                                    alt=""
                                    className="img-fluid"
                                    style={{ height: "126px" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-12 col-xl-6 order-2 order-xxl-4">
                    <div className="card">
                      <div className="card-header">
                        <div className="card-icon">
                          <i className="fas fa-calendar-alt fs-14 text-muted"></i>
                        </div>
                        <h4 className="card-title mb-0">Monthly Sales</h4>
                      </div>
                      <div className="card-body">
                        <div
                          id="monthly_states"
                          data-colors='["--bs-success", "--bs-danger", "--bs-warning"]'
                          className="apex-charts"
                          dir="ltr"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xxl-8 col-xl-6">
                <div className="card">
                  <div className="card-header">
                    <div className="card-icon">
                      <i className="fas fa-layer-group fs-14 text-muted"></i>
                    </div>
                    <h4 className="card-title mb-0">Top Selling</h4>
                  </div>

                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-sm-8">
                        <div
                          id="products"
                          data-colors='["--bs-primary"]'
                          className="apex-charts"
                          dir="ltr"
                        ></div>
                      </div>
                      <div className="col-sm-4">
                        <div className="d-grid gap-2">
                          <div className="mb-3">
                            <div className="d-flex justify-content-between">
                              <span className="text-muted">48%</span>
                              <span className="text-muted">Sunday</span>
                            </div>
                            <div className="progress" style={{ height: "6px" }}>
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                                style={{ width: "48%" }}
                              ></div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between">
                              <span className="text-muted">100%</span>
                              <span className="text-muted">Monday</span>
                            </div>
                            <div className="progress" style={{ height: "6px" }}>
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated bg-secondary"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between">
                              <span className="text-muted">40%</span>
                              <span className="text-muted">Tuesday</span>
                            </div>
                            <div className="progress" style={{ height: "6px" }}>
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated bg-danger"
                                style={{ width: "40%" }}
                              ></div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between">
                              <span className="text-muted">68%</span>
                              <span className="text-muted">Wednesday</span>
                            </div>
                            <div className="progress" style={{ height: "6px" }}>
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                                style={{ width: "68%" }}
                              ></div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between">
                              <span className="text-muted">56%</span>
                              <span className="text-muted">Thursday</span>
                            </div>
                            <div className="progress" style={{ height: "6px" }}>
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                                style={{ width: "56%" }}
                              ></div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between">
                              <span className="text-muted">80%</span>
                              <span className="text-muted">Friday</span>
                            </div>
                            <div className="progress" style={{ height: "6px" }}>
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                                style={{ width: "80%" }}
                              ></div>
                            </div>
                          </div>

                          <div className="">
                            <div className="d-flex justify-content-between">
                              <span className="text-muted">80%</span>
                              <span className="text-muted">Saturday</span>
                            </div>
                            <div className="progress" style={{ height: "6px" }}>
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated bg-dark"
                                style={{ width: "92%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xxl-4 col-xl-6">
                <div className="card">
                  <div className="card-header">
                    <div className="card-icon">
                      <i className="fas fa-user-friends fs-14 text-muted"></i>
                    </div>
                    <h4 className="card-title mb-0">User by traffic</h4>
                  </div>

                  <div className="card-body">
                    <div
                      id="user_traffic"
                      data-colors='["--bs-info", "--bs-primary"]'
                      className="apex-charts"
                      dir="ltr"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xl-6">
                <div className="card">
                  <div className="card-header justify-content-between">
                    <div className="card-icon text-muted">
                      <i className="fas fa-sort-amount-up fs-14"></i>
                    </div>
                    <h4 className="card-title">Transaction History</h4>
                    <div className="card-addon dropdown">
                      <button
                        className="btn btn-label-primary py-0 btn-sm dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
                        Option{" "}
                        <i className="mdi mdi-chevron-down fs-17 align-middle ms-1"></i>
                      </button>
                      <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated">
                        <a className="dropdown-item" href="#">
                          <div className="dropdown-icon">
                            <i className="fa fa-poll"></i>
                          </div>
                          <span className="dropdown-content">Report</span>
                        </a>
                        <a className="dropdown-item" href="#">
                          <div className="dropdown-icon">
                            <i className="fa fa-chart-pie"></i>
                          </div>
                          <span className="dropdown-content">Charts</span>
                        </a>
                        <a className="dropdown-item" href="#">
                          <div className="dropdown-icon">
                            <i className="fa fa-chart-line"></i>
                          </div>
                          <span className="dropdown-content">Statistics</span>
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#">
                          <div className="dropdown-icon">
                            <i className="fa fa-cog"></i>
                          </div>
                          <span className="dropdown-content">Settings</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="border-bottom text-center pb-3">
                      <div className="d-flex align-items-center justify-content-center">
                        <span className="text-primary fs-24 me-2">
                          <i className="fas fa-arrow-circle-right"></i>
                        </span>
                        <h4 className="display-5 mb-0">54</h4>
                      </div>
                      <p className="text-muted mb-0">Pending Invoices</p>
                    </div>
                    <div className="d-flex justify-content-between py-3">
                      <p className="text-muted fs-5 mb-0">Invoice details</p>
                      <div className="dropdown">
                        <span
                          className="dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          30 Days{" "}
                          <i className="mdi mdi-chevron-down fs-17 align-middle ms-1"></i>
                        </span>
                        <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated">
                          <a className="dropdown-item" href="#">
                            <div className="dropdown-icon">
                              <i className="fa fa-poll"></i>
                            </div>
                            <span className="dropdown-content">Report</span>
                          </a>
                          <a className="dropdown-item" href="#">
                            <div className="dropdown-icon">
                              <i className="fa fa-chart-pie"></i>
                            </div>
                            <span className="dropdown-content">Charts</span>
                          </a>
                          <a className="dropdown-item" href="#">
                            <div className="dropdown-icon">
                              <i className="fa fa-chart-line"></i>
                            </div>
                            <span className="dropdown-content">Statistics</span>
                          </a>
                          <div className="dropdown-divider"></div>
                          <a className="dropdown-item" href="#">
                            <div className="dropdown-icon">
                              <i className="fa fa-cog"></i>
                            </div>
                            <span className="dropdown-content">Settings</span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="hstack gap-4 justify-content-center pb-3">
                      <div className="text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <span className="text-info fs-22 me-2">
                            <i className="fas fa-arrow-circle-up"></i>
                          </span>
                          <h4 className="display-6 mb-0">28</h4>
                        </div>
                        <p className="text-muted mb-0">Invoice In</p>
                      </div>

                      <div className="text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <span className="text-danger fs-22 me-2">
                            <i className="fas fa-arrow-circle-down"></i>
                          </span>
                          <h4 className="display-6 mb-0">32</h4>
                        </div>
                        <p className="text-muted mb-0">Invoice Out</p>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5 className="fs-6 mb-0">
                          <i className="fas fa-arrow-circle-up text-info me-2"></i>
                          Invoice 1
                        </h5>
                        <p className="text-muted mb-0">+1,235</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5 className="fs-6 mb-0">
                          <i className="fas fa-arrow-circle-down text-danger me-2"></i>
                          Invoice 2
                        </h5>
                        <p className="text-muted mb-0">-152</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5 className="fs-6 mb-0">
                          <i className="fas fa-arrow-circle-down text-danger me-2"></i>
                          Invoice 3
                        </h5>
                        <p className="text-muted mb-0">+13,487</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5 className="fs-6 mb-0">
                          <i className="fas fa-arrow-circle-up text-info me-2"></i>
                          Invoice 4
                        </h5>
                        <p className="text-muted mb-0">-1,523</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div
                  className="card"
                  style={{ height: "416px", overflow: "hidden auto" }}
                  data-simplebar=""
                >
                  <div className="card-header card-header-bordered">
                    <div className="card-icon text-muted">
                      <i className="fa fa-user-tag fs14"></i>
                    </div>
                    <h3 className="card-title">User Feeds</h3>
                  </div>
                  <div className="card-body">
                    <div className="rich-list rich-list-flush">
                      <div className="flex-column align-items-stretch">
                        <div className="rich-list-item">
                          <div className="rich-list-prepend">
                            <div className="avatar avatar-xs">
                              <div className="">
                                <img
                                  src="assets/images/users/avatar-1.png"
                                  alt="Avatar image"
                                  className="avatar-2xs"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="rich-list-content">
                            <h4 className="rich-list-title mb-1">Airi Satou</h4>
                            <p className="rich-list-subtitle mb-0">
                              Accountant
                            </p>
                          </div>
                          <div className="rich-list-append">
                            <button className="btn btn-sm btn-label-primary">
                              Follow
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex-column align-items-stretch">
                        <div className="rich-list-item">
                          <div className="rich-list-prepend">
                            <div className="avatar avatar-xs">
                              <div className="">
                                <img
                                  src="assets/images/users/avatar-2.png"
                                  alt="Avatar image"
                                  className="avatar-2xs"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="rich-list-content">
                            <h4 className="rich-list-title mb-1">
                              Cedric Kelly
                            </h4>
                            <p className="rich-list-subtitle mb-0">
                              Senior Developer
                            </p>
                          </div>
                          <div className="rich-list-append">
                            <button className="btn btn-sm btn-label-primary">
                              Follow
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex-column align-items-stretch">
                        <div className="rich-list-item">
                          <div className="rich-list-prepend">
                            <div className="avatar avatar-xs">
                              <div className="">
                                <img
                                  src="assets/images/users/avatar-4.png"
                                  alt="Avatar image"
                                  className="avatar-2xs"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="rich-list-content">
                            <h4 className="rich-list-title mb-1">
                              Brielle Williamson
                            </h4>
                            <p className="rich-list-subtitle mb-0">
                              Integration Specialist
                            </p>
                          </div>
                          <div className="rich-list-append">
                            <button className="btn btn-sm btn-label-primary">
                              Follow
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex-column align-items-stretch">
                        <div className="rich-list-item">
                          <div className="rich-list-prepend">
                            <div className="avatar avatar-xs">
                              <div className="">
                                <img
                                  src="assets/images/users/avatar-6.png"
                                  alt="Avatar image"
                                  className="avatar-2xs"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="rich-list-content">
                            <h4 className="rich-list-title mb-1">
                              Sonya Frost
                            </h4>
                            <p className="rich-list-subtitle mb-0">
                              Software Engineer
                            </p>
                          </div>
                          <div className="rich-list-append">
                            <button className="btn btn-sm btn-label-primary">
                              Follow
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex-column align-items-stretch">
                        <div className="rich-list-item">
                          <div className="rich-list-prepend">
                            <div className="avatar avatar-xs">
                              <div className="">
                                <img
                                  src="assets/images/users/avatar-5.png"
                                  alt="Avatar image"
                                  className="avatar-2xs"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="rich-list-content">
                            <h4 className="rich-list-title mb-1">Aarya Jeck</h4>
                            <p className="rich-list-subtitle mb-0">Developer</p>
                          </div>
                          <div className="rich-list-append">
                            <button className="btn btn-sm btn-label-primary">
                              Follow
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex-column align-items-stretch">
                        <div className="rich-list-item">
                          <div className="rich-list-prepend">
                            <div className="avatar avatar-xs">
                              <div className="">
                                <img
                                  src="assets/images/users/avatar-7.png"
                                  alt="Avatar image"
                                  className="avatar-2xs"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="rich-list-content">
                            <h4 className="rich-list-title mb-1">
                              Saniya Miroja
                            </h4>
                            <p className="rich-list-subtitle mb-0">
                              UI-UX Designer
                            </p>
                          </div>
                          <div className="rich-list-append">
                            <button className="btn btn-sm btn-label-primary">
                              Follow
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-sm-6">
                <script>document.write(new Date().getFullYear())</script> ©
                Mango Tec
              </div>
              <div className="col-sm-6">
                <div className="text-sm-end d-none d-sm-block">
                  Crafted with <i className="mdi mdi-heart text-danger"></i> by{" "}
                  <a
                    href="http://codebucks.in/"
                    target="_blank"
                    className="text-muted"
                  >
                    Mango technologies
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
