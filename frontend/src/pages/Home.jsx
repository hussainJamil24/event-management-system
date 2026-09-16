import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Home() {

     const { user, logout } = useAuth();

    return (
        <>
            <Navbar />

            <div className="container py-5">

                <h1>Welcome to EventHub</h1>

                <p>
                    Hello, {user?.first_name} {user?.last_name}!
                </p>

                <p>
                    Email: {user?.email}
                </p>

                <button
                    className="btn eventhub-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>
        </>
        
    )
}