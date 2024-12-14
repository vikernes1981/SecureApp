import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // Include cookies in requests
});

// Attach CSRF token to all requests
api.interceptors.request.use(async (config) => {
    if (!config.headers['X-CSRF-Token']) {
        try {
            const response = await axios.get('/csrf-token', { withCredentials: true });
            config.headers['X-CSRF-Token'] = response.data.csrfToken;
        } catch (error) {
            console.error("Failed to fetch CSRF token:", error);
        }
    }
    return config;
});

// Refresh token on 401 Unauthorized
api.interceptors.response.use(
    (response) => response, // Return response if successful
    async (error) => {
        console.log("Axios Interceptor Caught Error:", error.response?.status);
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh token endpoint
                await api.post('/refresh-token');
                return api(originalRequest); // Retry the original request
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                return Promise.reject(refreshError); // Redirect to login if refresh fails
            }
        }

        return Promise.reject(error);
    }
);

export default api;
