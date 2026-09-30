import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({showSearch = true, showJoin = true, showProfile = false, navbarClassName = ""}) {
    const {isAuthenticated, logout} = useAuth();
    return (
        <nav className={`navbar-container shadow-sm px-2 px-md-4 ${navbarClassName}`}>

            <div className="container-fluid">

                <div className="row align-items-center g-2">

                    {/* Logo */}
                    <div className="col-12 col-md-3 col-lg-2">
                        <div className="eventhub-logo justify-content-center justify-content-md-start">
                            <i className="bi bi-calendar2-week fs-2 eventhub-color"></i>
                            <h1 className="eventhub-color fw-bold mb-0">
                                EventHub
                            </h1>
                        </div>
                    </div>


                    {/* Navigation links */}
                    <div className="col-12 col-md-5 col-lg-4">
                        <div className="navigation">
                            <ul className="navigation-links">
                                <li>
                                    <Link
                                        to="/"
                                        className="fw-semibold"
                                    >
                                        Browse
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/my-events"
                                        className="fw-semibold"
                                    >
                                        My Events
                                    </Link>
                                </li>

                                {showProfile ? (
                                    <li>
                                        <Link
                                            to="/profile"
                                            className="fw-semibold"
                                        >
                                            Profile
                                        </Link>
                                    </li>
                                ) : (
                                    <li>
                                        <Link
                                            to="/pricing"
                                            className="fw-semibold"
                                        >
                                            Pricing
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>


                    {/* Search */}
                    {showSearch && (
                        <div className="col-12 col-md-4 col-lg-3">
                            <div className="search">
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                />
                            </div>
                        </div>
                    )}


                    {/* Authentication */}
                    <div className="col-12 col-lg-3">
                        <div className="authentication justify-content-center justify-content-lg-end">
                            {isAuthenticated ? (
                                <button className="authentication-login fw-semibold" onClick={logout}>
                                    Sign out
                                </button>
                            ) : (
                                <Link to="/login" className="authentication-login fw-semibold">
                                    Sign in
                                </Link>
                            )}
                            

                            {showJoin && (
                                <button className="join fw-semibold">
                                    Join Now
                                </button>
                            )}
                        </div>
                    </div>

                </div>

            </div>

        </nav>
    );
}