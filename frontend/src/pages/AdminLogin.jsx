import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login, logout } = useAuth();

     // stores the login form values
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // stores validation/backend error message
    const [error, setError] = useState("");

     // stores loading state while login request is running
    const [loading, setLoading] = useState(false);

     // handles input changes
    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // clear error when user starts typing again
        if (error) {
            setError("");
        }
    }

    // handles admin login
    const handleSignIn = async (e) => {
        e.preventDefault();

        // clear previous error
        setError("");

        // validation
        if (!formData.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);

        try {
            // FastAPI OAuth2 expects username and password
            const loginData = new URLSearchParams();

            loginData.append("username", formData.email);
            loginData.append("password", formData.password);

            // send login request to existing backend endpoint
            const response = await api.post(
                "/auth/login",
                loginData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            // store authentication state through AuthContext
             const user = await login(response.data.access_token);

            if (user.role !== "admin") {
                logout();
                setError("You do not have administrator access.");
                return;
            }

            // admin dashboard destination
            navigate("/admin/dashboard");

        } catch (err) {
            console.error("Admin login failed:", err);

            const message =
                err.response?.data?.detail ||
                "Login failed. Please check your email and password.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };



    return (
        <div className= "container min-vh-100 d-flex justify-content-center align-items-center">
            <div style={{background: "#EFF1F3", maxWidth: "600px"}} className="container-fluid d-flex flex-column justify-content-center align-items-center p-5 rounded-5">
                <i className="bi bi-calendar2-week fs-1 eventhub-color"></i>
                <h1 className="eventhub-color fw-bold">EventHub</h1>
                <p>Administrator Portal</p>

                {/* error message */}
                {error && (
                    <div  className="alert alert-danger w-100" role="alert">
                        {error}
                    </div>
                )}

                {/* admin login form */}
                <form onSubmit={handleSignIn}  className="w-100 gap-2 d-flex flex-column">
                    <div className="mb-3">
                        <label className="form-label fw-medium">Email Address</label>
                        <input type="email" name="email" placeholder="admin@example.com" className="form-control" 
                           value={formData.email} onChange={handleChange} required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-medium">Password</label>
                        <input type="password" name="password" placeholder="........" className="form-control" 
                            value={formData.password} onChange={handleChange}required
                        />
                    </div>

                    <button type="submit" className="btn eventhub-button w-100"  disabled={loading}> 
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                </form>

                <hr className="w-100" />

                <p className="text-center mt-3 mb-0"> Administrator access only </p>

            </div>

            
        </div>
    );
}