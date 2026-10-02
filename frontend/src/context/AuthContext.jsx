import {createContext, useContext, useEffect, useState} from "react";
import api from "../services/api.js";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );
    const [loading, setLoading] = useState(true);

    // check if user is already logged in 
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const getCurrentUser = async () => {
            try {
                const response = await api.get("/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);

            } catch (error) {
                console.error("Authentication failed", error);

                localStorage.removeItem("token");
                setToken(null);
                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        getCurrentUser();
    }, [token]);

    // Login user
    const login = async (token) => {

        localStorage.setItem("token", token);
        setToken(token);

        const response = await api.get("/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setUser(response.data);

        return response.data;
    };


    // logout user
    const logout = ()=> {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider> 
    );

}

// Custom hook for accessing authentication
export function useAuth() {
    return useContext(AuthContext);
}