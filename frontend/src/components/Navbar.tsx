import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <NavLink to="/" className="logo">
          IUB Lost & Found
        </NavLink>

        {/* Navigation Links */}
        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/browse-items">Browse Items</NavLink>

          <NavLink to="/report-lost">Report Lost</NavLink>

          <NavLink to="/report-found">Report Found</NavLink>
        </nav>

        {/* Authentication */}
        <div className="auth-buttons">
          <NavLink to="/login" className="login-btn">
            Login
          </NavLink>

          <NavLink to="/register" className="register-btn">
            Register
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
