import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import prot from './middleware/protection.js';
import csrfProtection from './middleware/csurfProt.js';
import router from './routes/authRoutes.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(prot);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});


app.use('/api/', router);

app.post('/api/refresh-token', (req, res, next) => {
    router.handle(req, res, next);
});
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: "Logged out successfully" });
});
// Apply CSRF protection after excluding `/api/refresh-token`
app.use(csrfProtection);
// Exclude CSRF for the token endpoint
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
