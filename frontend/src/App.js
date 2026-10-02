import { BrowserRouter, Routes, Route,  Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import MyEvents from "./pages/MyEvents";

import "./Styles/admin.css";

import AdminLayout from "./components/Admin/AdminLayout";
import AdminProtectedRoute from "./components/Admin/AdminProtectedRoute";
import AdminLogin from "./pages/AdminLogin";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminEvents from "./pages/Admin/AdminEvents";
import AdminCategories from "./pages/Admin/AdminCategoies";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminRegistrations from "./pages/Admin/AdminRegistrations";


import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
     <BrowserRouter>
        <AuthProvider>
            <Routes>
                {/* Root */}
                <Route path="/" element={<Navigate to="/home" replace />} />

                {/* Public routes */}
                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/events/:eventId" element={<EventDetails  />} />
                
                <Route path="/my-events" element={<MyEvents />} />

                <Route path="/admin/login" element={<AdminLogin />} />

                {/* protected admin routes */}
                <Route element={<AdminProtectedRoute  />}>

                    <Route path="/admin" element={<AdminLayout />}>

                        {/* /admin->/admin/dashboard */}
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />

                        <Route path="dashboard" element={<AdminDashboard />} />

                        <Route path="events" element={<AdminEvents />} />

                        <Route path="categories" element={<AdminCategories />} />

                        <Route path="users" element={<AdminUsers />} />

                        <Route path="registrations" element={<AdminRegistrations />} />
                    </Route>
                </Route>

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<Home />} />
                </Route>
            </Routes>
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;
