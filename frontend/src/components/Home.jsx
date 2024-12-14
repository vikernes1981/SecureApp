import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/'); // Protected route
                setMessage(response.data?.message || "Welcome to the homepage!");
            } catch (error) {
                setMessage("Unauthorized access. Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
            }
        };

        checkAuth();
    }, [navigate]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Home</h1>
            <p>{message}</p>
        </div>
    );
};

export default Home;
