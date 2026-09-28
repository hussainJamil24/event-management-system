import { BrowserRouter, Routes, Route,  Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";


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
