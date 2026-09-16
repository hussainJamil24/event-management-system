import { Link } from "react-router-dom";

export default function Navbar() {
    return(
        <nav className="navbar-container shadow-sm px-2 px-md-4 d-flex justify-content-evenly align-items-center">
            <div className="eventhub-logo">
                <i className="bi bi-calendar2-week fs-2 eventhub-color"></i>
                <h1 className="eventhub-color fw-bold">EventHub</h1>
            </div>

            {/* groups the navigation links */}
            <div className="navigation">
                <ul className="navigation-links ">
                    <li>
                        <Link to="/browse" className="fw-semibold">Browse</Link>
                    </li>

                    <li>
                        <Link to="/my-events" className="fw-semibold">My Events</Link>
                    </li>

                    <li>
                        <Link to="/pricing" className="fw-semibold">Pricing</Link>
                    </li>
                </ul>
            </div>

            <div className="search">
                <i className="bi bi-search"></i>
                <input  type="text" placeholder="Search events..."/>
            </div>

            <div className="authentication">
                <button className="fw-semibold">Sign In</button>
                <button className="join fw-semibold">Join Now</button>
            </div>
        </nav>
    );

}