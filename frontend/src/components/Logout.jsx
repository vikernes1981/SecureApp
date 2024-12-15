import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const Logout = () => {
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleLogout = async () => {
        setLoading(true);
        try {
            await axios.post("/logout");
            navigate('/login'); // Redirect to login
        } catch (error) {
            console.error("Logout failed:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleLogout} disabled={loading}>
            {loading ? "Logging out..." : "Logout"}
        </button>
    );
};

export default Logout;
