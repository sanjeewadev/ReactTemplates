import * as React from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

// ICONS
import { X, Home, LogOut, Menu, TestTubeDiagonal } from "lucide-react";

// PAGES
import AdminHome from "../../pages/admin/home.jsx";
import TestPage from "../../pages/admin/test.jsx";

// STYLES
import "./AdminLayout.css";

const pages = [
  {
    name: "Home",
    icon: <Home size={24} />,
    path: "home",
    heading: "Dashboard Overview",
    component: AdminHome,
  },
  {
    name: "test",
    icon: <TestTubeDiagonal size={24} />,
    path: "test",
    heading: "Test Heading",
    component: TestPage,
  },
  // Add more generic pages here easily
];

export default function AdminLayout() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [adminName, setAdminName] = React.useState("Admin");
  const [pageHeading, setPageHeading] = React.useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Load User Data
  React.useEffect(() => {
    const storedData = localStorage.getItem("adminUser");
    if (storedData) {
      try {
        const parsedUser = JSON.parse(storedData);
        if (parsedUser.name) {
          const firstName = parsedUser.name.split(" ")[0];
          setAdminName(firstName);
        }
      } catch (e) {
        console.error("Failed to parse admin user data", e);
      }
    }
  }, []);

  // Update Header Title based on URL
  React.useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    const currentPage = pages.find((p) => p.path === currentPath);
    setPageHeading(currentPage ? currentPage.heading : "Admin Dashboard");
  }, [location.pathname]);

  const handleLogout = () => {
    // You can add your modal logic here later
    const confirm = window.confirm("Are you sure you want to logout?");
    if (confirm) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      navigate("/admin/login", { replace: true });
    }
  };

  // Close sidebar on mobile when navigating
  const handleMobileNav = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  const sidebarClass = isOpen ? "sidebar-open" : "sidebar-closed";

  return (
    <div className="admin admin-container">
      {/* --- TOP HEADER --- */}
      <header
        className={`admin-header ${isOpen ? "admin-header-open" : "admin-header-closed"}`}>
        <div>
          <h1 key={pageHeading} className="admin-header-title">
            {pageHeading}
          </h1>
        </div>

        <div className="admin-header-profile">
          <div className="admin-header-profile-text">
            <h4 className="profile-role">Admin</h4>
            <p className="profile-name">{adminName}</p>
          </div>
        </div>
      </header>

      {/* --- SIDEBAR --- */}
      <aside className={`admin-sidebar ${sidebarClass}`}>
        <div className="admin-sidebar-header">
          <button
            className="admin-toggle-btn"
            onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>

        {/* NAVIGATION MENU */}
        <nav className="admin-nav">
          {pages.map((p) => (
            <Link
              key={p.path}
              to={`/admin/${p.path}`}
              className={`admin-nav-item ${location.pathname.includes(p.path) ? "active" : ""} ${sidebarClass}`}
              onClick={handleMobileNav}>
              <span className="admin-icon">{p.icon}</span>
              <span className={`admin-nav-label ${sidebarClass}`}>
                {p.name}
              </span>
            </Link>
          ))}

          <div className="admin-nav-divider" />

          <button className="admin-nav-item logout-btn" onClick={handleLogout}>
            <span className="admin-icon">
              <LogOut size={24} />
            </span>
            <span className={`admin-nav-label ${sidebarClass}`}>Logout</span>
          </button>
        </nav>

        {/* SIDEBAR FOOTER (Branding) */}
        <div className="admin-sidebar-footer">
          <a
            href="https://yourwebsite.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-brand-link">
            {/* Optional Logo Here */}
            {/* <div className="sidebar-brand-logo"></div> */}

            <div className={`sidebar-brand-text ${sidebarClass}`}>
              <h4 className="brand-title">Company Name</h4>
              <p className="brand-subtitle">yourwebsite.com</p>
            </div>
          </a>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className={`admin-main ${sidebarClass}`}>
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Navigate to="home" replace />} />
            {pages.map((p) => {
              const Component = p.component;
              return (
                <Route key={p.path} path={p.path} element={<Component />} />
              );
            })}
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        </div>
      </main>

      {/* MOBILE OVERLAY */}
      <div
        className={`admin-overlay ${sidebarClass}`}
        onClick={() => setIsOpen(false)}
      />
    </div>
  );
}
