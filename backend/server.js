import express from 'express';
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import validator from 'validator';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const app = express();
const PORT = 5000;
const SECRET = 'your-secret-key';
const db = new sqlite3.Database('./database.sqlite');

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'none'"],
            scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'", "http://localhost:5000"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            requireTrustedTypesFor: ["'script'"],
        },
    },
}));


const authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // Attach user info to the request
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" }); // Let Axios handle the refresh
        }
        res.status(403).json({ message: "Invalid token" });
    }
};

app.get('/api/', authenticate, (req, res) => {
    res.status(200).json({ message: `Welcome to the homepage, ${req.user.username}!` });
});


// SQLite Database Setup
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);
});


app.get('/api/check', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        res.status(200).json({ message: `Welcome, ${decoded.username}!` });
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
});

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

// Apply rate limiting to login and register routes
app.post('/api/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const accessToken = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1m' }); // Short-lived access token
        const refreshToken = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '7d' }); // Long-lived refresh token

        res.cookie('token', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' }); // Add refresh token cookie
        res.status(200).json({ message: "Login successful" });
    });
});


app.post('/api/register', registerLimiter, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            `INSERT INTO users (username, password) VALUES (?, ?)`,
            [username, hashedPassword],
            (err) => {
                if (err) {
                    if (err.message.includes("UNIQUE")) {
                        return res.status(400).json({ message: "Username already exists" });
                    }
                    return res.status(500).json({ message: "Database error" });
                }
                res.status(201).json({ message: "User registered successfully" });
            }
        );
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});


// Logout Route
app.post('/api/logout', (req, res) => {
    const csrfToken = req.headers['csrf-token'];
    if (!csrfToken || csrfToken !== req.csrfToken()) {
        return res.status(403).json({ message: "Invalid CSRF token" });
    }
    res.clearCookie('token'); // Clear access token
    res.clearCookie('refreshToken'); // Clear refresh token
    res.status(200).json({ message: "Logged out successfully" });
});

// Exclude CSRF protection for refresh-token route
app.post('/api/refresh-token', (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token missing" });
    }

    try {
        const decoded = jwt.verify(refreshToken, SECRET);
        const newAccessToken = jwt.sign({ id: decoded.id, username: decoded.username }, SECRET, { expiresIn: '15m' });

        res.cookie('token', newAccessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(200).json({ message: "Token refreshed" });
    } catch (err) {
        console.error("Invalid refresh token:", err);
        return res.status(403).json({ message: "Invalid refresh token" });
    }
});

// Apply CSRF protection after excluding `/api/refresh-token`
app.use(
    csurf({
        cookie: {
            httpOnly: true, // Prevent client-side access
            secure: false,  // Use true in production
            sameSite: 'Strict',
        },
    })
);
// Exclude CSRF for the token endpoint
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
