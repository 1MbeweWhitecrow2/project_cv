import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // 🔴 Error message state
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            await login(username, password);
        } catch (err) {
            setError(err.message); // Display specific backend error
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/AboutProject");
        }
    }, [user, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Log In</h2>
            <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow-lg w-full max-w-md">
                {error && <p className="text-red-600 mb-2">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-3 p-2 border w-full"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-3 p-2 border w-full"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                    Log In
                </button>
            </form>
        </div>
    );
};

export default Login;


