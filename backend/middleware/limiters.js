import rateLimit from 'express-rate-limit';

// Configure rate limiting for login and register endpoints
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: {
        message: "Too many login attempts from this IP, please try again after 15 minutes",
    },
});

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 registration attempts per windowMs
    message: {
        message: "Too many registration attempts from this IP, please try again after 15 minutes",
    },
});

export { loginLimiter, registerLimiter };
