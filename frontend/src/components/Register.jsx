import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [csrfToken, setCsrfToken] = useState(""); // Store CSRF token
    const navigate = useNavigate();

    // Fetch CSRF token on component mount
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get("/csrf-token", { withCredentials: true });
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error("Failed to fetch CSRF token", error);
            }
        };
        fetchCsrfToken();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "/register",
                { username, password },
                { headers: { "X-CSRF-Token": csrfToken } } // Attach CSRF token
            );
            setMessage(response.data?.message || "Registration successful");
            setUsername("");
            setPassword("");
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            setMessage(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
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
                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Register;
