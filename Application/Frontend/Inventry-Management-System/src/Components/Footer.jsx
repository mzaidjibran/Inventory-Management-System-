const Footer = () => {
  return (
    <footer
      style={{
        borderTop: "1px solid #e8dcc8",
        padding: "5px 0",
        margin: 0,
        marginTop: "auto",
        background: "#fffdf9",
        fontFamily: "Nunito, sans-serif",
        position: "relative",
      }}
    >
      <div className="container-fluid px-0">
        <div
          className="row align-items-center g-0"
          style={{ margin: "5px 8px" }}
        >
          <div
            className="col-sm-6"
            style={{ fontSize: 11, color: "#b89060", fontWeight: 600 }}
          >
            {new Date().getFullYear()} © Mango Technologies
          </div>
          <div
            className="col-sm-6 text-sm-end d-none d-sm-block"
            style={{ fontSize: 11, color: "#b89060" }}
          >
            Designed & Developed by{" "}
            <a
              href="#"
              style={{
                color: "#c8965a",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Mango Technologies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
