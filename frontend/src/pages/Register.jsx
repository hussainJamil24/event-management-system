import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import api from "../services/api.js";

export default function Register() {
    const navigate = useNavigate();
    // register form state
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange =(e) =>{
        const {name, value} = e.target;
        setFormData(prevData =>({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();

        if (formData.password.length < 8 || formData.password.length > 12) {
            alert("Your password must be between 8 and 12 characters long.");
            return;
        }

        if(formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        // hadel a registration form submission
        try {
            await api.post("/auth/register", {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
            });

            alert("Registered successfully!");

            navigate("/login");

        } catch(error) {
            console.error("Registration error:", error.response?.data);
            // backend error message
            const message = error.response?.data?.detail || "Registration failed.";
            alert(message);
        }
    };


    return (
        <div className="container min-vh-100 d-flex justify-content-center align-items-center">
            <div style={{background:"#EFF1F3", maxWidth: "600px"}} className="container-fluid d-flex flex-column justify-content-center align-items-center p-5 rounded-5">
                <i className="bi bi-calendar2-week fs-1 eventhub-color"></i>
                <h1 className="eventhub-color fw-bold">EventHub</h1>
                <p>Professional Event Management Portal</p>

                {/* form registration */}
                <form onSubmit={handleSubmit} className="w-100">
                    <div className="mb-3">
                        <label className="form-label fw-medium ">First Name:</label>
                        <input type="text" className="form-control" placeholder="Enter Your First  Name"
                            name="first_name" required
                            value={formData.first_name}
                            onChange={handleChange}
                        /> 
                    </div> 

                    <div className="mb-3">
                        <label className="form-label fw-medium">Last Name:</label>
                        <input type="text" className="form-control" placeholder="Enter Your Last Name"
                            name="last_name" required
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-medium">Email:</label>
                        <input type="email" className="form-control" placeholder="Enter Your Email"
                            name="email" required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-medium">Password:</label>
                        <input type="password" className="form-control" placeholder="Enter Your Password"
                            name="password" required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-medium">Confirm Password:</label>
                        <input type="password" className="form-control" placeholder="Confirm Your Password"
                            name="confirmPassword" required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn eventhub-button w-100">Register</button>
                </form>
     
                <hr></hr>
                <p className="text-center mt-3">
                    Already have an account? 
                    <Link to="/login">Sign In</Link>
                </p>
                                
            </div>
       
        </div>
    );
}