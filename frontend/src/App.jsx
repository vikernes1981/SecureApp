import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import api from "./utils/axiosConfig";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
    const [message, setMessage] = useState("");
    const [authMessage, setAuthMessage] = useState("");

    const login = async () => {
        try {
            const response = await api.post("/login", { username: "test" });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        }
    };

    const logout = async () => {
        try {
            const response = await api.post("/logout");
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Logout failed");
        }
    };
    

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
