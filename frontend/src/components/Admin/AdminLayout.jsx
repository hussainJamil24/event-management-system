import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
     const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    return (
        <div className="admin-layout">

            {/* sidebar */}
            <aside className="admin-sidebar">

                <div className="admin-sidebar-header">
                    <h4>Admin Portal</h4>
                    <small>System Management</small>
                </div>

                <nav className="admin-sidebar-nav">

                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `admin-nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <i className="bi bi-grid me-2"></i>
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/events"
                        className={({ isActive }) =>
                            `admin-nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <i className="bi bi-calendar-event me-2"></i>
                        Events
                    </NavLink>

                    <NavLink
                        to="/admin/categories"
                        className={({ isActive }) =>
                            `admin-nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <i className="bi bi-diagram-3 me-2"></i>
                        Categories
                    </NavLink>

                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            `admin-nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <i className="bi bi-people me-2"></i>
                        Users
                    </NavLink>

                    <NavLink
                        to="/admin/registrations"
                        className={({ isActive }) =>
                            `admin-nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <i className="bi bi-person-check me-2"></i>
                        Registrations
                    </NavLink>

                </nav>

                {/* admin profile */}
                <div className="admin-sidebar-footer">

                    <div className="admin-user">
                        <div className="admin-user-icon">
                            <i className="bi bi-person-fill"></i>
                        </div>

                        <div className="admin-user-info">
                            <strong>
                                {user
                                    ? `${user.first_name} ${user.last_name}`
                                    : "Admin User"}
                            </strong>

                            <small
                                onClick={handleLogout}
                                className="admin-signout"
                            >
                                Sign Out
                            </small>
                        </div>
                    </div>

                </div>

            </aside>

            {/* main area */}
            <div className="admin-main">

                {/* top navigation */}
                <header className="admin-topbar">

                    <div className="admin-brand">
                        <i className="bi bi-calendar2-week me-2"></i>
                        EventHub
                    </div>

                    <div className="admin-topbar-actions">

                        <button
                            type="button"
                            className="admin-notification-button"
                        >
                            <i className="bi bi-bell"></i>
                        </button>

                        <div className="admin-avatar">
                            {user?.first_name
                                ? user.first_name.charAt(0).toUpperCase()
                                : "A"}
                        </div>

                    </div>

                </header>

                {/* nested page */}
                <main className="admin-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}