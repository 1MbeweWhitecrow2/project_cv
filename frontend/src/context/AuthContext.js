import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        if (token) {
            setUser("User"); // Ideally, fetch user details from API
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/login/`, {
                username,
                password,
            });
            setToken(response.data.access);
            setUser(username);
            localStorage.setItem("token", response.data.access);
        } catch (error) {
            console.error("Login failed", error);
            const errorMessage = error.response?.data?.error || "Login failed";
            throw new Error(errorMessage); // Forward exact error message
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

