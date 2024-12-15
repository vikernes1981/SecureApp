import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import database from '../utils/db.js';

const SECRET = 'your-secret-key';

export const refreshToken = (req, res) => {
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
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    database.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
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
};

export const register = async (req, res) => {
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
        database.run(
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
};
