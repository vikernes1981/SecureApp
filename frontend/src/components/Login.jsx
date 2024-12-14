import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [csrfToken, setCsrfToken] = useState(""); // Store CSRF token
    const navigate = useNavigate();

    // Fetch CSRF token on component mount
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get("/csrf-token");
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error("Failed to fetch CSRF token", error);
            }
        };
        fetchCsrfToken();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "/login",
                { username, password },
                { headers: { "X-CSRF-Token": csrfToken } } // Attach CSRF token
            );
            setMessage(response.data?.message || "Login successful");
            setUsername("");
            setPassword("");
            navigate("/");
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Login;
