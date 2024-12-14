import React, { useState } from 'react';
import axios from '../utils/axiosConfig';

const Check = () => {
    const [message, setMessage] = useState('');

    const handleCheck = async () => {
        try {
            const response = await axios.get('/check');
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error occurred');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Check Authentication</h1>
            <button
                onClick={handleCheck}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Check Auth
            </button>
            {message && <p className="mt-4 text-lg">{message}</p>}
        </div>
    );
};

export default Check;
