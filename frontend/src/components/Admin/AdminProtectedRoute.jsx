import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}