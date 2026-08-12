import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();

    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    University Lost & Found
                </Link>

                {/* Navigation */}
                <div className="navbar-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/browse-items">
                        Browse Items
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link to="/report-lost">
                                Report Lost
                            </Link>

                            <Link to="/report-found">
                                Report Found
                            </Link>

                            <Link to="/my-reports">
                                My Reports
                            </Link>
                        </>
                    )}

                    {/* Admin */}
                    {isAuthenticated &&
                        user?.role === "admin" && (
                            <Link to="/admin/dashboard">
                                Admin Dashboard
                            </Link>
                        )}

                </div>

                {/* Right side */}
                <div className="navbar-auth">

                    {isAuthenticated ? (
                        <>
                            <span className="navbar-user">
                                Hi, {user?.name}
                            </span>

                            <button
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="login-btn"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="register-btn"
                            >
                                Register
                            </Link>
                        </>
                    )}

                </div>

            </div>
        </nav>
    );
}